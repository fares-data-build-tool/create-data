import { ExpiryUnit } from 'fdbt-types/matchingJsonTypes';
import { MULTIPLE_PRODUCT_ATTRIBUTE, SALES_OFFER_PACKAGES_ATTRIBUTE } from '../../../src/constants/attributes';
import { MultiProduct } from '../../../src/interfaces';
import selectSalesOfferPackages, { sanitiseReqBody } from '../../../src/pages/api/selectSalesOfferPackage';
import * as session from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('selectSalesOfferPackage', () => {
    it('redirects back to /selectSalesOfferPackages if there are no sales offer packages selected, single product', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                '^0000-product-TestProduct': '',
            },
        });

        selectSalesOfferPackages(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });

    it('redirects back to /selectSalesOfferPackages if there are no sales offer packages selected, multiple product', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                '^0000-product-TestProduct': '',
                '^0001-product-SecondTestProduct': '',
            },
        });

        selectSalesOfferPackages(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });

    it('redirects to /productDateInformation if there are sales offer packages selected', () => {
        const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            body: {
                'product-Weekly Ticket':
                    '{"id":1,"name":"Adult","description":"","purchaseLocations":["mobileDevice"],"paymentMethods":["mobilePhone"],"ticketFormats":["paperTicket","smartCard"]}',
                'price-Weekly Ticket-Adult': '22',
                'product-Day Ticket':
                    '{"id":1,"name":"Adult","description":"","purchaseLocations":["mobileDevice"],"paymentMethods":["mobilePhone"],"ticketFormats":["paperTicket","smartCard"]}',
                'price-Day Ticket-Adult': '22',
                'product-Monthly Ticket':
                    '{"id":1,"name":"Adult","description":"","purchaseLocations":["mobileDevice"],"paymentMethods":["mobilePhone"],"ticketFormats":["paperTicket","smartCard"]}',
                'price-Monthly Ticket-Adult': '22',
            },
            session: {
                [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                    products: [
                        {
                            productName: 'Weekly Ticket',
                            productPrice: '50',
                            productDuration: '5',
                            productDurationUnits: ExpiryUnit.WEEK,
                            productValidity: '24hr',
                        },
                        {
                            productName: 'Day Ticket',
                            productPrice: '2.50',
                            productDuration: '1',
                            productDurationUnits: ExpiryUnit.YEAR,
                            productValidity: '24hr',
                        },
                        {
                            productName: 'Monthly Ticket',
                            productPrice: '200',
                            productDuration: '28',
                            productDurationUnits: ExpiryUnit.MONTH,
                            productValidity: 'endOfCalendarDay',
                        },
                    ] as MultiProduct[],
                },
            },
        });

        selectSalesOfferPackages(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, SALES_OFFER_PACKAGES_ATTRIBUTE, [
            {
                productName: 'Weekly Ticket',
                salesOfferPackages: [
                    {
                        description: '',
                        id: 1,
                        name: 'Adult',
                        paymentMethods: ['mobilePhone'],
                        purchaseLocations: ['mobileDevice'],
                        ticketFormats: ['paperTicket', 'smartCard'],
                    },
                ],
            },
            {
                productName: 'Day Ticket',
                salesOfferPackages: [
                    {
                        description: '',
                        id: 1,
                        name: 'Adult',
                        paymentMethods: ['mobilePhone'],
                        purchaseLocations: ['mobileDevice'],
                        ticketFormats: ['paperTicket', 'smartCard'],
                    },
                ],
            },
            {
                productName: 'Monthly Ticket',
                salesOfferPackages: [
                    {
                        description: '',
                        id: 1,
                        name: 'Adult',
                        paymentMethods: ['mobilePhone'],
                        purchaseLocations: ['mobileDevice'],
                        ticketFormats: ['paperTicket', 'smartCard'],
                    },
                ],
            },
        ]);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/productDateInformation',
        });
        updateSessionAttributeSpy.mockRestore();
    });

    describe('sanitiseReqBody', () => {
        it('fills an error array if the user has not selected a SOP for each product', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    '^0000-product-TestProduct': '',
                },
            });
            const result = sanitiseReqBody(req, [{ productName: 'TestProduct' }]);
            expect(result.errors).toStrictEqual([
                {
                    errorMessage: 'Choose at least one sales offer package from the options',
                    id: 'product-TestProduct-checkbox-0',
                },
            ]);
            expect(result.sanitisedBody).toStrictEqual({});
        });
        it('returns an object with a string matching the SalesOfferPackage object structure', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    'product-TestProduct':
                        '{"id":1,"name":"Adult","description":"","purchaseLocations":["mobileDevice"],"paymentMethods":["mobilePhone"],"ticketFormats":["paperTicket","smartCard"]}',
                    'price-First product-Adult': '22',
                },
            });

            const result = sanitiseReqBody(req, [{ productName: 'TestProduct' }]);
            expect(result.errors.length).toBe(0);
            expect(result.sanitisedBody).toStrictEqual({
                TestProduct: [
                    {
                        id: 1,
                        name: 'Adult',
                        description: '',
                        purchaseLocations: ['mobileDevice'],
                        paymentMethods: ['mobilePhone'],
                        ticketFormats: ['paperTicket', 'smartCard'],
                    },
                ],
            });
            expect(result.sanitisedBody.TestProduct[0]).toEqual({
                id: 1,
                name: 'Adult',
                description: '',
                purchaseLocations: ['mobileDevice'],
                paymentMethods: ['mobilePhone'],
                ticketFormats: ['paperTicket', 'smartCard'],
            });
        });
    });
});
