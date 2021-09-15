import { getMockRequestAndResponse } from '../../testData/mockData';
import fareType from '../../../src/pages/api/fareType';
import * as sessions from '../../../src/utils/sessions';
import {
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    CARNET_FARE_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { ErrorInfo } from '../../../src/interfaces';
import { globalSettingsEnabled } from '../../../src/constants/featureFlag';

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
        if (!globalSettingsEnabled) {
            expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, {
                passengerType: 'schoolPupil',
            });
        }
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPassengerType',
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
            Location: '/selectPassengerType',
        });
    });

    it('should return 302 redirect to /fareType with errors when no option is selected', () => {
        const mockError: ErrorInfo[] = [
            { id: 'radio-option-single', errorMessage: 'Choose a fare type from the options' },
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

    it('should return 302 redirect to /carnetFareType when carnet is selected, set carnet to true, and clear the fareType attribute', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { fareType: 'carnet' },
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CARNET_FARE_TYPE_ATTRIBUTE, true);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_TYPE_ATTRIBUTE, undefined);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/carnetFareType',
        });
    });

    it('should return 302 redirect to /passengerType when carnetPeriod is selected, set carnet to true, and set the fareType attribute to period', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { fareType: 'carnetPeriod' },
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CARNET_FARE_TYPE_ATTRIBUTE, true);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_TYPE_ATTRIBUTE, { fareType: 'period' });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPassengerType',
        });
    });

    it('should return 302 redirect to /passengerType when carnet is selected, set carnet to true, and set the fareType attribute to flatFare', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { fareType: 'carnetFlatFare' },
            mockWriteHeadFn: writeHeadMock,
        });
        fareType(req, res);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CARNET_FARE_TYPE_ATTRIBUTE, true);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_TYPE_ATTRIBUTE, { fareType: 'flatFare' });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPassengerType',
        });
    });
});
