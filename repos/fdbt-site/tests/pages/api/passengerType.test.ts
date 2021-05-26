import { GROUP_PASSENGER_TYPE, GROUP_REUSE_PASSENGER_TYPE } from '../../../src/constants';
import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    SAVED_PASSENGER_GROUPS_ATTRIBUTE,
} from '../../../src/constants/attributes';
import * as aurora from '../../../src/data/auroradb';
import passengerType from '../../../src/pages/api/passengerType';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';

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

    it('should select the appropriate group config when user is reusing a group', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: GROUP_REUSE_PASSENGER_TYPE, reuseGroup: 'Hi Name' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
                [SAVED_PASSENGER_GROUPS_ATTRIBUTE]: [
                    { name: 'Hello Name', companions: [{ passengerType: 'child' }] },
                    {
                        name: 'Hi Name',
                        companions: [{ passengerType: 'adult' }, { passengerType: 'senior', ageRangeMax: 100 }],
                    },
                ],
            },
        });

        await passengerType(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, {
            passengerType: GROUP_PASSENGER_TYPE,
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_INFO_ATTRIBUTE, [
            { passengerType: 'adult' },
            { passengerType: 'senior', ageRangeMax: 100 },
        ]);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_PASSENGER_TYPES_ATTRIBUTE, {
            passengerTypes: ['adult', 'senior'],
        });

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });

    it('should return an error when reusing a group with no group selected', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { passengerType: GROUP_REUSE_PASSENGER_TYPE, reuseGroup: '' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
                [SAVED_PASSENGER_GROUPS_ATTRIBUTE]: [{}],
            },
        });

        await passengerType(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, {
            errors: [{ errorMessage: 'Select a group to reuse', id: `passenger-type-${GROUP_PASSENGER_TYPE}` }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passengerType',
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
