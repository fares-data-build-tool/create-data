import { getMockRequestAndResponse } from '../../testData/mockData';
import fareType from '../../../src/pages/api/fareType';
import * as sessions from '../../../src/utils/sessions';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE } from '../../../src/constants/attributes';
import { ErrorInfo } from '../../../src/interfaces';

describe('fareType', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /definePassengerType when schoolService is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { fareType: 'schoolService' },
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_TYPE_ATTRIBUTE, {
            fareType: req.body.fareType,
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, {
            passengerType: 'schoolPupil',
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should return 302 redirect to /passengerType when any option other than schoolService is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { fareType: 'single' },
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_TYPE_ATTRIBUTE, {
            fareType: req.body.fareType,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
        });
    });

    it('should return 302 redirect to /fareType with errors when no option is selected', () => {
        const mockError: ErrorInfo[] = [
            { id: 'fare-type-single', errorMessage: 'Choose a fare type from the options' },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_TYPE_ATTRIBUTE, {
            errors: mockError,
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/fareType',
        });
    });
});
