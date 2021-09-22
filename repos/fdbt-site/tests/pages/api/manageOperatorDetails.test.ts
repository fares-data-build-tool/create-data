import * as aurora from '../../../src/data/auroradb';
import * as utils from '../../../src/utils/apiUtils/index';
import * as session from '../../../src/utils/sessions';
import { GS_OPERATOR_DETAILS_ATTRIBUTE } from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import manageOperatorDetails from '../../../src/pages/api/manageOperatorDetails';

const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
const upsertOperatorDetailsSpy = jest.spyOn(aurora, 'upsertOperatorDetails');

describe('manageOperatorDetails', () => {
    const writeHeadMock = jest.fn();
    const testData = {
        operatorName: 'Test Operator',
        contactNumber: '01234 567890',
        email: 'test@example.com',
        url: 'www.testoperator.com',
        street: 'Test Street',
        town: 'Test Town',
        county: 'Test County',
        postcode: 'AB1 2CD',
    };

    afterEach(jest.resetAllMocks);

    it('should error when fields are empty', async () => {
        const input = {
            operatorName: '',
            contactNumber: '',
            email: '',
            url: '',
            street: '',
            town: '',
            county: '',
            postcode: '',
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: input,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [
                { id: 'operatorName', errorMessage: 'All fields are mandatory' },
                { id: 'contactNumber', errorMessage: 'All fields are mandatory' },
                { id: 'email', errorMessage: 'All fields are mandatory' },
                { id: 'url', errorMessage: 'All fields are mandatory' },
                { id: 'street', errorMessage: 'All fields are mandatory' },
                { id: 'town', errorMessage: 'All fields are mandatory' },
                { id: 'county', errorMessage: 'All fields are mandatory' },
                { id: 'postcode', errorMessage: 'All fields are mandatory' },
                { id: 'contactNumber', errorMessage: 'Provide a valid phone number' },
                { id: 'email', errorMessage: 'Provide a valid email' },
                { id: 'url', errorMessage: 'Provide a valid URL' },
                { id: 'postcode', errorMessage: 'Provide a valid postcode' },
            ],
            input,
        };

        await manageOperatorDetails(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_OPERATOR_DETAILS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageOperatorDetails' });
    });

    it('should error when contactNumber is invalid', async () => {
        const input = { ...testData, contactNumber: 'abc01234 567890' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: input,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [{ id: 'contactNumber', errorMessage: 'Provide a valid phone number' }],
            input,
        };

        await manageOperatorDetails(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_OPERATOR_DETAILS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageOperatorDetails' });
    });

    it('should error when email is invalid', async () => {
        const input = { ...testData, email: 'test@example' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: input,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [{ id: 'email', errorMessage: 'Provide a valid email' }],
            input,
        };

        await manageOperatorDetails(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_OPERATOR_DETAILS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageOperatorDetails' });
    });

    it('should error when url is invalid', async () => {
        const input = { ...testData, url: 'www. test@example.com' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: input,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [{ id: 'url', errorMessage: 'Provide a valid URL' }],
            input,
        };

        await manageOperatorDetails(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_OPERATOR_DETAILS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageOperatorDetails' });
    });

    it('should error when postcode is invalid', async () => {
        const input = { ...testData, postcode: '(AB1 2CD)' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: input,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = {
            errors: [{ id: 'postcode', errorMessage: 'Provide a valid postcode' }],
            input,
        };

        await manageOperatorDetails(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_OPERATOR_DETAILS_ATTRIBUTE, attributeValue);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageOperatorDetails' });
    });

    it('should upsert operator details and set saved if valid', async () => {
        jest.spyOn(utils, 'getAndValidateNoc').mockReturnValue('mynoc');

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        const attributeValue = { saved: true };

        await manageOperatorDetails(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, GS_OPERATOR_DETAILS_ATTRIBUTE, attributeValue);

        expect(upsertOperatorDetailsSpy).toBeCalledWith('mynoc', testData);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/manageOperatorDetails' });
    });
});
