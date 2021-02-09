import describeSalesOfferPackage, {
    sopInfoSchema,
    checkUserInput,
} from '../../../src/pages/api/describeSalesOfferPackage';
import { getMockRequestAndResponse } from '../../testData/mockData';
import {
    ErrorInfo,
    SalesOfferPackageInfo,
    SalesOfferPackageInfoWithErrors,
    SalesOfferPackage,
    SalesOfferPackageWithErrors,
} from '../../../src/interfaces';
import * as sessionUtils from '../../../src/utils/sessions';
import * as aurora from '../../../src/data/auroradb';
import { SOP_ATTRIBUTE, SOP_INFO_ATTRIBUTE } from '../../../src/constants';

describe('describeSalesOfferPackage', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessionUtils, 'updateSessionAttribute');
    const insertSalesOfferPackageSpy = jest
        .spyOn(aurora, 'insertSalesOfferPackage')
        .mockImplementation(() => Promise.resolve());

    const mockError: ErrorInfo = expect.objectContaining({ errorMessage: expect.any(String), id: expect.any(String) });

    const mockSopInfoAttribute: SalesOfferPackageInfo = {
        purchaseLocations: ['OnBus', 'Shop', 'Mobile'],
        paymentMethods: ['Card', 'Cash'],
        ticketFormats: ['Paper', 'Mobile'],
    };
    const mockSopInfoAttributeWithErrors: SalesOfferPackageInfoWithErrors = {
        purchaseLocations: [],
        paymentMethods: ['Card', 'Cash'],
        ticketFormats: [],
        errors: [mockError, mockError],
    };
    const mockSopAttribute: SalesOfferPackage = {
        name: 'Sales Offer Package',
        description: 'This is a sales offer package',
        ...mockSopInfoAttribute,
    };
    const mockSopAttributeWithErrors: SalesOfferPackageWithErrors = {
        name: '',
        description: '',
        ...mockSopInfoAttribute,
        errors: [mockError, mockError],
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('sopInfoSchema', () => {
        it.each([
            [{}, false],
            [{ name: 'Adult Weekly Rider' }, false],
            [{ description: 'This is a sales offer package' }, false],
            [{ name: 'Really long way of saying Adult Weekly Rider' }, false],
            [
                {
                    description:
                        'Exceptionally long description of a sales offer package which could have just been something smaller',
                },
                false,
            ],
            [
                {
                    name: 'Really long way of saying Adult Weekly Rider',
                    description: 'A description that is just ever so slightly a bit too long',
                },
                false,
            ],
            [{ name: 'Adult Weekly Rider', description: 'Available on bus, with cash and card' }, true],
        ])('should validate that %s is %s', (candidate, validity) => {
            const result = sopInfoSchema.isValidSync(candidate);
            expect(result).toEqual(validity);
        });
    });

    describe('checkUserInput', () => {
        it('should return a SOP object with no errors when user input is valid', async () => {
            const mockSOPWithUserInput: SalesOfferPackage = {
                name: 'Adult Weekly Rider',
                description: 'Available on bus, with cash and card',
                ...mockSopInfoAttribute,
            };
            const actualInputCheck = await checkUserInput(mockSOPWithUserInput);
            expect(actualInputCheck).toEqual(mockSOPWithUserInput);
        });

        it('should return a SOP object containing errors when user input is not valid', async () => {
            const mockSOPMissingUserInput: SalesOfferPackage = {
                name: '',
                description: '',
                ...mockSopInfoAttribute,
            };
            const actualInputCheck = await checkUserInput(mockSOPMissingUserInput);
            expect(actualInputCheck).toEqual(mockSopAttributeWithErrors);
        });
    });

    it('should throw an error if SOP_INFO_ATTRIBUTE is missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                salesOfferPackageName: 'Sales Offer Package',
                salesOfferPackageDescription: 'This is a sales offer package',
            },
        });
        await describeSalesOfferPackage(req, res);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should throw an error if SOP_INFO_ATTRIBUTE contains errors', async () => {
        const { req, res } = getMockRequestAndResponse({
            session: {
                [SOP_INFO_ATTRIBUTE]: mockSopInfoAttributeWithErrors,
            },
            body: {
                salesOfferPackageName: 'Sales Offer Package',
                salesOfferPackageDescription: 'This is a sales offer package',
            },
        });
        await describeSalesOfferPackage(req, res);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should update the SOP_ATTRIBUTE and redirect to itself (i.e. /describeSalesOfferPackage) when validation results in errors', async () => {
        const { req, res } = getMockRequestAndResponse({
            session: {
                [SOP_INFO_ATTRIBUTE]: mockSopInfoAttribute,
            },
            body: { salesOfferPackageName: '', salesOfferPackageDescription: '' },
        });
        await describeSalesOfferPackage(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, SOP_ATTRIBUTE, mockSopAttributeWithErrors);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/describeSalesOfferPackage',
        });
    });

    it('should reset the SOP_ATTRIBUTE and SOP_INFO_ATTRIBUTE, insert into aurora and redirect to /selectSalesOfferPackages when there are no errors', async () => {
        const { req, res } = getMockRequestAndResponse({
            session: {
                [SOP_INFO_ATTRIBUTE]: mockSopInfoAttribute,
            },
            body: {
                salesOfferPackageName: 'Sales Offer Package',
                salesOfferPackageDescription: 'This is a sales offer package',
            },
        });
        await describeSalesOfferPackage(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, SOP_INFO_ATTRIBUTE, undefined);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, SOP_ATTRIBUTE, undefined);
        expect(insertSalesOfferPackageSpy).toHaveBeenCalledWith('TEST', mockSopAttribute);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });
});
