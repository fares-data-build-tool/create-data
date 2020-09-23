import { getMockRequestAndResponse } from '../../testData/mockData';
import returnValidity, {
    returnValiditySchema,
    getErrorIdFromValidityError,
    formatRequestBody,
} from '../../../src/pages/api/returnValidity';
import * as sessions from '../../../src/utils/sessions';
import { RETURN_VALIDITY_ATTRIBUTE } from '../../../src/constants';
import { ErrorInfo } from '../../../src/interfaces';

describe('returnValidity', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('returnValiditySchema', () => {
        it.each([
            [{}, false],
            [{ validity: 'No' }, true],
            [{ validity: 'Yes' }, false],
            [{ validity: 'Yes', amount: '5' }, false],
            [{ validity: 'Yes', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '7', duration: 'day' }, true],
            [{ validity: 'Yes', amount: 'abc', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '   ', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '0', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '-17', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '1.74', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '6', duration: 'hello there' }, false],
            [{ validity: 'Yes', amount: '365', duration: 'day' }, true],
            [{ validity: 'Yes', amount: '366', duration: 'day' }, false],
            [{ validity: 'Yes', amount: '260', duration: 'week' }, true],
            [{ validity: 'Yes', amount: '261', duration: 'week' }, false],
            [{ validity: 'Yes', amount: '120', duration: 'month' }, true],
            [{ validity: 'Yes', amount: '121', duration: 'month' }, false],
            [{ validity: 'Yes', amount: '5', duration: 'year' }, true],
        ])('should validate that %s is %s', (candidate, validity) => {
            const result = returnValiditySchema.isValidSync(candidate);
            expect(result).toEqual(validity);
        });
    });

    describe('getErrorIdFromValidityError', () => {
        it.each([
            ['return-validity-defined', 'validity'],
            ['return-validity-amount', 'amount'],
            ['return-validity-units', 'duration'],
        ])('should return the id as %s when the error path is %s', (expectedId, errorPath) => {
            const actualId = getErrorIdFromValidityError(errorPath);
            expect(actualId).toEqual(expectedId);
        });

        it('should throw an error when the error path does not match a valid input field', () => {
            expect(() => getErrorIdFromValidityError('notValid')).toThrow();
        });
    });

    describe('formatRequestBody', () => {
        it('should remove whitespace from the request body text input of amount', () => {
            const reqBodyParams = { validity: 'Yes' };
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: { amount: '   2   4', ...reqBodyParams },
            });
            const filtered = formatRequestBody(req);
            expect(filtered).toEqual({ amount: '24', ...reqBodyParams });
        });
    });

    it('should throw an error and redirect to the error page when the session is invalid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            mockWriteHeadFn: writeHeadMock,
        });
        await returnValidity(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the RETURN_VALIDITY_ATTRIBUTE and redirect to /selectSalesOfferPackage when no errors are found and validity info is entered', async () => {
        const mockPassengerTypeDetails = {
            amount: '6',
            typeOfDuration: 'week',
        };
        const mockBody = {
            amount: '6',
            duration: 'week',
            validity: 'Yes',
        };
        const { req, res } = getMockRequestAndResponse({
            body: mockBody,
            mockWriteHeadFn: writeHeadMock,
        });
        await returnValidity(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, RETURN_VALIDITY_ATTRIBUTE, mockPassengerTypeDetails);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });

    it('should set the RETURN_VALIDITY_ATTRIBUTE and redirect to /selectSalesOfferPackage when no errors are found and no validity info is entered', async () => {
        const mockBody = {
            validity: 'No',
        };
        const { req, res } = getMockRequestAndResponse({
            body: mockBody,
            mockWriteHeadFn: writeHeadMock,
        });
        await returnValidity(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, RETURN_VALIDITY_ATTRIBUTE, undefined);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectSalesOfferPackage',
        });
    });

    it('should set the RETURN_VALIDITY_ATTRIBUTE with errors and redirect to itself (i.e. /returnValidity) when there are errors present', async () => {
        const mockReturnValidityDetails = {
            validity: 'Yes',
            amount: '720',
            duration: 'week',
        };
        const mockErrors: ErrorInfo[] = [
            {
                errorMessage: 'Enter a whole number greater than zero',
                id: 'return-validity-amount',
                userInput: '720',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: mockReturnValidityDetails,
            mockWriteHeadFn: writeHeadMock,
        });
        await returnValidity(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, RETURN_VALIDITY_ATTRIBUTE, {
            amount: mockReturnValidityDetails.amount,
            typeOfDuration: mockReturnValidityDetails.duration,
            errors: mockErrors,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/returnValidity',
        });
    });
});
