import fareConfirmation from '../../../src/pages/api/fareConfirmation';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse, mockSchemOpIdToken } from '../../testData/mockData';

describe('fareConfirmation', () => {
    const writeHeadMock = jest.fn();
    const redirectOnFareTypeSpy = jest.spyOn(apiUtils, 'redirectOnFareType');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should redirect on fareType when the user logged in is not a scheme operator', () => {
        const { req, res } = getMockRequestAndResponse({
            mockWriteHeadFn: writeHeadMock,
        });
        fareConfirmation(req, res);
        expect(redirectOnFareTypeSpy).toHaveBeenCalled();
    });

    it('should redirect to /csvZoneUpload when the user logged in is a scheme operator', () => {
        const { req, res } = getMockRequestAndResponse({
            mockWriteHeadFn: writeHeadMock,
            cookieValues: {
                operator: { operator: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                idToken: mockSchemOpIdToken,
            },
        });
        fareConfirmation(req, res);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/csvZoneUpload' });
    });
});
