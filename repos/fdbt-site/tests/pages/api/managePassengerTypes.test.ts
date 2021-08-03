import * as aurora from '../../../src/data/auroradb';
import * as utils from '../../../src/pages/api/apiUtils/index';
import * as session from '../../../src/utils/sessions';
import { MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE } from '../../../src/constants/attributes';
import managePassengerTypes from '../../../src/pages/api/managePassengerTypes';
import { getMockRequestAndResponse } from '../../testData/mockData';

const getAndValidateNocSpy = jest.spyOn(utils, 'getAndValidateNoc');
const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
const getSinglePassengerTypeByNameAndNationalOperatorCodeSpy = jest.spyOn(
    aurora,
    'getSinglePassengerTypeByNameAndNationalOperatorCode',
);

describe('managePassengerTypes', () => {
    const writeHeadMock = jest.fn();

    beforeAll(() => {
        jest.spyOn(aurora, 'getSinglePassengerTypeByNameAndNationalOperatorCode');
    });

    afterEach(jest.resetAllMocks);

    it('should call the getAndValidateNoc function', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await managePassengerTypes(req, res);

        expect(getAndValidateNocSpy).toBeCalledWith(req, res);
    });

    it('should error when name is an empty string', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: 1,
                name: '',
                type: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Name must be provided',
                    id: 'name',
                },
            ],
            id: 1,
            name: '',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
        };

        await managePassengerTypes(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, attributeValue);
    });

    it('should error when name is a bunch of spaces and no real characters', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: 1,
                name: '     ',
                type: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Name must be provided',
                    id: 'name',
                },
            ],
            id: 1,
            name: '',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
        };

        await managePassengerTypes(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, attributeValue);
    });

    it('should error when name is greater than 50 characters', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: 1,
                name: 'ThisIsSomeVeryLongNameThatIsUnlikleyButYouNeverKnow,Right?',
                type: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Name must be 50 characters or under',
                    id: 'name',
                },
            ],
            id: 1,
            name: 'ThisIsSomeVeryLongNameThatIsUnlikleyButYouNeverKnow,Right?',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
        };

        await managePassengerTypes(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, attributeValue);
    });

    it('should error when age greater than 150', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: 1,
                name: 'Adults',
                type: 'Adult',
                ageRangeMin: '151',
                ageRangeMax: '161',
                proofDocuments: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Age cannot be greater than 150',
                    id: 'age-range-min',
                },
                {
                    errorMessage: 'Age cannot be greater than 150',
                    id: 'age-range-max',
                },
            ],
            id: 1,
            name: 'Adults',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '151',
                ageRangeMax: '161',
                proofDocuments: [],
            },
        };

        await managePassengerTypes(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, attributeValue);
    });

    it('should error when minimum age is greater than maximum age', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: 1,
                name: 'Adults',
                type: 'Adult',
                ageRangeMin: '19',
                ageRangeMax: '18',
                proofDocuments: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Minimum age cannot be greater than maximum age',
                    id: 'age-range-min',
                },
            ],
            id: 1,
            name: 'Adults',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '19',
                ageRangeMax: '18',
                proofDocuments: [],
            },
        };

        await managePassengerTypes(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, attributeValue);
    });

    it('should error when adding a passenger type with the same name as an existing one', async () => {
        getSinglePassengerTypeByNameAndNationalOperatorCodeSpy.mockResolvedValueOnce({
            id: 1,
            name: 'Adults',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '19',
                ageRangeMax: '18',
                proofDocuments: ['studentCard'],
            },
        });

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                id: 2,
                name: 'Adults',
                type: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                {
                    errorMessage: 'Adults already exists as a passenger type',
                    id: 'name',
                },
            ],
            id: 2,
            name: 'Adults',
            passengerType: {
                passengerType: 'Adult',
                ageRangeMin: '18',
                ageRangeMax: '65',
                proofDocuments: [],
            },
        };

        await managePassengerTypes(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, attributeValue);
    });
});
