import {
    INPUT_METHOD_ATTRIBUTE,
    TIME_RESTRICTIONS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../../src/constants/index';
import breadcrumb from '../../src/utils/breadcrumbs';
import {
    getMockContext,
    mockFromHomeBreadcrumbs,
    mockSingleAdultCsvUploadFromMatchingBreadcrumbs,
    mockReturnAnyoneManualFromOutboundMatchingBreadcrumbs,
    mockPeriodGeoZoneSeniorFromCsvZoneUploadBreadcrumbs,
    mockFlatFareStudentFromDefinePassengerTypeBreadcrumbs,
    mockMultiServicesAnyoneFromMultipleProductValidityBreadcrumbs,
    mockMultiServicesAnyoneFromPeriodValidityBreadcrumbs,
} from '../testData/mockData';
import { NextPageContextWithSession } from '../../src/interfaces';

describe('breadcrumbs', () => {
    let ctx: NextPageContextWithSession;

    it('creates the correct array of Breadcrumbs if user is on home page', () => {
        ctx = getMockContext({ url: '/' });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockFromHomeBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on matching page having selected single, adult and csv upload', () => {
        ctx = getMockContext({
            url: '/matching',
            cookies: { passengerType: { passengerType: 'adult' } },
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
                [INPUT_METHOD_ATTRIBUTE]: { inputMethod: 'csv' },
            },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockSingleAdultCsvUploadFromMatchingBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on outbound matching page having selected return, anyone and manual upload', () => {
        ctx = getMockContext({
            url: '/outboundMatching',
            cookies: { passengerType: { passengerType: 'anyone' }, inputMethod: 'manual' },
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'anyone' },
                [INPUT_METHOD_ATTRIBUTE]: { inputMethod: 'manual' },
            },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockReturnAnyoneManualFromOutboundMatchingBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on csv zone upload page having selected period geozone and senior', () => {
        ctx = getMockContext({
            url: '/csvZoneUpload',
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'Senior' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'geoZone' },
            },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockPeriodGeoZoneSeniorFromCsvZoneUploadBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on define passenger type page having selected flat fare and student', () => {
        ctx = getMockContext({
            url: '/definePassengerType',
            cookies: { passengerType: { passengerType: 'Student' } },
            session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' } },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockFlatFareStudentFromDefinePassengerTypeBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on multiple product validity page having selected multiple services and anyone', () => {
        ctx = getMockContext({
            url: '/multipleProductValidity',
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'anyone' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
            },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockMultiServicesAnyoneFromMultipleProductValidityBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on period validity page having selected multiple services and anyone', () => {
        ctx = getMockContext({
            url: '/periodValidity',
            cookies: {
                passengerType: { passengerType: 'anyone' },
                numberOfProducts: '1',
            },
            session: {
                [TIME_RESTRICTIONS_ATTRIBUTE]: { timeRestrictions: true },
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'anyone' },
                [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
            },
        });
        const result = breadcrumb(ctx).generate();
        expect(result).toEqual(mockMultiServicesAnyoneFromPeriodValidityBreadcrumbs);
    });
});
