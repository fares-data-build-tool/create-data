import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import selectPassengerType from '../../../src/pages/api/selectPassengerType';
import * as aurora from '../../../src/data/auroradb';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { GROUP_PASSENGER_TYPE } from '../../../src/constants';
import { GroupPassengerTypeDb } from 'fdbt-types/dbTypes';

describe('selectPassengerType', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const getPassengerTypeByIdSpy = jest.spyOn(aurora, 'getPassengerTypeById');
    const getGroupPassengerTypeByIdSpy = jest.spyOn(aurora, 'getGroupPassengerTypeById');
    const pageErrorMessage = {
        errors: [{ errorMessage: 'Select a passenger type', id: 'individual-passengers' }],
    };
    afterEach(jest.resetAllMocks);

    it('should return 302 redirect to /selectPassengerType when no passenger type is selected and add errors to session', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await selectPassengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPassengerType',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, pageErrorMessage);
    });

    it('should return 302 redirect to /selectPassengerType when the passenger selected is not for the logged in users NOC and add errors to session', async () => {
        getPassengerTypeByIdSpy.mockImplementation().mockResolvedValue(undefined);
        getGroupPassengerTypeByIdSpy.mockImplementation().mockResolvedValue(undefined);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                passengerTypeId: '7',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await selectPassengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPassengerType',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, pageErrorMessage);
    });

    it('should return 302 redirect to /defineTimeRestrictions when the passenger selected is a group and the selected group information added to session', async () => {
        const groupDbResult: GroupPassengerTypeDb = {
            id: 3,
            name: 'family group',
            groupPassengerType: {
                name: 'family group',
                maxGroupSize: '4',
                companions: [
                    {
                        id: 1,
                        minNumber: '1',
                        maxNumber: '2',
                        name: 'adult',
                    },
                    {
                        id: 2,
                        minNumber: '1',
                        maxNumber: '2',
                        name: 'child',
                    },
                ],
            },
        };
        getPassengerTypeByIdSpy.mockImplementation().mockResolvedValue(undefined);
        getGroupPassengerTypeByIdSpy.mockImplementation().mockResolvedValue(groupDbResult);
        const convertToFullPassengerTypeSpy = jest.spyOn(aurora, 'convertToFullPassengerType');
        const fullGroup = {
            id: 1,
            name: 'family',
            groupPassengerType: {
                name: 'family',
                maxGroupSize: '3',
                companions: [
                    {
                        id: 1,
                        name: 'adult',
                        passengerType: 'adult',
                        minNumber: '1',
                        maxNumber: '2',
                        ageRangeMin: '18',
                        ageRangeMax: '75',
                        proofDocuments: [],
                    },
                    {
                        id: 2,
                        name: 'kid',
                        passengerType: 'child',
                        minNumber: '1',
                        maxNumber: '2',
                        ageRangeMin: '5',
                        ageRangeMax: '17',
                        proofDocuments: [],
                    },
                ],
            },
        };
        convertToFullPassengerTypeSpy.mockImplementation().mockResolvedValue(fullGroup);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                passengerTypeId: '3',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await selectPassengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectTimeRestrictions',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, {
            passengerType: GROUP_PASSENGER_TYPE,
            id: 3,
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(
            req,
            GROUP_PASSENGER_INFO_ATTRIBUTE,
            fullGroup.groupPassengerType.companions,
        );
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GROUP_SIZE_ATTRIBUTE, {
            maxGroupSize: groupDbResult.groupPassengerType.maxGroupSize,
        });
    });

    it('should return 302 redirect to /defineTimeRestrictions when the passenger selected is an individual and the selected individual information added to session', async () => {
        const databaseResult = {
            id: 3,
            name: 'Adult',
            passengerType: {
                id: 3,
                passengerType: 'adult',
            },
        };
        getPassengerTypeByIdSpy.mockImplementation().mockResolvedValue(databaseResult);
        getGroupPassengerTypeByIdSpy.mockImplementation().mockResolvedValue(undefined);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                passengerTypeId: '3',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await selectPassengerType(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectTimeRestrictions',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PASSENGER_TYPE_ATTRIBUTE, {
            passengerType: 'adult',
            id: 3,
        });
    });
});
