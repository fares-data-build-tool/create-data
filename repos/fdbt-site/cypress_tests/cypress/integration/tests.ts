import {
    selectFareType,
    defineUserTypeAndTimeRestrictions,
    completeSalesPages,
    completePeriodGeoZonePages,
    completeSinglePages,
    completeReturnPages,
    completeFlatFarePages,
    completePeriodMultiServicePages,
    completeMultiOpGeoZonePages,
    completeMultiOpMultiServicePages,
    startSchemeJourney,
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

        it('completes successfully for multi-service and a single product', () => {
            selectFareType('period');
            defineUserTypeAndTimeRestrictions();
            completePeriodMultiServicePages();
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for multi-service and multiple products', () => {
            const numberOfProducts = 3;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('period');
            defineUserTypeAndTimeRestrictions();
            completePeriodMultiServicePages(numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });
    });

    describe('the multi-operator faretype product journey', () => {
        it('completes successfully for geozone and a single product', () => {
            selectFareType('multiOperator');
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(false);
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for geozone and multiple products', () => {
            const numberOfProducts = 5;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('multiOperator');
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(false, numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });

        it('completes successfully for multi-service and a single product', () => {
            selectFareType('multiOperator');
            defineUserTypeAndTimeRestrictions();
            completeMultiOpMultiServicePages();
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for multi-service and multiple products', () => {
            const numberOfProducts = 3;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('multiOperator');
            defineUserTypeAndTimeRestrictions();
            completeMultiOpMultiServicePages(numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });
    });

    describe('the scheme journey', () => {
        it('completes successfully for geozone and a single product', () => {
            startSchemeJourney();
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(true);
            completeSalesPages();
            isUuidStringValid(true);
        });

        it('completes successfully for geozone and multiple products', () => {
            const numberOfProducts = 5;
            const multiProductNamePrefix = 'Scheme product ';
            startSchemeJourney();
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(true, numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid(true);
        });
    });
});
