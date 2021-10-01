import moment from 'moment';
import {
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { SingleTicket, TicketPeriodWithInput } from '../../../src/interfaces';
import { SessionAttributeTypes } from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import salesConfirmation from '../../../src/pages/api/salesConfirmation';
import * as session from '../../../src/utils/sessions';
import * as userData from '../../../src/utils/apiUtils/userData';
import * as index from '../../../src/utils/apiUtils/index';
import { WithIds } from '../../../shared/matchingJsonTypes';

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

    it('creates a group definition for a group ticket and adds to user json object', async () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'single');
        const putUserDataInS3Spy = jest.spyOn(userData, 'putUserDataInProductsBucket');
        putUserDataInS3Spy.mockImplementation(() => Promise.resolve('pathToFile'));
        const exampleUserJson: WithIds<SingleTicket> = {
            nocCode: 'TEST',
            type: 'single',
            passengerType: { id: 1 },
            email: 'string',
            uuid: 'string',
            timeRestriction: { id: 2 },
            ticketPeriod: {
                startDate: 'now',
                endDate: 'a year later',
            },
            operatorName: 'string',
            lineName: 'string',
            lineId: '3h3vb32ik',
            serviceDescription: 'string',
            products: [],
            fareZones: [],
            termTime: true,
            unassignedStops: {
                singleUnassignedStops: [],
            },
        };
        getSingleTicketJsonSpy.mockImplementation(() => {
            return exampleUserJson;
        });
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [GROUP_PASSENGER_INFO_ATTRIBUTE]: {
                    thing: 'test thing',
                },
                [GROUP_SIZE_ATTRIBUTE]: {
                    thing: 'another test thing',
                },
                [PASSENGER_TYPE_ATTRIBUTE]: {
                    passengerType: 'group',
                },
            } as unknown as SessionAttributeTypes,
        });

        await salesConfirmation(req, res);

        expect(putUserDataInS3Spy).toBeCalledWith(
            {
                ...exampleUserJson,
                groupDefinition: {
                    companions: {
                        thing: 'test thing',
                    },
                    maxPeople: undefined,
                },
            },
            expect.any(String),
            'TEST',
        );
    });
});
