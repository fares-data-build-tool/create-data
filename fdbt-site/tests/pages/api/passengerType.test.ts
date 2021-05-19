import passengerType from '../../../src/pages/api/passengerType';
import * as aurora from '../../../src/data/auroradb';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { PASSENGER_TYPE_ATTRIBUTE } from '../../../src/constants/attributes';

describe('passengerType', () => {
    const writeHeadMock = jest.fn();

    beforeAll(() => jest.spyOn(aurora, 'getPassengerTypeByNameAndNocCode'));

    afterEach(jest.resetAllMocks);

    it('should return 302 redirect to /passengerType when no passenger type is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
        });
    });

    it.each([['adult'], ['child'], ['infant'], ['senior'], ['student'], ['youngPerson']])(
        'should return 302 redirect to /definePassengerType when the user selects %s',
        async (userType: string) => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: { passengerType: userType },
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });

            await passengerType(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/definePassengerType',
            });
        },
    );

    it('should redirect to timeRestrictions when the user selects Anyone', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'anyone' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });

    it('should return 302 redirect to /groupSize when the user selects group', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'group' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
            },
        });

        await passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/groupSize',
        });
    });

    it('should return 302 redirect to /defineTimeRestrictions when the user has a pre-saved passenger type', async () => {
        const spyGetPassengerTypeByNameAndNocCode = jest.spyOn(aurora, 'getPassengerTypeByNameAndNocCode');
        spyGetPassengerTypeByNameAndNocCode.mockResolvedValue({
            passengerType: 'child',
            ageRange: '7',
        });

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'child' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
            },
        });

        await passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
        expect(spyGetPassengerTypeByNameAndNocCode).toBeCalledWith('TEST', 'child', false);
    });

    it('should return 302 redirect to /definePassengerType when the user has NOT got a pre-saved passenger type', async () => {
        const spyGetPassengerTypeByNameAndNocCode = jest.spyOn(aurora, 'getPassengerTypeByNameAndNocCode');
        spyGetPassengerTypeByNameAndNocCode.mockResolvedValue(Promise.resolve(undefined));

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: 'child' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
            },
        });

        await passengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/definePassengerType',
        });
        expect(spyGetPassengerTypeByNameAndNocCode).toBeCalledWith('TEST', 'child', false);
    });
});
