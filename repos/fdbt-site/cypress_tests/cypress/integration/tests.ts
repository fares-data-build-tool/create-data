import {
    selectFareType,
    defineUserTypeAndTimeRestrictions,
    completeSalesPages,
    completePeriodGeoZonePages,
    completeSinglePages,
    completeReturnPages,
    completeFlatFarePages,
} from '../support/steps';
import { isUuidStringValid } from '../support/helpers';

describe('all user journeys for the create fares data service', () => {
    describe('The single faretype product journey', () => {
        it('completes successfully for csv upload', () => {
            selectFareType('single');
            defineUserTypeAndTimeRestrictions();
            completeSinglePages(true);
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for manual upload', () => {
            selectFareType('single');
            defineUserTypeAndTimeRestrictions();
            completeSinglePages(false);
            completeSalesPages();
            isUuidStringValid();
        });
    });

    describe('The return faretype product journey', () => {
        it('completes successfully for csv upload', () => {
            selectFareType('return');
            defineUserTypeAndTimeRestrictions();
            completeReturnPages(true);
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for manual upload', () => {
            selectFareType('return');
            defineUserTypeAndTimeRestrictions();
            completeReturnPages(false);
            completeSalesPages();
            isUuidStringValid();
        });
    });

    describe('The flat fare faretype product journey', () => {
        it('completes successfully', () => {
            selectFareType('flatFare');
            defineUserTypeAndTimeRestrictions();
            completeFlatFarePages('Flat Fare Test Product');
            completeSalesPages();
            isUuidStringValid();
        });
    });

    describe('the period faretype product journey', () => {
        it('completes successfully for geozone and a single product', () => {
            selectFareType('period');
            defineUserTypeAndTimeRestrictions();
            completePeriodGeoZonePages();
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for geozone and multiple products', () => {
            const numberOfProducts = 5;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('period');
            defineUserTypeAndTimeRestrictions();
            completePeriodGeoZonePages(numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });
    });
});
