import { isUuidStringValid } from '../support/helpers';
import {
    completeMultiOpGeoZonePages,
    completeMultiOpMultiServicePages,
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
} from '../support/steps';

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
