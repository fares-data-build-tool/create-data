import passengerType from '../../../src/pages/api/passengerType';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { PASSENGER_TYPE_ATTRIBUTE } from '../../../src/constants';

describe('passengerType', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /passengerType when no passenger type is selected', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
        });
    });

    it.each([['adult'], ['child'], ['infant'], ['senior'], ['student'], ['youngPerson']])(
        'should return 302 redirect to /definePassengerType when the user selects %s',
        (userType: string) => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: { passengerType: userType },
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });

            passengerType(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/definePassengerType',
            });
        },
    );

    it('should redirect to timeRestrictions when the user selects Anyone', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'anyone' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });

    it('should return 302 redirect to /groupSize when the user selects group', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'group' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
            },
        });

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/groupSize',
        });
    });
});
