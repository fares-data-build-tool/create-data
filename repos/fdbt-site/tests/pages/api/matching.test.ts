/* eslint-disable @typescript-eslint/no-explicit-any */
import matching from '../../../src/pages/api/matching';
import {
    getMockRequestAndResponse,
    service,
    mockMatchingUserFareStagesWithUnassignedStages,
    mockMatchingUserFareStagesWithAllStagesAssigned,
    expectedMatchingJsonSingle,
    expectedMatchingJsonReturnCircular,
} from '../../testData/mockData';
import * as s3 from '../../../src/data/s3';

jest.mock('../../../src/data/s3.ts');

const selections = {
    option0:
        '{"stop":{"stopName":"Yoden Way - Chapel Hill Road","naptanCode":"duratdmj","atcoCode":"13003521G","localityCode":"E0045956","localityName":"Peterlee","indicator":"W-bound","street":"Yodan Way"},"stage":"Acomb Green Lane"}',
    option1:
        '{"stop":{"stopName":"Yoden Way","naptanCode":"duratdmt","atcoCode":"13003522F","localityCode":"E0010183","localityName":"Horden","indicator":"SW-bound","street":"Yoden Way"},"stage":"Mattison Way"}',
    option2:
        '{"stop":{"stopName":"Surtees Rd-Edenhill Rd","naptanCode":"durapgdw","atcoCode":"13003219H","localityCode":"E0045956","localityName":"Peterlee","indicator":"NW-bound","street":"Surtees Road"},"stage":"Holl Bank/Beech Ave"}',
    option3:
        '{"stop":{"stopName":"Bus Station","naptanCode":"duratdma","atcoCode":"13003519H","localityCode":"E0045956","localityName":"Peterlee","indicator":"H","street":"Bede Way"},"stage":"Blossom Street"}',
    option4:
        '{"stop":{"stopName":"Kell Road","naptanCode":"duraptwp","atcoCode":"13003345D","localityCode":"E0010183","localityName":"Horden","indicator":"SE-bound","street":"Kell Road"},"stage":"Piccadilly (York)"}',
};

describe('Matching API', () => {
    const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');
    putStringInS3Spy.mockImplementation(() => Promise.resolve());
    const writeHeadMock = jest.fn();

    const mockDate = Date.now();

    beforeEach(() => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates matching JSON for a single ticket and uploads to S3', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                ...selections,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await matching(req, res);

        const actualMatchingData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);

        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            `DCCL/single/1e0459b3-082e-4e70-89db-96e8ae173e10_${mockDate}.json`,
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(expectedMatchingJsonSingle).toEqual(actualMatchingData);
    });

    it('correctly generates matching JSON for a return circular ticket and uploads to S3', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'return' },
            body: {
                ...selections,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await matching(req, res);

        const actualMatchingData = JSON.parse((putStringInS3Spy as jest.Mock).mock.calls[0][2]);

        expect(putStringInS3Spy).toBeCalledWith(
            'fdbt-matching-data-dev',
            `DCCL/return/1e0459b3-082e-4e70-89db-96e8ae173e10_${mockDate}.json`,
            expect.any(String),
            'application/json; charset=utf-8',
        );
        expect(expectedMatchingJsonReturnCircular).toEqual(actualMatchingData);
    });

    it('correctly redirects to matching page when there are fare stages that have not been assigned to stops', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                ...selections,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithUnassignedStages),
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await matching(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/matching',
        });
    });

    it('redirects to matching page if no stops are allocated to fare stages', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                option0: '',
                option1: '',
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await matching(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/matching',
        });
    });

    it('redirects to thankyou page if all valid', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                ...selections,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await matching(req, res);
        expect(writeHeadMock).toBeCalled();
    });

    it('redirects back to matching page if no user data in body', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { ...selections, service: JSON.stringify(service), userfarestages: '' },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await matching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('redirects back to matching page if no service info in body', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                ...selections,
                service: '',
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await matching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should redirect to the error page if the cookie UUIDs to do not match', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: { journeyUuid: 'someUuid' },
            mockWriteHeadFn: writeHeadMock,
        });

        await matching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
