import { getMockRequestAndResponse } from '../../testData/mockData';
import schoolFareType from '../../../src/pages/api/schoolFareType';
import * as sessions from '../../../src/utils/sessions';
import { SCHOOL_FARE_TYPE_ATTRIBUTE } from '../../../src/constants/attributes';
import { ErrorInfo } from '../../../src/interfaces';

describe('schoolFareType', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /fareConfirmation when a fare type is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { fareType: 'single' },
            mockWriteHeadFn: writeHeadMock,
        });
        schoolFareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, SCHOOL_FARE_TYPE_ATTRIBUTE, {
            schoolFareType: req.body.fareType,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/fareConfirmation',
        });
    });

    it('should return 302 redirect to /schoolFareType with errors when no option is selected', () => {
        const mockError: ErrorInfo[] = [
            { id: 'school-fare-type-single', errorMessage: 'Choose a fare type from the options' },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });
        schoolFareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, SCHOOL_FARE_TYPE_ATTRIBUTE, {
            schoolFareType: '',
            errors: mockError,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/schoolFareType',
        });
    });
});
