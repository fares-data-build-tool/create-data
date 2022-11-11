import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import periodValidity from '../../../src/pages/api/periodValidity';
import { ErrorInfo } from '../../../src/interfaces';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../../../src/constants/attributes';
import * as db from '../../../src/data/auroradb';
import { PeriodExpiry } from '../../../src/interfaces/matchingJsonTypes';

describe('periodValidity', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.spyOn(db, 'getFareDayEnd').mockImplementation(() => Promise.resolve('2200'));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, updates the PERIOD_EXPIRY_ATTRIBUTE and then redirects to /ticketConfirmation if all is valid', async () => {
        const mockProductInfo: PeriodExpiry = {
            productValidity: '24hr',
            productEndTime: '',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { periodValid: '24hr' },
            mockWriteHeadFn: writeHeadMock,
        });

        await periodValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, mockProductInfo);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/ticketConfirmation' });
    });

    it('correctly generates product info, updates the PERIOD_EXPIRY_ATTRIBUTE with productEndTime empty even if supplied, if end of service day is not selected', async () => {
        const mockProductInfo: PeriodExpiry = {
            productValidity: '24hr',
            productEndTime: '',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { periodValid: '24hr', productEndTime: '2300' },
        });

        await periodValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, mockProductInfo);
    });

    it('correctly generates period expiry error info, updates the PERIOD_EXPIRY_ATTRIBUTE and then redirects to periodValidity page when there is no period validity info', async () => {
        const errors: ErrorInfo[] = [
            {
                id: 'period-end-calendar',
                errorMessage: 'Choose an option regarding your period ticket validity',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodValidity',
        });
    });

    it('should redirect if the end of service day option selected and no fare day end has been set in global settings', async () => {
        jest.spyOn(db, 'getFareDayEnd').mockImplementation(() => Promise.resolve(''));

        const errors: ErrorInfo[] = [
            {
                id: 'product-end-time',
                errorMessage: 'No fare day end defined',
                userInput: '',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                periodValid: 'fareDayEnd',
                productEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await periodValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, PERIOD_EXPIRY_ATTRIBUTE, errors);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPeriodValidity',
        });
    });
});
