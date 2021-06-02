import * as React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import SalesConfirmation, {
    buildSalesConfirmationElements,
    getServerSideProps,
} from '../../src/pages/salesConfirmation';
import { getMockContext } from '../testData/mockData';
import { PRODUCT_DATE_ATTRIBUTE } from '../../src/constants/attributes';

describe('pages', () => {
    describe('confirmation', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <SalesConfirmation
                    salesOfferPackages={[
                        {
                            name: 'A sales offer package',
                            description: 'my way of selling tickets',
                            purchaseLocations: ['at stop', 'website'],
                            paymentMethods: ['cash'],
                            ticketFormats: ['paper'],
                        },
                    ]}
                    ticketDating={{
                        productDates: {
                            startDate: '2017-03-13T18:00:00+00:00',
                            endDate: '2057-03-13T18:00:00+00:00',
                            dateInput: {
                                startDateDay: '13',
                                startDateMonth: '03',
                                startDateYear: '2017',
                                endDateDay: '13',
                                endDateMonth: '03',
                                endDateYear: '2057',
                            },
                        },
                        endDefault: true,
                        startDefault: true,
                    }}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        const baseExpectedProps = { salesOfferPackages: expect.any(Array), csrfToken: '' };
        const mockStartDate = '2018-12-30T18:00:00+00:00Z';
        const mockEndDate = '2020-12-30T18:00:00+00:00Z';
        const mockDateInput = {
            startDateDay: '30',
            startDateMonth: '12',
            startDateYear: '2018',
            endDateDay: '20',
            endDateMonth: '12',
            endDateYear: '2020',
        };

        it('should extract the start date and end date from the PRODUCT_DATE_ATTRIBUTE when the user has entered both', () => {
            const ctx = getMockContext({
                session: {
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: mockStartDate,
                        endDate: mockEndDate,
                        dateInput: mockDateInput,
                    },
                },
            });
            const expectedProps = {
                ...baseExpectedProps,
                ticketDating: {
                    productDates: { startDate: mockStartDate, endDate: mockEndDate, dateInput: mockDateInput },
                    startDefault: false,
                    endDefault: false,
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });

        it('should set the start date and end date as defaults when the user has entered neither', () => {
            const ctx = getMockContext();
            const expectedProps = {
                ...baseExpectedProps,
                ticketDating: {
                    productDates: {
                        startDate: expect.any(String),
                        endDate: expect.any(String),
                        dateInput: {
                            startDateDay: '',
                            startDateMonth: '',
                            startDateYear: '',
                            endDateDay: '',
                            endDateMonth: '',
                            endDateYear: '',
                        },
                    },
                    startDefault: true,
                    endDefault: true,
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });

        it('should extract the start date and default the end date when the user has only entered the start date', () => {
            const ctx = getMockContext({
                session: { [PRODUCT_DATE_ATTRIBUTE]: { startDate: mockStartDate } },
            });
            const expectedProps = {
                ...baseExpectedProps,
                ticketDating: {
                    productDates: { startDate: mockStartDate, endDate: expect.any(String) },
                    startDefault: false,
                    endDefault: true,
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });

        it('should extract the end date and default the start date when the user has only entered the end date', () => {
            const ctx = getMockContext({
                session: { [PRODUCT_DATE_ATTRIBUTE]: { endDate: mockEndDate } },
            });
            const expectedProps = {
                ...baseExpectedProps,
                ticketDating: {
                    productDates: { startDate: expect.any(String), endDate: mockEndDate },
                    startDefault: true,
                    endDefault: false,
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });
    });

    describe('buildSalesConfirmationElements', () => {
        it('builds confirmation elements for the sales information', () => {
            const result = buildSalesConfirmationElements(
                [
                    {
                        name: 'A sales offer package',
                        description: 'my way of selling tickets',
                        purchaseLocations: ['at stop', 'website'],
                        paymentMethods: ['cash'],
                        ticketFormats: ['paper'],
                    },
                    {
                        name: 'Another sales offer package',
                        description: 'another way of selling tickets',
                        purchaseLocations: ['in station', 'phone'],
                        paymentMethods: ['mobileDevice'],
                        ticketFormats: ['phone'],
                    },
                ],
                {
                    productDates: {
                        startDate: moment().toISOString(),
                        endDate: moment()
                            .add(100, 'years')
                            .toISOString(),
                        dateInput: {
                            startDateDay: '',
                            startDateMonth: '',
                            startDateYear: '',
                            endDateDay: '',
                            endDateMonth: '',
                            endDateYear: '',
                        },
                    },
                    endDefault: true,
                    startDefault: true,
                },
            );
            expect(result).toStrictEqual([
                {
                    content: 'my way of selling tickets',
                    href: 'selectSalesOfferPackage',
                    name: 'Sales offer package 1 - A sales offer package',
                },
                {
                    content: 'another way of selling tickets',
                    href: 'selectSalesOfferPackage',
                    name: 'Sales offer package 2 - Another sales offer package',
                },
                {
                    content: moment().format('DD-MM-YYYY'),
                    href: 'productDateInformation',
                    name: 'Ticket start date (default)',
                },
                {
                    content: moment()
                        .add(100, 'years')
                        .format('DD-MM-YYYY'),
                    href: 'productDateInformation',
                    name: 'Ticket end date (default)',
                },
            ]);
        });
    });
});
