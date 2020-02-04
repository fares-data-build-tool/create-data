/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import Service from '../../src/pages/service';
import { OPERATOR_COOKIE } from '../../src/constants';
import { getServicesByNocCode, ServiceType } from '../../src/data/dynamodb';

jest.mock('../../src/data/dynamodb');

const mockServices: ServiceType[] = [{ lineName: '123' }, { lineName: 'X1' }, { lineName: 'Infinity Line' }];

describe('pages', () => {
    describe('service', () => {
        beforeEach(() => {
            (getServicesByNocCode as any).mockImplementation(() => mockServices);
        });

        it('should render correctly', () => {
            const tree = shallow(<Service operator="Connexions Buses" services={mockServices} />);
            expect(tree).toMatchSnapshot();
        });

        it('return operator value when operator cookie exists', async () => {
            (getServicesByNocCode as any).mockImplementation(() => []);
            const operator = 'MCT';
            const MockRes = require('mock-res');

            const res = new MockRes();

            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22nocCode%22%3A%22IWBC%22%2C%22uuid%22%3A%223f8d5a32-b480-4370-be9a-60d366422a87%22%7D`,
                },
                cookies: {
                    OPERATOR_COOKIE: operator,
                },
            });
            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = await Service.getInitialProps(ctx);
            expect(result).toEqual({ operator, services: [] });
        });

        it('redirect with operator value when operator cookie exists', async () => {
            const operator = 'MCT';
            const MockRes = require('mock-res');

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
                    cookie: `anotherName=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%223f8d5a32-b480-4370-be9a-60d366422a87%22%7D`,
                },
                cookies: {
                    OPERATOR_COOKIE: operator,
                },
            });
            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = await Service.getInitialProps(ctx);

            expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
                Location: '/error',
            });
            expect(mockEndFn).toHaveBeenCalled();
            expect(result).toEqual({});
        });
    });
});
