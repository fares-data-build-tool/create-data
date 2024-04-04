import * as session from '../../../src/utils/sessions';
import {
    getMockRequestAndResponse,
    mockSelectCapValidityFieldset,
    mockSelectCapValidityFieldsetWithErrors,
    mockSelectCapValidityFieldsetWithInputErrors,
} from '../../testData/mockData';
import * as index from '../../../src/utils/apiUtils';
import { CREATE_CAPS_ATTRIBUTE } from '../../../src/constants/attributes';
import createCaps from '../../../src/pages/api/createCaps';
import * as db from '../../../src/data/auroradb';
import { CapExpiryUnit, FromDb } from 'src/interfaces/matchingJsonTypes';
import { Cap, ErrorInfo } from 'src/interfaces';
import { getFieldset } from '../../../src/pages/createCaps';

describe('createCaps', () => {
    const writeHeadMock = jest.fn();
    jest.mock('../../../src/data/auroradb');
    const insertSpy = jest.spyOn(db, 'insertCaps');
    const updateSpy = jest.spyOn(db, 'updateCaps');
    const getCapsSpy = jest.spyOn(db, 'getCaps');

    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
    jest.spyOn(index, 'getAndValidateNoc').mockReturnValue('BLAC');
    beforeEach(() => {
        jest.spyOn(db, 'getFareDayEnd').mockImplementation(() => Promise.resolve('2200'));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to /createCaps if there is no user entry', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: '',
                capPriceInput0: '',
                capDurationInput0: '',
                capDurationUnitsInput0: '',
                capProductValidity0: '',
                capProductEndTime0: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            capDetails: {
                durationAmount: '',
                durationUnits: '',
                name: '',
                price: '',
                capExpiry: { productValidity: '', productEndTime: '' },
            },
            errors: [
                { errorMessage: 'Cap name cannot have less than 2 characters', id: 'cap-name' },
                { errorMessage: 'Cap price cannot be empty', id: 'cap-price' },
                { errorMessage: 'Cap duration cannot be empty', id: 'cap-period-duration-quantity' },
                { errorMessage: 'Choose an option from the dropdown', id: 'cap-duration-unit' },
                { errorMessage: 'Select a cap expiry', id: 'cap-expiry' },
            ],
        });
    });

    it('should redirect if the end of service day option selected and no fare day end has been set in global settings', async () => {
        jest.spyOn(db, 'getFareDayEnd').mockImplementation(() => Promise.resolve(''));

        const errors: ErrorInfo[] = [
            {
                id: 'product-end-time',
                errorMessage: 'No fare day end defined',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'hello',
                capPrice: '1',
                capDuration: '2',
                capDurationUnits: 'week',
                capProductValidity: 'fareDayEnd',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            capDetails: {
                durationAmount: '2',
                durationUnits: 'week',
                name: 'hello',
                price: '1',
                capExpiry: { productValidity: 'fareDayEnd', productEndTime: '' },
            },
            errors,
        });

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });
    });

    it('redirects back to /createCaps if the user entry contains mistakes', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'hello',
                capPrice: '',
                capDuration: '2',
                capDurationUnits: '',
                capProductValidity: 'endOfCalendarDay',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            capDetails: {
                durationAmount: '2',
                durationUnits: '',
                name: 'hello',
                price: '',
                capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
            },
            errors: [
                { errorMessage: 'Cap price cannot be empty', id: 'cap-price' },
                { errorMessage: 'Choose an option from the dropdown', id: 'cap-duration-unit' },
            ],
        });
    });

    it('redirects back to /createCaps if the user enters 0 as an input', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'Name',
                capPrice: '0',
                capDuration: '2',
                capDurationUnits: 'week',
                capProductValidity: 'endOfCalendarDay',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            capDetails: {
                durationAmount: '2',
                durationUnits: 'week',
                name: 'Name',
                price: '0',
                capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
            },
            errors: [{ errorMessage: 'Cap prices cannot be zero', id: 'cap-price' }],
        });
    });

    it('redirects back to /createCaps if the cap name already exists', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'Cap 1',
                capPrice: '2',
                capDuration: '2',
                capDurationUnits: 'week',
                capProductValidity: 'endOfCalendarDay',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        const cap: FromDb<Cap> = {
            capDetails: {
                name: 'Cap 1',
                price: '4',
                durationAmount: '2',
                durationUnits: 'week' as CapExpiryUnit,
                capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
            },
            id: 2,
        };

        getCapsSpy.mockResolvedValueOnce([cap]);

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            capDetails: {
                durationAmount: '2',
                durationUnits: 'week',
                name: 'Cap 1',
                price: '2',
                capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
            },
            errors: [{ errorMessage: 'You already have a cap named Cap 1. Choose another name.', id: 'cap-name' }],
        });
    });

    it('redirects back to /viewCaps on user input', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'Cap 1',
                capPrice: '2',
                capDuration: '2',
                capDurationUnits: 'month',
                capProductValidity: 'endOfCalendarDay',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        const expected = {
            capDetails: {
                name: 'Cap 1',
                price: '2',
                durationAmount: '2',
                durationUnits: 'month',
                capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
            },
        };
        getCapsSpy.mockResolvedValueOnce([]);

        await createCaps(req, res);
        expect(updateSpy).not.toBeCalled();
        expect(insertSpy).toBeCalledWith(undefined, expected);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, undefined);
    });

    it('redirects back to /viewCaps on user input with fare day end product validity', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'Cap 1',
                capPrice: '2',
                capDuration: '2',
                capDurationUnits: 'month',
                capProductValidity: 'fareDayEnd',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        const expected = {
            capDetails: {
                name: 'Cap 1',
                price: '2',
                durationAmount: '2',
                durationUnits: 'month',
                capExpiry: { productValidity: 'fareDayEnd', productEndTime: '' },
            },
        };
        getCapsSpy.mockResolvedValueOnce([]);

        await createCaps(req, res);
        expect(updateSpy).not.toBeCalled();
        expect(insertSpy).toBeCalledWith(undefined, expected);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, undefined);
    });

    it('redirects back to /viewCaps on edit mode', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'Cap 1',
                capPrice: '2',
                capDuration: '2',
                capDurationUnits: 'month',
                id: '1',
                capProductValidity: 'endOfCalendarDay',
                capProductEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        const expected = {
            capDetails: {
                name: 'Cap 1',
                price: '2',
                durationAmount: '2',
                durationUnits: 'month',
                capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
            },
        };
        getCapsSpy.mockResolvedValueOnce([]);

        await createCaps(req, res);
        expect(insertSpy).not.toBeCalled();
        expect(updateSpy).toBeCalledWith(undefined, 1, expected);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, undefined);
    });

    describe('getFieldset', () => {
        it('should return fieldsets with no errors when no errors are passed', () => {
            const emptyErrors: ErrorInfo[] = [];
            const fieldsets = getFieldset(emptyErrors, '');
            expect(fieldsets).toEqual(mockSelectCapValidityFieldset);
        });

        it('should return fieldsets with radio errors when radio errors are passed', () => {
            const radioErrors: ErrorInfo[] = [
                {
                    errorMessage: 'Choose one of the validity options',
                    id: 'cap-end-calendar',
                },
            ];
            const fieldsets = getFieldset(radioErrors, '');
            expect(fieldsets).toEqual(mockSelectCapValidityFieldsetWithErrors);
        });

        it('should return fieldsets with input errors when input errors are passed', () => {
            const inputErrors: ErrorInfo[] = [
                {
                    errorMessage: 'Specify an end time for fare day end',
                    id: 'product-end-time',
                },
            ];
            const fieldsets = getFieldset(inputErrors, '');
            expect(fieldsets).toEqual(mockSelectCapValidityFieldsetWithInputErrors);
        });
    });
});
