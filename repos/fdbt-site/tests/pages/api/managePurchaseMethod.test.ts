import { getMockRequestAndResponse } from '../../testData/mockData';
import managePurchaseMethod from '../../../src/pages/api/managePurchaseMethod';
import * as session from '../../../src/utils/sessions';
import { GS_PURCHASE_METHOD_ATTRIBUTE } from '../../../src/constants/attributes';
import * as db from '../../../src/data/auroradb';
import { FromDb, SalesOfferPackage } from '../../../src/interfaces/matchingJsonTypes';

jest.mock('../../../src/data/auroradb');
const insertSpy = jest.spyOn(db, 'insertSalesOfferPackage');
const updateSpy = jest.spyOn(db, 'updateSalesOfferPackage');
const getSpy = jest.spyOn(db, 'getSalesOfferPackagesByNocCode');

describe('managePurchaseMethod', () => {
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');

    beforeEach(() => {
        jest.resetAllMocks();
        getSpy.mockResolvedValue([]);
    });

    it('redirects back to /managePurchaseMethod if there are no options selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        await managePurchaseMethod(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod',
        });
    });

    it('redirects back to /managePurchaseMethod if only one purchaseLocations is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                purchaseLocations: 'OnBoard',
                name: 'a name',
                isCapped: 'false',
            },
        });
        const expectedSessionAttributeCall = {
            inputs: {
                purchaseLocations: ['OnBoard'],
                ticketFormats: [],
                paymentMethods: [],
                name: 'a name',
                isCapped: false,
            },
            errors: [
                {
                    id: 'checkbox-0-cash',
                    errorMessage: 'Select at least one option for how tickets can be paid for',
                },
                {
                    id: 'checkbox-0-paper-ticket',
                    errorMessage: 'Select at least one option for the ticket format',
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

    it('redirects back to /managePurchaseMethod if only one paymentMethods is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                paymentMethods: 'Cash',
                name: 'a name',
                isCapped: false,
            },
        });
        const expectedSessionAttributeCall = {
            inputs: {
                purchaseLocations: [],
                ticketFormats: [],
                paymentMethods: ['Cash'],
                name: 'a name',
                isCapped: false,
                id: undefined,
            },
            errors: [
                {
                    id: 'checkbox-0-on-board',
                    errorMessage: 'Select at least one option for where the ticket can be sold',
                },
                {
                    id: 'checkbox-0-paper-ticket',
                    errorMessage: 'Select at least one option for the ticket format',
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

    it('redirects back to /managePurchaseMethod if only one ticketFormats is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                ticketFormats: 'Paper Ticket',
                name: 'a name',
                isCapped: false,
            },
        });
        const expectedSessionAttributeCall = {
            inputs: {
                purchaseLocations: [],
                ticketFormats: ['Paper Ticket'],
                paymentMethods: [],
                name: 'a name',
                isCapped: false,
                id: undefined,
            },
            errors: [
                {
                    id: 'checkbox-0-on-board',
                    errorMessage: 'Select at least one option for where the ticket can be sold',
                },
                {
                    id: 'checkbox-0-cash',
                    errorMessage: 'Select at least one option for how tickets can be paid for',
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

    it('redirects back to /managePurchaseMethod if one selection is missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'a name',
                isCapped: false,
            },
        });
        const expectedSessionAttributeCall = {
            inputs: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                paymentMethods: [],
                name: 'a name',
                isCapped: false,
                id: undefined,
            },
            errors: [
                {
                    id: 'checkbox-0-cash',
                    errorMessage: 'Select at least one option for how tickets can be paid for',
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

    it('redirects back to /managePurchaseMethod if no name', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                paymentMethods: ['Cash'],
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                isCapped: false,
            },
        });
        const expectedSessionAttributeCall = {
            inputs: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                paymentMethods: ['Cash'],
                name: '',
                isCapped: false,
                id: undefined,
            },
            errors: [
                {
                    id: 'purchase-method-name',
                    errorMessage: 'Name must be provided',
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

    it('redirects back to /managePurchaseMethod if name is duplicated', async () => {
        getSpy.mockResolvedValueOnce([{ id: 99, name: 'my name' } as FromDb<SalesOfferPackage>]);

        const { req, res } = getMockRequestAndResponse({
            body: {
                paymentMethods: ['Cash'],
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'my name',
                isCapped: false,
            },
        });
        const expectedSessionAttributeCall = {
            inputs: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                paymentMethods: ['Cash'],
                name: 'my name',
                isCapped: false,
                id: undefined,
            },
            errors: [
                {
                    id: 'purchase-method-name',
                    errorMessage: 'You already have a purchase method named my name. Choose another name.',
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
                isCapped: false,
            },
        });

        const expected = {
            purchaseLocations: ['OnBoard', 'Online Account'],
            ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
            paymentMethods: ['Cash'],
            name: 'a name',
            isCapped: false,
            id: undefined,
        };

        await managePurchaseMethod(req, res);

        expect(updateSpy).not.toBeCalled();
        expect(insertSpy).toBeCalledWith('TEST', expected);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, GS_PURCHASE_METHOD_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewPurchaseMethods',
        });
    });

    it('redirects to /viewPurchaseMethods when at least one option has been selected from each section and capped ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                purchaseLocations: ['OnBoard', 'Online Account'],
                paymentMethods: ['Cash'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'a name',
                isCapped: 'true',
            },
        });

        const expected = {
            purchaseLocations: ['OnBoard', 'Online Account'],
            ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
            paymentMethods: ['Cash'],
            name: 'a name',
            isCapped: true,
        };

        await managePurchaseMethod(req, res);

        expect(updateSpy).not.toBeCalled();
        expect(insertSpy).toBeCalledWith('TEST', expected);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, GS_PURCHASE_METHOD_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewPurchaseMethods',
        });
    });

    it('updates and redirects to /viewPurchaseMethods when a valid edit is performed', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                id: 77,
                purchaseLocations: ['OnBoard', 'Online Account'],
                paymentMethods: ['Cash'],
                ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
                name: 'a name',
                isCapped: false,
            },
        });

        const expected: SalesOfferPackage = {
            id: 77,
            purchaseLocations: ['OnBoard', 'Online Account'],
            ticketFormats: ['Paper Ticket', 'Debit/Credit card'],
            paymentMethods: ['Cash'],
            name: 'a name',
            isCapped: false,
        };

        await managePurchaseMethod(req, res);

        expect(insertSpy).not.toBeCalled();
        expect(updateSpy).toBeCalledWith('TEST', expected);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, GS_PURCHASE_METHOD_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewPurchaseMethods',
        });
    });

    it('redirects back to /managePurchaseMethod?id= if an invalid edit', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: { id: '77' },
        });

        await managePurchaseMethod(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/managePurchaseMethod?id=77',
        });
    });
});
