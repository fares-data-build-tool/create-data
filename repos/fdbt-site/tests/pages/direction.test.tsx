import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';

import Direction from '../../src/pages/direction';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../src/constants';
import { getJourneyPatternsAndLocalityByNocCodeAndLineName, ServiceInformation } from '../../src/data/dynamodb';

jest.mock('../../src/data/dynamodb');

const mockServiceInfo: ServiceInformation = {
    serviceDescription: 'Harrogate - Beckwith Knowle',
    journeyPatterns: [
        {
            startPoint: {
                Display: 'Harrogate Bus Station Stand 5, Harrogate',
                Id: '3200YND90060',
            },
            endPoint: {
                Display: 'Harrogate Bus Station Stand 6, Harrogate',
                Id: '3200YND90060',
            },
        },
        {
            startPoint: {
                Display: 'Harrogate Place 1, Harrogate',
                Id: '000HGTPL1000',
            },
            endPoint: {
                Display: 'Harrogate Place 2, Harrogate',
                Id: '000HGTPL2000',
            },
        },
        {
            startPoint: {
                Display: 'Pannal, Harrogate',
                Id: '000PNAL0010',
            },
            endPoint: {
                Display: 'Knaresborough Bus Station, Harrogate',
                Id: '000KSBRG0020',
            },
        },
    ],
};

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (({ ...getJourneyPatternsAndLocalityByNocCodeAndLineName } as jest.Mock).mockImplementation(
                () => mockServiceInfo,
            ));
        });

        it('should render correctly', () => {
            const tree = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('shows operator name above the select box', () => {
            const wrapper = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            const journeyWelcome = wrapper.find('#direction-operator-linename-hint').first();

            expect(journeyWelcome.text()).toBe('Connexions Buses - X6A');
        });
        it('shows a list of journey patterns for the service in the select box', () => {
            const wrapper = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            const serviceJourney = wrapper.find('.journey-option');

            expect(serviceJourney).toHaveLength(3);
            expect(serviceJourney.first().text()).toBe(
                'Harrogate Bus Station Stand 5, Harrogate TO Harrogate Bus Station Stand 6, Harrogate',
            );
            expect(serviceJourney.at(1).text()).toBe('Harrogate Place 1, Harrogate TO Harrogate Place 2, Harrogate');
            expect(serviceJourney.at(2).text()).toBe('Pannal, Harrogate TO Knaresborough Bus Station, Harrogate');
        });

        it('returns operator value and list of services when operator cookie exists with NOCCode', async () => {
            const operator = 'HCTY';
            const lineName = 'X6A';

            const res = new MockRes();

            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22${lineName}%2329%2F04%2F2019%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%7D`,
                },
                cookies: {
                    OPERATOR_COOKIE: operator,
                    SERVICE_COOKIE: lineName,
                },
            });
            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = await Direction.getInitialProps(ctx);
            expect(result).toEqual({
                Operator: operator,
                lineName,
                serviceInfo: mockServiceInfo,
            });
        });
        it('redirects to the error page if no journey patterns can be found', async () => {
            (({ ...getJourneyPatternsAndLocalityByNocCodeAndLineName } as jest.Mock).mockImplementation(() =>
                Promise.resolve(null),
            ));
            const operator = 'HCTY';
            const lineName = 'X6A';

            const mockWriteHeadFn = jest.fn();
            const mockEndFn = jest.fn();
            const res = new MockRes();
            res.writeHead = mockWriteHeadFn;
            res.end = mockEndFn;

            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22${lineName}%2329%2F04%2F2019%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%7D`,
                },
                cookies: {
                    OPERATOR_COOKIE: operator,
                    SERVICE_COOKIE: lineName,
                },
            });

            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = await Direction.getInitialProps(ctx);

            expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
                Location: '/error',
            });
            expect(mockEndFn).toHaveBeenCalled();
            expect(result).toEqual({});
        });
        it('redirects to the error page if the operator or service cookies do not exist', async () => {
            const operator = 'HCTY';
            const lineName = 'X6A';

            const mockWriteHeadFn = jest.fn();
            const mockEndFn = jest.fn();
            const res = new MockRes();
            res.writeHead = mockWriteHeadFn;
            res.end = mockEndFn;

            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: `cookieOne=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; fdbt-faretype-cookie=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%7D; cookieTwo=%7B%22service%22%3A%22${lineName}%2329%2F04%2F2019%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%7D`,
                },
                cookies: {
                    OPERATOR_COOKIE: operator,
                    SERVICE_COOKIE: lineName,
                },
            });

            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = await Direction.getInitialProps(ctx);

            expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
                Location: '/error',
            });
            expect(mockEndFn).toHaveBeenCalled();
            expect(result).toEqual({});
        });
    });
});
