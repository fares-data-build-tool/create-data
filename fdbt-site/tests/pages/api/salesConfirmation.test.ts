import moment from 'moment';
import {
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import salesConfirmation from '../../../src/pages/api/salesConfirmation';
import * as session from '../../../src/utils/sessions';
import * as userData from '../../../src/pages/api/apiUtils/userData';
import * as index from '../../../src/pages/api/apiUtils/index';

describe('salesOfferPackages', () => {
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
    const getSchemeOperatorTicketJsonSpy = jest.spyOn(userData, 'getSchemeOperatorTicketJson');
    const getSingleTicketJsonSpy = jest.spyOn(userData, 'getSingleTicketJson');
    const getReturnTicketJsonSpy = jest.spyOn(userData, 'getReturnTicketJson');
    const getGeoZoneTicketJsonSpy = jest.spyOn(userData, 'getGeoZoneTicketJson');
    const getMultipleServicesTicketJsonSpy = jest.spyOn(userData, 'getMultipleServicesTicketJson');
    const getFlatFareTicketJsonSpy = jest.spyOn(userData, 'getFlatFareTicketJson');

    const todaysDate = moment()
        .toISOString()
        .substr(0, 10);
    const hundredYearsDate = moment()
        .add(100, 'y')
        .toISOString()
        .substr(0, 10);

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('does not update the product date attribute if both start and end date are already on it', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [PRODUCT_DATE_ATTRIBUTE]: {
                    startDate: 'test start date',
                    endDate: 'test end date',
                },
            },
        });

        salesConfirmation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: 'test start date',
            endDate: 'test end date',
        });
    });

    it('updates the start product date attribute if the start date is missing', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [PRODUCT_DATE_ATTRIBUTE]: {
                    endDate: 'test end date',
                },
            },
        });

        salesConfirmation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: expect.stringContaining(todaysDate),
            endDate: 'test end date',
        });
    });

    it('updates the end product date attribute if the end date is missing', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [PRODUCT_DATE_ATTRIBUTE]: {
                    startDate: 'test start date',
                },
            },
        });

        salesConfirmation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: 'test start date',
            endDate: expect.stringContaining(hundredYearsDate),
        });
    });

    it('gets scheme operator json for a scheme operator', () => {
        const isSchemeOperatorSpy = jest.spyOn(index, 'isSchemeOperator');
        isSchemeOperatorSpy.mockImplementation(() => true);
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        salesConfirmation(req, res);

        expect(getSchemeOperatorTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets single json for a single ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'single');
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        salesConfirmation(req, res);

        expect(getSingleTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets return json for a return ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'return');
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        salesConfirmation(req, res);

        expect(getReturnTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets geoZone json for a period geoZone ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'period');
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets geoZone json for a multi operator geoZone ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'multiOperator');
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        salesConfirmation(req, res);

        expect(getGeoZoneTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets multiService json for a period multiService ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'period');
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets multiService json for a multi operator multiService ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'multiOperator');
        const { req, res } = getMockRequestAndResponse({
            body: {},
            session: {
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        salesConfirmation(req, res);

        expect(getMultipleServicesTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('gets flatFare json for a flatFare ticket', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'flatFare');
        const { req, res } = getMockRequestAndResponse({
            body: {},
        });

        salesConfirmation(req, res);

        expect(getFlatFareTicketJsonSpy).toBeCalledWith(req, res);
    });

    it('creates a group definition for a group ticket and adds to user json object', () => {
        const getFareTypeFromFromAttributesSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
        getFareTypeFromFromAttributesSpy.mockImplementation(() => 'single');
        const putUserDataInS3Spy = jest.spyOn(userData, 'putUserDataInS3');
        const exampleUserJson = {
            nocCode: 'TEST',
            type: 'single',
            passengerType: 'adult',
            ageRange: 'string',
            ageRangeMin: 'string',
            ageRangeMax: 'string',
            proof: 'string',
            proofDocuments: [],
            email: 'string',
            uuid: 'string',
            timeRestriction: [],
            ticketPeriod: {
                startDate: 'now',
                endDate: 'a year later',
                dateInput: {
                    startDateDay: '',
                    startDateMonth: '',
                    startDateYear: '',
                    endDateDay: '',
                    endDateMonth: '',
                    endDateYear: '',
                },
            },
            operatorShortName: 'string',
            lineName: 'string',
            lineId: '3h3vb32ik',
            serviceDescription: 'string',
            products: [],
            fareZones: [],
            termTime: true,
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
            },
        });

        salesConfirmation(req, res);

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
        );
    });
});
