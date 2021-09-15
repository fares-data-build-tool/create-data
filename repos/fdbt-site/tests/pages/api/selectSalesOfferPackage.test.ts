import { ExpiryUnit } from '../../../shared/matchingJsonTypes';
import { MULTIPLE_PRODUCT_ATTRIBUTE, SALES_OFFER_PACKAGES_ATTRIBUTE } from '../../../src/constants/attributes';
import { MultiProduct } from '../../../src/interfaces';
import selectSalesOfferPackages, { sanitiseReqBody } from '../../../src/pages/api/selectSalesOfferPackage';
import * as session from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('selectSalesOfferPackage', () => {
    it('redirects back to /selectSalesOfferPackages if there are no sales offer packages selected, single product', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                'product-TestProduct': '',
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
                'product-TestProduct': '',
                'product-SecondTestProduct': '',
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
                'product-TestProduct': [
                    '{"name":"Onboard (cash)","description":"","purchaseLocations":["onBoard"],"paymentMethods":["cash"],"ticketFormats":["paperTicket"]}',
                    '',
                ],
            },
            session: {
                [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                    products: [],
                },
            },
        });

        selectSalesOfferPackages(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, SALES_OFFER_PACKAGES_ATTRIBUTE, [
            {
                name: 'Onboard (cash)',
                description: '',
                purchaseLocations: ['onBoard'],
                paymentMethods: ['cash'],
                ticketFormats: ['paperTicket'],
            },
        ]);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/productDateInformation',
        });
        updateSessionAttributeSpy.mockRestore();
    });

    it('redirects to /productDateInformation if there are sales offer packages selected, and updates SalesOfferPackage Attribute differently if there are multiple products', () => {
        const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            body: {
                'product-TestProduct': [
                    '{"name":"Onboard (cash)","description":"","purchaseLocations":["onBoard"],"paymentMethods":["cash"],"ticketFormats":["paperTicket"]}',
                    '',
                ],
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
                productName: 'TestProduct',
                salesOfferPackages: [
                    {
                        description: '',
                        name: 'Onboard (cash)',
                        paymentMethods: ['cash'],
                        purchaseLocations: ['onBoard'],
                        ticketFormats: ['paperTicket'],
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
                    'product-TestProduct': '',
                },
            });
            const result = sanitiseReqBody(req);
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
                    'product-TestProduct': [
                        '{"name":"Onboard (cash)","description":"","purchaseLocations":["onBoard"],"paymentMethods":["cash"],"ticketFormats":["paperTicket"]}',
                        '',
                    ],
                },
            });
            const result = sanitiseReqBody(req);
            expect(result.errors.length).toBe(0);
            expect(result.sanitisedBody).toStrictEqual({
                TestProduct: [
                    {
                        name: 'Onboard (cash)',
                        description: '',
                        purchaseLocations: ['onBoard'],
                        paymentMethods: ['cash'],
                        ticketFormats: ['paperTicket'],
                    },
                ],
            });
            expect(result.sanitisedBody.TestProduct[0]).toEqual({
                name: 'Onboard (cash)',
                description: '',
                purchaseLocations: ['onBoard'],
                paymentMethods: ['cash'],
                ticketFormats: ['paperTicket'],
            });
        });
    });
});
