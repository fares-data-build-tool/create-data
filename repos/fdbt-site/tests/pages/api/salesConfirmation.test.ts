import moment from 'moment';
import {
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { TicketPeriodWithInput } from '../../../src/interfaces';
import { getMockRequestAndResponse } from '../../testData/mockData';
import salesConfirmation from '../../../src/pages/api/salesConfirmation';
import * as session from '../../../src/utils/sessions';
import * as userData from '../../../src/utils/apiUtils/userData';
import * as index from '../../../src/utils/apiUtils/index';

describe('salesOfferPackages', () => {
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
    const getSchemeOperatorTicketJsonSpy = jest.spyOn(userData, 'getSchemeOperatorTicketJson');
    const getSingleTicketJsonSpy = jest.spyOn(userData, 'getSingleTicketJson');
    const getReturnTicketJsonSpy = jest.spyOn(userData, 'getReturnTicketJson');
    const getGeoZoneTicketJsonSpy = jest.spyOn(userData, 'getGeoZoneTicketJson');
    const getMultipleServicesTicketJsonSpy = jest.spyOn(userData, 'getMultipleServicesTicketJson');

    const todaysDate = moment().toISOString().substr(0, 10);
    const hundredYearsDate = moment().add(100, 'y').toISOString().substr(0, 10);

    beforeEach(() => {
        process.env.STAGE = 'dev';
        jest.resetAllMocks();
    });

    it('does not update the product date attribute if both start and end date are already on it', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [PRODUCT_DATE_ATTRIBUTE]: {
                    startDate: 'test start date',
                    endDate: 'test end date',
                } as TicketPeriodWithInput,
            },
        });

        await salesConfirmation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: 'test start date',
            endDate: 'test end date',
        });
    });

    it('updates the start product date attribute if the start date is missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [PRODUCT_DATE_ATTRIBUTE]: {
                    endDate: 'test end date',
                } as TicketPeriodWithInput,
            },
        });

        await salesConfirmation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: expect.stringContaining(todaysDate),
            endDate: 'test end date',
        });
    });

    it('updates the end product date attribute if the end date is missing', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [PRODUCT_DATE_ATTRIBUTE]: {
                    startDate: 'test start date',
                } as TicketPeriodWithInput,
            },
        });

        await salesConfirmation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: 'test start date',
            endDate: expect.stringContaining(hundredYearsDate),
        });
    });

    it('gets scheme operator json for a scheme operator', async () => {
        const isSchemeOperatorSpy = jest.spyOn(index, 'isSchemeOperator');
        isSchemeOperatorSpy.mockImplementation(() => true);
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        await salesConfirmation(req, res);

        expect(getSchemeOperatorTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets single json for a single ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
            },
        });

        await salesConfirmation(req, res);

        expect(getSingleTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets return json for a return ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
            },
        });

        await salesConfirmation(req, res);

        expect(getReturnTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets geoZone json for a period geoZone ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets geoZone json for a multi operator geoZone ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets multiService json for a period multiService ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets multiService json for a multi operator multiService ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets flatFare json for a flatFare multiple services ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets flatFare json for a flatFare geoZone ticket', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        await salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });
});
