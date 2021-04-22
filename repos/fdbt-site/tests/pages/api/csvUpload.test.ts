/* eslint-disable @typescript-eslint/no-explicit-any */
import * as csvUpload from '../../../src/pages/api/csvUpload';
import * as fileUpload from '../../../src/pages/api/apiUtils/fileUpload';
import * as csvData from '../../testData/csvFareTriangleData';
import * as s3 from '../../../src/data/s3';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import logger from '../../../src/utils/logger';
import { containsDuplicateFareStages } from '../../../src/pages/api/csvUpload';
import { ErrorInfo } from '../../../src/interfaces';
import { CSV_UPLOAD_ATTRIBUTE, JOURNEY_ATTRIBUTE } from '../../../src/constants/attributes';

jest.spyOn(s3, 'putStringInS3');

describe('csvUpload', () => {
    const loggerSpy = jest.spyOn(logger, 'warn');
    const getFormDataSpy = jest.spyOn(fileUpload, 'getFormData');
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /csvUpload with an error when the file contains duplicate fare stages', async () => {
        const mockError: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: 'Fare stage names cannot be the same' }];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsvDuplicateFareStages,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
    });

    it('should return 302 redirect to /csvUpload when no file is attached', async () => {
        const mockError: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: 'Select a CSV file to upload' }];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 2,
                path: 'string',
                name: 'string',
                type: 'string',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: '',
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
        expect(loggerSpy).toBeCalledWith('', { context: 'api.utils.processFileUpload', message: 'no file attached' });
    });

    it('should return 302 redirect to /csvUpload with an error message when a the attached file is too large', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload', errorMessage: 'The selected file must be smaller than 5MB' },
        ];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999999999999999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
        expect(loggerSpy).toBeCalledWith('', {
            context: 'api.utils.validateFile',
            maxSize: 5242880,
            message: 'file is too large',
            size: 999999999999999,
        });
    });

    it('should return 302 redirect to /csvUpload with an error message when the attached file is not a csv', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload', errorMessage: 'The selected file must be a .csv or .xlsx' },
        ];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/pdf',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
        expect(loggerSpy).toBeCalledWith('', {
            context: 'api.utils.validateFile',
            message: 'file not of allowed type',
            type: 'text/pdf',
        });
    });

    it('should put the unparsed data in s3 and the parsed data in s3', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-raw-user-data-dev',
            expect.any(String),
            JSON.stringify(csvData.unprocessedObject.Body),
            'text/csv; charset=utf-8',
        );

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-user-data-dev',
            expect.any(String),
            JSON.stringify(csvData.processedObject.Body),
            'application/json; charset=utf-8',
        );
    });

    it('should correctly generate data with empty cells and spaces and upload it to S3', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.validTestCsvWithEmptyCellsAndEmptyLine,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-raw-user-data-dev',
            expect.any(String),
            JSON.stringify(csvData.unprocessedObjectWithEmptyCells.Body),
            'text/csv; charset=utf-8',
        );

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-user-data-dev',
            expect.any(String),
            JSON.stringify(csvData.processedObjectWithEmptyCells.Body),
            'application/json; charset=utf-8',
        );
    });

    it('should correctly generate data with decimal prices when pounds is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.decimalPricesTestCsv,
            fields: {
                poundsOrPence: 'pounds',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-raw-user-data-dev',
            expect.any(String),
            JSON.stringify(csvData.unprocessedObjectWithDecimalPrices.Body),
            'text/csv; charset=utf-8',
        );

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-user-data-dev',
            expect.any(String),
            JSON.stringify(csvData.processedObject.Body),
            'application/json; charset=utf-8',
        );
    });

    it('should return 302 redirect to /outboundMatching when the happy path is used (ticketer format)', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            session: {
                [JOURNEY_ATTRIBUTE]: {
                    outboundJourney: '13003921A#13003655B',
                },
            },
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/outboundMatching',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });
    });

    it('should return 302 redirect to /outboundMatching when the happy path is used (non-ticketer format)', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            session: {
                [JOURNEY_ATTRIBUTE]: {
                    outboundJourney: '13003921A#13003655B',
                },
            },
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.nonTicketerTestCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/outboundMatching',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });
    });

    it('should throw an error if the fares triangle data has non-numerical prices', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload', errorMessage: 'The selected file contains an invalid price' },
        ];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.nonNumericPricesTestCsv,
            fields: {
                poundsOrPence: 'pounds',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pounds',
        });
    });

    it('should throw an error if the fares triangle data has decimal prices and pence is selected', async () => {
        const mockError: ErrorInfo[] = [
            {
                id: 'csv-upload',
                errorMessage: 'The selected file contains a decimal price, all prices must be in pence',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.decimalPricesTestCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
    });

    it('should return 302 redirect to /matching if the fares triangle data has decimal prices and pounds is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.decimalPricesTestCsv,
            fields: {
                poundsOrPence: 'pounds',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/matching',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: [],
        });
    });

    it('should throw an error if there is an empty fare stage name', async () => {
        const mockError: ErrorInfo[] = [
            {
                id: 'csv-upload',
                errorMessage: 'Fare stage names must not be empty',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.emptyStageNameTestCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
    });

    it('should throw an error if no prices are set', async () => {
        const mockError: ErrorInfo[] = [
            {
                id: 'csv-upload',
                errorMessage: 'At least one price must be set in the uploaded fares triangle',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.noPricesTestCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
    });

    it('should return 302 redirect to /matching if the fares triangle data has empty prices', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.missingPricesTestCsv,
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(false);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/matching',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });
    });

    it('should return 302 redirect to /csvUpload with an error message if the file contains a virus', async () => {
        process.env.ENABLE_VIRUS_SCAN = '1';
        const mockError: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: 'The selected file contains a virus' }];
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
        });
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): any {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: 'i am a virus',
            fields: {
                poundsOrPence: 'pence',
            },
        });

        jest.spyOn(fileUpload, 'containsViruses')
            .mockImplementation()
            .mockResolvedValue(true);

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, {
            errors: mockError,
            poundsOrPence: 'pence',
        });
    });

    describe('containsDuplicateFareStages', () => {
        it('returns true if the array has duplicates', () => {
            const fareStagesNames: string[] = ['test', 'test', 'test2', 'test4'];
            expect(containsDuplicateFareStages(fareStagesNames)).toBeTruthy();
        });
        it('returns false if the array has no duplicates', () => {
            const fareStagesNames: string[] = ['test', 'test44', 'test2', 'test4'];
            expect(containsDuplicateFareStages(fareStagesNames)).toBeFalsy();
        });
    });
});
