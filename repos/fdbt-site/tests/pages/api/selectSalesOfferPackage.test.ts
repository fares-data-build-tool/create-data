import { SalesOfferPackage } from '../../../src/interfaces/index';
import selectSalesOfferPackages, { sanitiseReqBody } from '../../../src/pages/api/selectSalesOfferPackage';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as session from '../../../src/utils/sessions';

describe('selectSalesOfferPackage', () => {
    it('redirects back to /selectSalesOfferPackages if there are no sales offer packages selected, single product', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                TestProduct: '',
            },
        });

        selectSalesOfferPackages(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });

    it('redirects back to /selectSalesOfferPackages if there are no sales offer packages selected, multiple product', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                TestProduct: '',
                SecondTestProduct: '',
            },
        });

        selectSalesOfferPackages(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });

    it('redirects to /productDateInformation if there are sales offer packages selected', () => {
        const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            body: {
                TestProduct: [
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
                TestProduct: [
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
                            productDurationUnits: 'week',
                            productValidity: '24hr',
                        },
                        {
                            productName: 'Day Ticket',
                            productPrice: '2.50',
                            productDuration: '1',
                            productDurationUnits: 'year',
                            productValidity: '24hr',
                        },
                        {
                            productName: 'Monthly Ticket',
                            productPrice: '200',
                            productDuration: '28',
                            productDurationUnits: 'month',
                            productValidity: 'endOfCalendarDay',
                        },
                    ],
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
                    TestProduct: '',
                },
            });
            const result = sanitiseReqBody(req);
            expect(result.errors).toStrictEqual([
                {
                    errorMessage: 'Choose at least one sales offer package from the options',
                    id: 'TestProduct-checkbox-0',
                },
            ]);
            expect(result.sanitisedBody).toStrictEqual({});
        });
        it('returns an object with a string matching the SalesOfferPackage object structure', () => {
            const { req } = getMockRequestAndResponse({
                body: {
                    TestProduct: [
                        '{"name":"Onboard (cash)","description":"","purchaseLocations":["onBoard"],"paymentMethods":["cash"],"ticketFormats":["paperTicket"]}',
                        '',
                    ],
                },
            });
            const result = sanitiseReqBody(req);
            expect(result.errors.length).toBe(0);
            expect(result.sanitisedBody).toStrictEqual({
                TestProduct: [
                    '{"name":"Onboard (cash)","description":"","purchaseLocations":["onBoard"],"paymentMethods":["cash"],"ticketFormats":["paperTicket"]}',
                ],
            });
            expect(JSON.parse(result.sanitisedBody.TestProduct[0])).toMatchObject<SalesOfferPackage>({
                name: 'Onboard (cash)',
                description: '',
                purchaseLocations: ['onBoard'],
                paymentMethods: ['cash'],
                ticketFormats: ['paperTicket'],
            });
        });
    });
});
