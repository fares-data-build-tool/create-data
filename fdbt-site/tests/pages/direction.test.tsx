import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';

import Direction from '../../src/pages/direction';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../src/constants';
import { getServiceByNocCodeAndLineName, getNaptanInfoByAtcoCode, ServiceInformation } from '../../src/data/dynamodb';
import { serviceData } from '../testData/fareData';

jest.mock('../../src/data/dynamodb');

const mockServiceInfo: ServiceInformation = {
    serviceDescription: '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
    operatorShortName: 'HCTY',
    journeyPatterns: [
        {
            startPoint: { Display: 'Estate (Hail and Ride) N/B, tet', Id: '13003921A' },
            endPoint: { Display: 'Interchange Stand B, tet', Id: '13003655B' },
            stopList: [
                '13003921A',
                '13003305E',
                '13003306B',
                '13003618B',
                '13003622B',
                '13003923B',
                '13003939H',
                '13003625C',
                '13003612D',
                '13003611B',
                '13003609E',
                '13003661E',
                '13003949C',
                '13003635B',
                '13003655B',
            ],
        },
        {
            startPoint: { Display: 'Interchange Stand B, tet', Id: '13003655B' },
            endPoint: { Display: 'Estate (Hail and Ride) N/B, tet', Id: '13003921A' },
            stopList: [
                '13003655B',
                '13003654G',
                '13003609A',
                '13003611F',
                '13003612H',
                '13003625G',
                '13003939D',
                '13003923F',
                '13003622F',
                '13003621F',
                '13003618F',
                '13003306A',
                '13003305A',
                '13003921A',
            ],
        },
    ],
};

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => serviceData));
            (({ ...getNaptanInfoByAtcoCode } as jest.Mock).mockImplementation(() => ({ localityName: 'tet' })));
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

            expect(serviceJourney).toHaveLength(2);
            expect(serviceJourney.first().text()).toBe('Estate (Hail and Ride) N/B, tet TO Interchange Stand B, tet');
            expect(serviceJourney.at(1).text()).toBe('Interchange Stand B, tet TO Estate (Hail and Ride) N/B, tet');
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
            (({ ...getServiceByNocCodeAndLineName } as jest.Mock).mockImplementation(() => Promise.resolve(null)));
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

            await expect(Direction.getInitialProps(ctx)).rejects.toThrow();
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

            await expect(Direction.getInitialProps(ctx)).rejects.toThrow(
                'Necessary cookies not found to show direction page',
            );
        });
    });
});
