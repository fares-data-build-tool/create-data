import managePassengerGroup from '../../../src/pages/api/managePassengerGroup';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as session from '../../../src/utils/sessions';
import * as aurora from '../../../src/data/auroradb';
import { GS_PASSENGER_GROUP_ATTRIBUTE } from '../../../src/constants/attributes';

const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
const getPassengerTypeByNameAndNocCodeSpy = jest.spyOn(aurora, 'getPassengerTypeByNameAndNocCode');
const insertGroupPassengerTypeSpy = jest.spyOn(aurora, 'insertGroupPassengerType');
insertGroupPassengerTypeSpy.mockResolvedValue();

afterEach(() => {
    jest.resetAllMocks();
});

describe('managePassengerGroup', () => {
    it('should return 302 redirect to /managePassengerGroup when there have been no user inputs and update session with errors', async () => {
        const writeHeadMock = jest.fn();
        getPassengerTypeByNameAndNocCodeSpy.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                maxGroupSize: '',
                ['minimumPassengersRegular Senior']: '',
                ['maximumPassengersRegular Senior']: '',
                ['Regular Senior-type']: 'senior',
                ['Regular Senior-age-range-min']: '',
                ['Regular Senior-age-range-max']: '',
                ['Regular Senior-proof-docs']: [],
                ['minimumPassengersRegular infant']: '',
                ['maximumPassengersRegular infant']: '',
                ['Regular infant-type']: 'infant',
                ['Regular infant-age-range-min']: '1',
                ['Regular infant-age-range-max']: '3',
                ['Regular infant-proof-docs']: [],
                passengerGroupName: '',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await managePassengerGroup(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/managePassengerGroup',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_PASSENGER_GROUP_ATTRIBUTE, {
            errors: [
                { errorMessage: 'Maximum group size cannot be empty', id: 'max-group-size', userInput: '' },
                { errorMessage: 'Select at least one passenger type', id: 'passenger-type-0' },
                {
                    errorMessage: 'Enter a group name of up to 50 characters',
                    id: 'passenger-group-name',
                    userInput: '',
                },
            ],
            inputs: { companions: [], maxGroupSize: '', name: '' },
        });
    });

    it('should return 302 redirect to /managePassengerGroup when there have been incorrect user inputs and update session with errors and inputs', async () => {
        const writeHeadMock = jest.fn();
        getPassengerTypeByNameAndNocCodeSpy.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                maxGroupSize: 'seven',
                passengerTypes: ['Regular Senior', 'Regular infant'],
                ['minimumPassengersRegular Senior']: 'one',
                ['maximumPassengersRegular Senior']: 'three',
                ['Regular Senior-type']: 'senior',
                ['Regular Senior-age-range-min']: '',
                ['Regular Senior-age-range-max']: '',
                ['Regular Senior-proof-docs']: [],
                ['minimumPassengersRegular infant']: '1',
                ['maximumPassengersRegular infant']: '2',
                ['Regular infant-type']: 'infant',
                ['Regular infant-age-range-min']: '1',
                ['Regular infant-age-range-max']: '3',
                ['Regular infant-proof-docs']: [],
                passengerGroupName: '',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await managePassengerGroup(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/managePassengerGroup',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_PASSENGER_GROUP_ATTRIBUTE, {
            errors: [
                {
                    errorMessage: 'Maximum group size must be a whole, positive number',
                    id: 'max-group-size',
                    userInput: 'seven',
                },
                {
                    errorMessage: 'Minimum amount must be a whole, positive number',
                    id: 'minimum-passengers-Regular Senior',
                    userInput: 'one',
                },
                {
                    errorMessage: 'Maximum amount must be a whole, positive number',
                    id: 'maximum-passengers-Regular Senior',
                    userInput: 'three',
                },
                {
                    errorMessage: 'Enter a group name of up to 50 characters',
                    id: 'passenger-group-name',
                    userInput: '',
                },
            ],
            inputs: {
                companions: [
                    {
                        ageRangeMax: '',
                        ageRangeMin: '',
                        maxNumber: 'three',
                        minNumber: 'one',
                        name: 'Regular Senior',
                        passengerType: 'senior',
                        proofDocuments: [],
                    },
                    {
                        ageRangeMax: '3',
                        ageRangeMin: '1',
                        maxNumber: '2',
                        minNumber: '1',
                        name: 'Regular infant',
                        passengerType: 'infant',
                        proofDocuments: [],
                    },
                ],
                maxGroupSize: 'seven',
                name: '',
            },
        });
    });

    it('should return 302 redirect to /managePassengerGroup when there have been correct user inputs but there is a group with the same name', async () => {
        const writeHeadMock = jest.fn();
        getPassengerTypeByNameAndNocCodeSpy
            .mockResolvedValueOnce({
                passengerType: 'group',
            })
            .mockResolvedValueOnce(undefined);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                maxGroupSize: '7',
                passengerTypes: ['Regular Senior', 'Regular infant'],
                ['minimumPassengersRegular Senior']: '2',
                ['maximumPassengersRegular Senior']: '3',
                ['Regular Senior-type']: 'senior',
                ['Regular Senior-age-range-min']: '',
                ['Regular Senior-age-range-max']: '',
                ['Regular Senior-proof-docs']: [],
                ['minimumPassengersRegular infant']: '1',
                ['maximumPassengersRegular infant']: '2',
                ['Regular infant-type']: 'infant',
                ['Regular infant-age-range-min']: '1',
                ['Regular infant-age-range-max']: '3',
                ['Regular infant-proof-docs']: [],
                passengerGroupName: 'My duplicate group',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await managePassengerGroup(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/managePassengerGroup',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_PASSENGER_GROUP_ATTRIBUTE, {
            errors: [
                {
                    errorMessage: 'There is already a group with this name. Choose another',
                    id: 'passenger-group-name',
                    userInput: 'My duplicate group',
                },
            ],
            inputs: {
                companions: [
                    {
                        ageRangeMax: '',
                        ageRangeMin: '',
                        maxNumber: '3',
                        minNumber: '2',
                        name: 'Regular Senior',
                        passengerType: 'senior',
                        proofDocuments: [],
                    },
                    {
                        ageRangeMax: '3',
                        ageRangeMin: '1',
                        maxNumber: '2',
                        minNumber: '1',
                        name: 'Regular infant',
                        passengerType: 'infant',
                        proofDocuments: [],
                    },
                ],
                maxGroupSize: '7',
                name: 'My duplicate group',
            },
        });
    });

    it('should return 302 redirect to /viewPassengerTypes when there have been correct user inputs and the group is saved to the db ', async () => {
        const writeHeadMock = jest.fn();
        getPassengerTypeByNameAndNocCodeSpy.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined);
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                maxGroupSize: '7',
                passengerTypes: ['Regular Senior', 'Regular infant'],
                ['minimumPassengersRegular Senior']: '2',
                ['maximumPassengersRegular Senior']: '3',
                ['Regular Senior-type']: 'senior',
                ['Regular Senior-age-range-min']: '',
                ['Regular Senior-age-range-max']: '',
                ['Regular Senior-proof-docs']: [],
                ['minimumPassengersRegular infant']: '1',
                ['maximumPassengersRegular infant']: '2',
                ['Regular infant-type']: 'infant',
                ['Regular infant-age-range-min']: '1',
                ['Regular infant-age-range-max']: '3',
                ['Regular infant-proof-docs']: [],
                passengerGroupName: 'My duplicate group',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await managePassengerGroup(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/viewPassengerTypes',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_PASSENGER_GROUP_ATTRIBUTE, undefined);
        expect(insertGroupPassengerTypeSpy).toBeCalledWith(
            'TEST',
            {
                companions: [
                    {
                        ageRangeMax: '',
                        ageRangeMin: '',
                        maxNumber: '3',
                        minNumber: '2',
                        name: 'Regular Senior',
                        passengerType: 'senior',
                        proofDocuments: [],
                    },
                    {
                        ageRangeMax: '3',
                        ageRangeMin: '1',
                        maxNumber: '2',
                        minNumber: '1',
                        name: 'Regular infant',
                        passengerType: 'infant',
                        proofDocuments: [],
                    },
                ],
                maxGroupSize: '7',
                name: 'My duplicate group',
            },
            'My duplicate group',
        );
    });
});
