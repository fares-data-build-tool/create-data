import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import capValidity from '../../../src/pages/api/capValidity';
import { ErrorInfo } from '../../../src/interfaces';
import { CAP_EXPIRY_ATTRIBUTE } from '../../../src/constants/attributes';
import * as db from '../../../src/data/auroradb';
import { CapExpiry } from '../../../src/interfaces/matchingJsonTypes';
import * as userData from '../../../src/utils/apiUtils/userData';

describe('capValidity', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();
    const s3Spy = jest.spyOn(userData, 'putUserDataInProductsBucketWithFilePath');
    s3Spy.mockImplementation(() => Promise.resolve('pathToFile'));

    beforeEach(() => {
        jest.spyOn(db, 'getFareDayEnd').mockImplementation(() => Promise.resolve('2200'));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, updates the CAP_EXPIRY_ATTRIBUTE and then redirects to /ticketConfirmation if all is valid', async () => {
        const mockProductInfo: CapExpiry = {
            productValidity: '24hr',
            productEndTime: '',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capValid: '24hr' },
            mockWriteHeadFn: writeHeadMock,
        });

        await capValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_EXPIRY_ATTRIBUTE, mockProductInfo);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/defineCapStart' });
    });

    it('correctly generates product info, updates the CAP_EXPIRY_ATTRIBUTE with productEndTime empty even if supplied, if end of service day is not selected', async () => {
        const mockProductInfo: CapExpiry = {
            productValidity: '24hr',
            productEndTime: '',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capValid: '24hr', productEndTime: '2300' },
        });

        await capValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_EXPIRY_ATTRIBUTE, mockProductInfo);
    });

    it('correctly generates cap expiry error info, updates the CAP_EXPIRY_ATTRIBUTE and then redirects to capValidity page when there is no cap validity info', async () => {
        const errors: ErrorInfo[] = [
            {
                id: 'cap-end-calendar',
                errorMessage: 'Choose an option regarding your cap ticket validity',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await capValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, CAP_EXPIRY_ATTRIBUTE, errors);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCapValidity',
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
                capValid: 'fareDayEnd',
                productEndTime: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await capValidity(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, CAP_EXPIRY_ATTRIBUTE, errors);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCapValidity',
        });
    });
});
