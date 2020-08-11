import defineGroupPassengers from '../../../src/pages/api/groupPassengerTypes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessionUtils from '../../../src/utils/sessions';
import { GROUP_PASSENGER_TYPES_ATTRIBUTE } from '../../../src/constants';

describe('defineGroupPassengers', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessionUtils, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /defineGroupPassengers if passengerType is missing from req.body', () => {
        const { req, res } = getMockRequestAndResponse({
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        defineGroupPassengers(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineGroupPassengers',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_TYPES_ATTRIBUTE, {
            errors: [
                { errorMessage: 'Choose one or two passenger types from the options', id: 'passenger-types-error' },
            ],
        });
    });

    it('should return 302 redirect to /defineGroupPassengers with error on session if passengerType array size is greater than 2', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                passengerTypes: ['adult', 'child', 'student'],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        defineGroupPassengers(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineGroupPassengers',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_TYPES_ATTRIBUTE, {
            errors: [
                {
                    errorMessage: 'Choose one or two passenger types - you cannot exceed this limit',
                    id: 'passenger-types-error',
                },
            ],
        });
    });

    it('should return 302 redirect to /definePassengerType?groupPassengerType=adult', () => {
        const input = ['adult', 'child'];
        const { req, res } = getMockRequestAndResponse({
            body: { passengerTypes: input },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        defineGroupPassengers(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType?groupPassengerType=adult',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_TYPES_ATTRIBUTE, {
            passengerTypes: input,
        });
    });
});
