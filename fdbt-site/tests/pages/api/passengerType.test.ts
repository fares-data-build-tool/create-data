import passengerType from '../../../src/pages/api/passengerType';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as utils from '../../../src/pages/api/apiUtils';

describe('passengerType', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /error if faretype cookie is missing', () => {
        const { req, res } = getMockRequestAndResponse({ fareType: null }, null, {}, writeHeadMock);
        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /passengerType when no passenger type is selected', () => {
        const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
        });
    });

    it('should return 302 redirect to /definePassengerType when the user selects Adult', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Adult' }, {}, writeHeadMock);

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should return 302 redirect to /definePassengerType when the user selects Child', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Child' }, {}, writeHeadMock);

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should return 302 redirect to /definePassengerType when the user selects Infant', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Infant' }, {}, writeHeadMock);

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should return 302 redirect to /definePassengerType when the user selects Senior', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Senior' }, {}, writeHeadMock);

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should return 302 redirect to /definePassengerType when the user selects Student', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Student' }, {}, writeHeadMock);

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should return 302 redirect to /definePassengerType when the user selects Young Person', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Young Person' }, {}, writeHeadMock);

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
    });

    it('should call redirectOnFareType when the user selects Any', () => {
        const { req, res } = getMockRequestAndResponse({}, { passengerType: 'Any' }, {}, writeHeadMock);
        const redirectOnFareType = jest.spyOn(utils, 'redirectOnFareType');

        passengerType(req, res);

        expect(redirectOnFareType).toHaveBeenCalled();
    });
});
