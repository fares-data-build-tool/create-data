import { isUuidStringValid } from '../support/helpers';
import {
    completePointToPointPeriodPages,
    completeHybridPages,
    completePeriodGeoZonePages,
    completePeriodMultiServicePages,
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
} from '../support/steps';

describe('the period faretype product journey', () => {
    it('completes successfully for geozone and a single product', () => {
        selectFareType('period', false);
        defineUserTypeAndTimeRestrictions();
        completePeriodGeoZonePages(1);
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

    it('completes successfully for point to point period products', () => {
        selectFareType('period', false);
        defineUserTypeAndTimeRestrictions();
        completePointToPointPeriodPages();
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for hybrid and multiple products', () => {
        const numberOfProducts = 3;
        const multiProductNamePrefix = 'Hybrid product ';
        selectFareType('period', false);
        defineUserTypeAndTimeRestrictions();
        completeHybridPages(numberOfProducts, multiProductNamePrefix);
        completeSalesPages(numberOfProducts, multiProductNamePrefix);
        isUuidStringValid();
    });
});
