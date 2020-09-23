import inboundMatching from '../../../src/pages/api/inboundMatching';
import {
    getMockRequestAndResponse,
    service,
    mockMatchingUserFareStagesWithUnassignedStages,
    mockMatchingUserFareStagesWithAllStagesAssigned,
} from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import { InboundMatchingInfo, MatchingWithErrors } from '../../../src/interfaces/matchingInterface';
import { INBOUND_MATCHING_ATTRIBUTE } from '../../../src/constants';

const selectedOptions = {
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

describe('Inbound Matching API', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    const writeHeadMock = jest.fn();
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates matching info, updates the INBOUND_MATCHING_ATTRIBUTE and then redirects to selectSalesOfferPackage page is all is valid', () => {
        const mockMatchingInfo: InboundMatchingInfo = {
            inboundUserFareStages: expect.any(Object),
            inboundMatchingFareZones: expect.any(Object),
        };
        const { req, res } = getMockRequestAndResponse({
            body: {
                ...selectedOptions,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            mockWriteHeadFn: writeHeadMock,
        });
        inboundMatching(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, INBOUND_MATCHING_ATTRIBUTE, mockMatchingInfo);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/returnValidity' });
    });

    it('correctly generates matching error info, updates the INBOUND_MATCHING_ATTRIBUTE and then redirects to inboundMatching page when there are unassigned fare stages', () => {
        const mockMatchingError: MatchingWithErrors = {
            error: true,
            selectedFareStages: expect.any(Object),
        };
        const { req, res } = getMockRequestAndResponse({
            body: {
                ...selectedOptions,
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithUnassignedStages),
            },
            mockWriteHeadFn: writeHeadMock,
        });
        inboundMatching(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, INBOUND_MATCHING_ATTRIBUTE, mockMatchingError);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inboundMatching',
        });
    });

    it('redirects to inboundMatching page if no stops are allocated to fare stages', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                option0: '',
                option1: '',
                service: JSON.stringify(service),
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            mockWriteHeadFn: writeHeadMock,
        });

        inboundMatching(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inboundMatching',
        });
    });

    it('redirects back to error page if no user data in body', () => {
        const { req, res } = getMockRequestAndResponse({
            body: { ...selectedOptions, service: JSON.stringify(service), userfarestages: '' },
            mockWriteHeadFn: writeHeadMock,
        });

        inboundMatching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('redirects back to error page if no service info in body', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                ...selectedOptions,
                service: '',
                userfarestages: JSON.stringify(mockMatchingUserFareStagesWithAllStagesAssigned),
            },
            mockWriteHeadFn: writeHeadMock,
        });

        inboundMatching(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
