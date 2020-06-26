import { NextPageContext } from 'next';
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

describe('breadcrumbs', () => {
    let ctx: NextPageContext;

    it('creates the correct array of Breadcrumbs if user is on home page', () => {
        ctx = getMockContext({ url: '/' });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockFromHomeBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on matching page having selected single, adult and csv upload', () => {
        ctx = getMockContext({ url: '/matching' });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockSingleAdultCsvUploadFromMatchingBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on outbound matching page having selected return, anyone and manual upload', () => {
        ctx = getMockContext({
            url: '/outboundMatching',
            cookies: { fareType: 'return', inputMethod: 'manual', passengerType: { passengerType: 'anyone' } },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockReturnAnyoneManualFromOutboundMatchingBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on csv zone upload page having selected period geozone and senior', () => {
        ctx = getMockContext({
            url: '/csvZoneUpload',
            cookies: {
                fareType: 'period',
                periodTypeName: 'periodGeoZone',
                passengerType: { passengerType: 'Senior' },
            },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockPeriodGeoZoneSeniorFromCsvZoneUploadBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on define passenger type page having selected flat fare and student', () => {
        ctx = getMockContext({
            url: '/definePassengerType',
            cookies: { fareType: 'flatFare', passengerType: { passengerType: 'Student' } },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockFlatFareStudentFromDefinePassengerTypeBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on multiple product validity page having selected multiple services and anyone', () => {
        ctx = getMockContext({
            url: '/multipleProductValidity',
            cookies: {
                fareType: 'period',
                periodTypeName: 'periodMultipleServices',
                passengerType: { passengerType: 'anyone' },
            },
        });
        const result = breadcrumb(ctx).generate();

        expect(result).toEqual(mockMultiServicesAnyoneFromMultipleProductValidityBreadcrumbs);
    });

    it('creates the correct array of Breadcrumbs if user is on period validity page having selected multiple services and anyone', () => {
        ctx = getMockContext({
            url: '/periodValidity',
            cookies: {
                fareType: 'period',
                periodTypeName: 'periodMultipleServices',
                passengerType: { passengerType: 'anyone' },
                numberOfProducts: '1',
            },
        });
        const result = breadcrumb(ctx).generate();
        expect(result).toEqual(mockMultiServicesAnyoneFromPeriodValidityBreadcrumbs);
    });
});
