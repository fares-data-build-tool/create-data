import { getMockRequestAndResponse } from '../../testData/mockData';
import managePurchaseMethod from '../../../src/pages/api/managePurchaseMethod';
import * as session from '../../../src/utils/sessions';
import { GlobalSettingsAttribute } from '../../../src/interfaces';
import { GS_PURCHASE_METHOD_ATTRIBUTE } from '../../../src/constants/attributes';
import { SalesOfferPackage, FromDb } from '../../../shared/matchingJsonTypes';
import * as db from '../../../src/data/auroradb';

jest.mock('../../../src/data/auroradb');
const insertSpy = jest.spyOn(db, 'insertSalesOfferPackage');
const getSpy = jest.spyOn(db, 'getSalesOfferPackagesByNocCode');

describe('managePurchaseMethod', () => {
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
        getSpy.mockResolvedValue([]);
    });

    it('redirects back to /managePurchaseMethod if there are no options selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        managePurchaseMethod(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if only one purchaseLocations is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                purchaseLocations: 'OnBoard',
                name: 'a name',
            },
        });
        const expectedSessionAttributeCall: GlobalSettingsAttribute<SalesOfferPackage> = {
            inputs: {
                purchaseLocations: ['OnBoard'],
                ticketFormats: [],
                paymentMethods: [],
                name: 'a name',
            },
            errors: [
                {
                    id: 'checkbox-0-cash',
                    errorMessage: expect.any(String),
                },
                {
                    id: 'checkbox-0-paper-ticket',
                    errorMessage: expect.any(String),
                },
            ],
        };

        managePurchaseMethod(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            GS_PURCHASE_METHOD_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if only one paymentMethods is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                paymentMethods: 'Cash',
                name: 'a name',
            },
        });
        const expectedSessionAttributeCall: GlobalSettingsAttribute<SalesOfferPackage> = {
            inputs: {
                purchaseLocations: [],
                ticketFormats: [],
                paymentMethods: ['Cash'],
                name: 'a name',
            },
            errors: [
                {
                    id: 'checkbox-0-on-board',
                    errorMessage: expect.any(String),
                },
                {
                    id: 'checkbox-0-paper-ticket',
                    errorMessage: expect.any(String),
                },
            ],
        };

        managePurchaseMethod(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            GS_PURCHASE_METHOD_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if only one ticketFormats is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                ticketFormats: 'Paper Ticket',
                name: 'a name',
            },
        });
        const expectedSessionAttributeCall: GlobalSettingsAttribute<SalesOfferPackage> = {
            inputs: {
                purchaseLocations: [],
                ticketFormats: ['Paper Ticket'],
                paymentMethods: [],
                name: 'a name',
            },
            errors: [
                {
                    id: 'checkbox-0-on-board',
                    errorMessage: expect.any(String),
                },
                {
                    id: 'checkbox-0-cash',
                    errorMessage: expect.any(String),
                },
            ],
        };

        managePurchaseMethod(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            GS_PURCHASE_METHOD_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if one selection is missing', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'a name',
            },
        });
        const expectedSessionAttributeCall: GlobalSettingsAttribute<SalesOfferPackage> = {
            inputs: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                paymentMethods: [],
                name: 'a name',
            },
            errors: [
                {
                    id: 'checkbox-0-cash',
                    errorMessage: expect.any(String),
                },
            ],
        };

        managePurchaseMethod(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            GS_PURCHASE_METHOD_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if no name', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                paymentMethods: ['Cash'],
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
            },
        });
        const expectedSessionAttributeCall: GlobalSettingsAttribute<SalesOfferPackage> = {
            inputs: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                paymentMethods: ['Cash'],
                name: '',
            },
            errors: [
                {
                    id: 'purchase-method-name',
                    errorMessage: expect.any(String),
                },
            ],
        };

        managePurchaseMethod(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            GS_PURCHASE_METHOD_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if name is duplicated', async () => {
        getSpy.mockResolvedValueOnce([{ id: 99, name: 'my name' } as FromDb<SalesOfferPackage>]);

        const { req, res } = getMockRequestAndResponse({
            body: {
                paymentMethods: ['Cash'],
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'my name',
            },
        });
        const expectedSessionAttributeCall: GlobalSettingsAttribute<SalesOfferPackage> = {
            inputs: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                paymentMethods: ['Cash'],
                name: 'my name',
            },
            errors: [
                {
                    id: 'purchase-method-name',
                    errorMessage: expect.any(String),
                },
            ],
        };

        await managePurchaseMethod(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            GS_PURCHASE_METHOD_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects to /viewPurchaseMethods when at least one option has been selected from each section', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                paymentMethods: ['Cash'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'a name',
            },
        });

        const expected: SalesOfferPackage = {
            purchaseLocations: ['OnBoard', 'Online Account'],
            ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
            paymentMethods: ['Cash'],
            name: 'a name',
        };

        await managePurchaseMethod(req, res);

        expect(insertSpy).toBeCalledWith('TEST', expected);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, GS_PURCHASE_METHOD_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewPurchaseMethods',
        });
    });
});
