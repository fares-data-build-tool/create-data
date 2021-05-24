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
} from '../support/steps';
import { isUuidStringValid } from '../support/helpers';

describe('all user journeys for the create fares data service', () => {
    describe('The single faretype product journey', () => {
        it('completes successfully for csv upload', () => {
            selectFareType('single', false);
            defineUserTypeAndTimeRestrictions();
            completeSinglePages(true);
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for manual upload', () => {
            selectFareType('single', false);
            defineUserTypeAndTimeRestrictions();
            completeSinglePages(false);
            completeSalesPages();
            isUuidStringValid();
        });
    });

    describe('The return faretype product journey', () => {
        it('completes successfully for csv upload', () => {
            selectFareType('return', false);
            defineUserTypeAndTimeRestrictions();
            completeReturnPages(true);
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for manual upload', () => {
            selectFareType('return', false);
            defineUserTypeAndTimeRestrictions();
            completeReturnPages(false);
            completeSalesPages();
            isUuidStringValid();
        });
    });

    describe('The flat fare faretype product journey', () => {
        it('completes successfully', () => {
            selectFareType('flatFare', false);
            defineUserTypeAndTimeRestrictions();
            completeFlatFarePages('Flat Fare Test Product', false);
            completeSalesPages();
            isUuidStringValid();
        });
    });

    describe('the period faretype product journey', () => {
        it('completes successfully for geozone and a single product', () => {
            selectFareType('period', false);
            defineUserTypeAndTimeRestrictions();
            completePeriodGeoZonePages();
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for geozone and multiple products', () => {
            const numberOfProducts = 5;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('period', false);
            defineUserTypeAndTimeRestrictions();
            completePeriodGeoZonePages(numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });

        it('completes successfully for multi-service and a single product', () => {
            selectFareType('period', false);
            defineUserTypeAndTimeRestrictions();
            completePeriodMultiServicePages();
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for multi-service and multiple products', () => {
            const numberOfProducts = 3;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('period', false);
            defineUserTypeAndTimeRestrictions();
            completePeriodMultiServicePages(numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });
    });

    describe('the multi-operator faretype product journey', () => {
        it('completes successfully for geozone and a single product', () => {
            selectFareType('multiOperator', false);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(false);
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for geozone and multiple products', () => {
            const numberOfProducts = 5;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('multiOperator', false);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(false, numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });

        it('completes successfully for multi-service and a single product', () => {
            selectFareType('multiOperator', false);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpMultiServicePages();
            completeSalesPages();
            isUuidStringValid();
        });

        it('completes successfully for multi-service and multiple products', () => {
            const numberOfProducts = 3;
            const multiProductNamePrefix = 'Cypress product ';
            selectFareType('multiOperator', false);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpMultiServicePages(numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid();
        });
    });

    describe('the scheme journey', () => {
        it('completes successfully for geozone and a single product', () => {
            selectFareType('period', true);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(true);
            completeSalesPages();
            isUuidStringValid(true);
        });

        it('completes successfully for geozone and multiple products', () => {
            const numberOfProducts = 5;
            const multiProductNamePrefix = 'Scheme product ';
            selectFareType('period', true);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages(true, numberOfProducts, multiProductNamePrefix);
            completeSalesPages(numberOfProducts, multiProductNamePrefix);
            isUuidStringValid(true);
        });

        it('completes successfully for flat fare', () => {
            selectFareType('flatFare', true);
            defineUserTypeAndTimeRestrictions();
            completeFlatFarePages('Scheme Flat Fare Test Product', true);
            completeSalesPages();
            isUuidStringValid(true);
        });
    });
});
