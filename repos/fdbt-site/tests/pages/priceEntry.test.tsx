import * as React from 'react';
import { shallow } from 'enzyme';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';
import { NextPageContext } from 'next';
import PriceEntry from '../../src/pages/priceEntry';
import { STAGE_NAMES_COOKIE } from '../../src/constants';

const mockFareStages: string[] = [
    'Briggate',
    'Chapeltown',
    'Chapel Allerton',
    'Moortown',
    'Harrogate Road',
    'Harehills',
    'Gipton',
    'Armley',
    'Stanningley',
    'Pudsey',
    'Seacroft',
    'Rothwell',
    'Dewsbury',
    'Wakefield',
];

describe('Price Entry Page', () => {
    const mockStageNamesCookieBody = '';
    const stageNames = ['Bewbush', 'Chorlton', 'Green Lane', 'Ashbury'];

    it('should render correctly', () => {
        const tree = shallow(<PriceEntry stageNamesArray={mockFareStages} />);
        expect(tree).toMatchSnapshot();
    });

    it('redirects to error page if stage names cookie does not exist', () => {
        const mockWriteHeadFn = jest.fn();
        const mockEndFn = jest.fn();
        const res = new MockRes();
        res.writeHead = mockWriteHeadFn;
        res.end = mockEndFn;

        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            headers: {
                host: 'localhost:5000',
                cookie: `othername=${mockStageNamesCookieBody}`,
            },
            cookies: {
                STAGE_NAMES_COOKIE: stageNames,
            },
        });
        const ctx: NextPageContext = {
            res,
            req,
            pathname: '',
            query: {},
            AppTree: () => <div />,
        };
        const result = PriceEntry.getInitialProps(ctx);

        expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
            Location: '/error',
        });
        expect(mockEndFn).toHaveBeenCalled();
        expect(result).toEqual({});
    });

    it('redirects to error page if no stage names can be found', () => {
        const mockWriteHeadFn = jest.fn();
        const mockEndFn = jest.fn();
        const res = new MockRes();
        res.writeHead = mockWriteHeadFn;
        res.end = mockEndFn;

        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            headers: {
                host: 'localhost:5000',
                cookie: `${STAGE_NAMES_COOKIE}=${mockStageNamesCookieBody}`,
            },
            cookies: {
                STAGE_NAMES_COOKIE: stageNames,
            },
        });
        const ctx: NextPageContext = {
            res,
            req,
            pathname: '',
            query: {},
            AppTree: () => <div />,
        };
        const result = PriceEntry.getInitialProps(ctx);

        expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
            Location: '/error',
        });
        expect(mockEndFn).toHaveBeenCalled();
        expect(result).toEqual({});
    });
});
