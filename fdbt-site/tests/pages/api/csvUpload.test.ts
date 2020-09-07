import * as csvUpload from '../../../src/pages/api/csvUpload';
import * as fileUpload from '../../../src/pages/api/apiUtils/fileUpload';
import * as csvData from '../../testData/csvFareTriangleData';
import * as s3 from '../../../src/data/s3';
import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import logger from '../../../src/utils/logger';
import { containsDuplicateFareStages } from '../../../src/pages/api/csvUpload';
import { ErrorInfo } from '../../../src/interfaces';
import { CSV_UPLOAD_ATTRIBUTE, JOURNEY_ATTRIBUTE } from '../../../src/constants';

jest.spyOn(s3, 'putStringInS3');

describe('csvUpload', () => {
    const loggerSpy = jest.spyOn(logger, 'warn');
    const getFormDataSpy = jest.spyOn(fileUpload, 'getFormData');
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /csvUpload with an error when the file contains duplicate fare stages', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload-error', errorMessage: 'Fare stage names cannot be the same' },
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsvDuplicateFareStages,
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: mockError });
    });

    it('should return 302 redirect to /csvUpload when no file is attached', async () => {
        const mockError: ErrorInfo[] = [{ id: 'csv-upload-error', errorMessage: 'The selected file is empty' }];
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: '',
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: mockError });
        expect(loggerSpy).toBeCalledWith('', {
            context: 'api.utils.validateFile',
            fileName: 'string',
            message: 'empty CSV Selected',
        });
    });

    it('should return 302 redirect to /csvUpload with an error message when a the attached file is too large', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload-error', errorMessage: 'The selected file must be smaller than 5MB' },
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: mockError });
        expect(loggerSpy).toBeCalledWith('', {
            context: 'api.utils.validateFile',
            maxSize: 5242880,
            message: 'file is too large',
            size: 999999999999999,
        });
    });

    it('should return 302 redirect to /csvUpload with an error message when the attached file is not a csv', async () => {
        const mockError: ErrorInfo[] = [{ id: 'csv-upload-error', errorMessage: 'The selected file must be a CSV' }];
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: mockError });
        expect(loggerSpy).toBeCalledWith('', {
            context: 'api.utils.validateFile',
            message: 'file not of allowed type',
            type: 'text/pdf',
        });
    });

    it.each([
        [csvData.testCsv, csvData.unprocessedObject.Body, csvData.processedObject.Body],
        [csvData.testCsvWithEmptyLines, csvData.unprocessedObjectWithEmptyLines.Body, csvData.processedObject.Body],
    ])(
        'should put the unparsed data in s3 and the parsed data in s3',
        async (csv, expectedUnprocessed, expectedProcessed) => {
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
                    toJSON(): string {
                        return '';
                    },
                },
            };

            getFormDataSpy.mockImplementation().mockResolvedValue({
                files: file,
                fileContents: csv,
            });

            await csvUpload.default(req, res);

            expect(s3.putStringInS3).toBeCalledWith(
                'fdbt-raw-user-data-dev',
                expect.any(String),
                JSON.stringify(expectedUnprocessed),
                'text/csv; charset=utf-8',
            );

            expect(s3.putStringInS3).toBeCalledWith(
                'fdbt-user-data-dev',
                expect.any(String),
                JSON.stringify(expectedProcessed),
                'application/json; charset=utf-8',
            );
        },
    );

    it('should return 302 redirect to /outboundMatching when the happy path is used', async () => {
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.testCsv,
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/outboundMatching',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });
    });

    it('should throw an error if the fares triangle data has non-numerical prices', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload-error', errorMessage: 'The selected file must use the template' },
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.nonNumericPricesTestCsv,
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: mockError });
    });

    it('should return 302 redirect to /csvUpload with an error message if the fares triangle data has missing prices', async () => {
        const mockError: ErrorInfo[] = [
            { id: 'csv-upload-error', errorMessage: 'The selected file must use the template' },
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
                toJSON(): string {
                    return '';
                },
            },
        };

        getFormDataSpy.mockImplementation().mockResolvedValue({
            files: file,
            fileContents: csvData.missingPricesTestCsv,
        });

        await csvUpload.default(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, CSV_UPLOAD_ATTRIBUTE, { errors: mockError });
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
