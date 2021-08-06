import outboundMatching from '../../../src/pages/api/outboundMatching';
import { getMockRequestAndResponse, service, mockMatchingUserFareStages } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import { MatchingInfo, MatchingWithErrors } from '../../../src/interfaces/matchingInterface';
import { MATCHING_ATTRIBUTE } from '../../../src/constants/attributes';

const selectedOptions = {
    option0: [
        'Acomb Green Lane',
        '{"stop":{"stopName":"Yoden Way - Chapel Hill Road","naptanCode":"duratdmj","atcoCode":"13003521G","localityCode":"E0045956","localityName":"Peterlee","indicator":"W-bound","street":"Yodan Way","qualifierName":"","parentLocalityName":"IW Test"},"stage":"Acomb Green Lane"}',
    ],
    option1: [
        'Mattison Way',
        '{"stop":{"stopName":"Yoden Way","naptanCode":"duratdmt","atcoCode":"13003522F","localityCode":"E0010183","localityName":"Horden","indicator":"SW-bound","street":"Yoden Way","qualifierName":"","parentLocalityName":"IW Test"},"stage":"Mattison Way"}',
    ],
    option2: [
        'Holl Bank/Beech Ave',
        '{"stop":{"stopName":"Surtees Rd-Edenhill Rd","naptanCode":"durapgdw","atcoCode":"13003219H","localityCode":"E0045956","localityName":"Peterlee","indicator":"NW-bound","street":"Surtees Road","qualifierName":"","parentLocalityName":"IW Test"},"stage":"Holl Bank/Beech Ave"}',
    ],
    option3: [
        'Blossom Street',
        '{"stop":{"stopName":"Bus Station","naptanCode":"duratdma","atcoCode":"13003519H","localityCode":"E0045956","localityName":"Peterlee","indicator":"H","street":"Bede Way","qualifierName":"","parentLocalityName":"IW Test"},"stage":"Blossom Street"}',
    ],
    option4: [
        'Piccadilly (York)',
        '{"stop":{"stopName":"Kell Road","naptanCode":"duraptwp","atcoCode":"13003345D","localityCode":"E0010183","localityName":"Horden","indicator":"SE-bound","street":"Kell Road","qualifierName":"","parentLocalityName":"IW Test"},"stage":"Piccadilly (York)"}',
    ],
};

describe('Outbound Matching API', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates matching info, updates the MATCHING_ATTRIBUTE and then redirects to inboundMatching page is all is valid', () => {
        const expectedMatchingInfo: MatchingInfo = {
            service: expect.any(Object),
            userFareStages: expect.any(Object),
            matchingFareZones: expect.any(Object),
        };
        const { req, res } = getMockRequestAndResponse({
            body: {
                ...selectedOptions,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStages),
            },
            mockWriteHeadFn: writeHeadMock,
        });
        outboundMatching(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MATCHING_ATTRIBUTE, expectedMatchingInfo);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/inboundMatching' });
    });

    it('correctly generates matching error info, updates the MATCHING_ATTRIBUTE and then redirects to outboundMatching page when there are no assigned fare stages', () => {
        const expectedMatchingError: MatchingWithErrors = {
            error: 'No fare stages have been assigned, assign each fare stage to a stop',
            selectedFareStages: expect.any(Object),
        };
        const { req, res } = getMockRequestAndResponse({
            body: {
                option0: '',
                option1: '',
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStages),
            },
            mockWriteHeadFn: writeHeadMock,
        });
        outboundMatching(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MATCHING_ATTRIBUTE, expectedMatchingError);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/outboundMatching',
        });
    });

    it('correctly generates matching warning info, updates the MATCHING_ATTRIBUTE and then redirects to outboundMatching page when there are unassigned fare stages', () => {
        const expectedMatchingError: MatchingWithErrors = {
            warning: true,
            selectedFareStages: expect.any(Object),
        };
        const { req, res } = getMockRequestAndResponse({
            body: {
                option0: '',
                option1: [
                    'Acomb Green Lane',
                    '{"stop":{"stopName":"Yoden Way - Chapel Hill Road","naptanCode":"duratdmj","atcoCode":"13003521G","localityCode":"E0045956","localityName":"Peterlee","indicator":"W-bound","street":"Yodan Way","qualifierName":"","parentLocalityName":"IW Test"},"stage":"Acomb Green Lane"}',
                ],
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStages),
            },
            mockWriteHeadFn: writeHeadMock,
        });
        outboundMatching(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MATCHING_ATTRIBUTE, expectedMatchingError);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/outboundMatching',
        });
    });

    it('redirects back to error page if no user data in body', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { ...selectedOptions, service: JSON.stringify(service), userfarestages: '' },
            mockWriteHeadFn: writeHeadMock,
        });

        outboundMatching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('redirects back to error page if no service info in body', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                ...selectedOptions,
                service: '',
                userfarestages: JSON.stringify(mockMatchingUserFareStages),
            },
            mockWriteHeadFn: writeHeadMock,
        });

        outboundMatching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
