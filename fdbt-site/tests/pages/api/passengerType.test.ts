import passengerType from '../../../src/pages/api/passengerType';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('passengerType', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /error if faretype cookie is missing', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: null },
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
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
            Location: '/timeRestrictions',
        });
    });

    it('should return 302 redirect to /groupSize when the user selects group', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'group' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/groupSize',
        });
    });
});
