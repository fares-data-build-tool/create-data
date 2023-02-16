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

    const upsertCapExpirySpy = jest.spyOn(db, 'upsertCapExpiry');
    upsertCapExpirySpy.mockImplementation();

    beforeEach(() => {
        jest.spyOn(db, 'getFareDayEnd').mockImplementation(() => Promise.resolve('2200'));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, then redirects to /viewCaps if all is valid', async () => {
        const mockProductInfo: CapExpiry = {
            productValidity: '24hr',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capValid: '24hr' },
            mockWriteHeadFn: writeHeadMock,
        });

        await capValidity(req, res);

        expect(upsertCapExpirySpy).toBeCalledWith('TEST', mockProductInfo);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/viewCaps' });
    });

    it('correctly generates product info, updates the db with productEndTime empty even if supplied, if fare end day is not selected', async () => {
        const mockProductInfo: CapExpiry = {
            productValidity: '24hr',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capValid: '24hr', productEndTime: '2300' },
            mockWriteHeadFn: writeHeadMock,
        });

        await capValidity(req, res);

        expect(upsertCapExpirySpy).toBeCalledWith('TEST', mockProductInfo);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/viewCaps' });
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
            Location: '/selectCapExpiry',
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
            Location: '/selectCapExpiry',
        });
    });
});
