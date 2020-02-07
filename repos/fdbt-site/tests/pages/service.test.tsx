/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import Service from '../../src/pages/service';
import { OPERATOR_COOKIE } from '../../src/constants';
import { getServicesByNocCode, ServiceType } from '../../src/data/dynamodb';

jest.mock('../../src/data/dynamodb');

const mockServices: ServiceType[] = [
    { lineName: '123', startDate: '2020-02-05' },
    { lineName: 'X1', startDate: '2020-02-06' },
    { lineName: 'Infinity Line', startDate: '2020-02-07' },
];

describe('pages', () => {
    describe('service', () => {
        beforeEach(() => {
            (getServicesByNocCode as any).mockImplementation(() => mockServices);
        });

        it('should render correctly', () => {
            const tree = shallow(<Service operator="Connexions Buses" services={mockServices} />);
            expect(tree).toMatchSnapshot();
        });

        it('shows operator name above the select box', () => {
            const wrapper = shallow(<Service operator="Connexions Buses" services={mockServices} />);
            const operatorWelcome = wrapper.find('#service-operator-hint').first();

            expect(operatorWelcome.text()).toBe('Connexions Buses');
        });

        it('shows a list of services for the operator in the select box', () => {
            const wrapper = shallow(<Service operator="Connexions Buses" services={mockServices} />);
            const operatorServices = wrapper.find('.service-option');

            expect(operatorServices).toHaveLength(3);
            expect(operatorServices.first().text()).toBe('123 [Start date 2020-02-05]');
            expect(operatorServices.at(1).text()).toBe('X1 [Start date 2020-02-06]');
            expect(operatorServices.at(2).text()).toBe('Infinity Line [Start date 2020-02-07]');
        });

        it('returns operator value and list of services when operator cookie exists with NOCCode', async () => {
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
            expect(result).toEqual({
                operator,
                services: [
                    {
                        lineName: '123',
                        startDate: '2020-02-05',
                    },
                    {
                        lineName: 'X1',
                        startDate: '2020-02-06',
                    },
                    {
                        lineName: 'Infinity Line',
                        startDate: '2020-02-07',
                    },
                ],
            });
        });

        it('redirects to error page if no services can be found', async () => {
            (getServicesByNocCode as any).mockImplementation(() => []);
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

            expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
                Location: '/error',
            });
            expect(mockEndFn).toHaveBeenCalled();
            expect(result).toEqual({});
        });

        it('redirects to error page if operator cookie does not exist', async () => {
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
                    cookie: `othername=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%223f8d5a32-b480-4370-be9a-60d366422a87%22%7D`,
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
