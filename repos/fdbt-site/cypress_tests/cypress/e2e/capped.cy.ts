import { isFinished } from '../support/helpers';
import {
    defineUserTypeAndTimeRestrictions,
    selectFareType,
    completeCappedGeoZonePages,
    completeCappedDistanceJourney,
    completeCappedMultiServicePages,
    completeCappedTapsJourney,
    completeCappedProductJourney,
} from '../support/steps';


describe('the capped faretype product journey', () => {
    it('completes successfully for geozone distance journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedGeoZonePages()
        completeCappedDistanceJourney()
        isFinished()
    });

    it('completes successfully for multi-service distance journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedMultiServicePages();
        completeCappedDistanceJourney()
        isFinished()
    });
    
    it('completes successfully for geozone taps journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedGeoZonePages()
        completeCappedTapsJourney()
        isFinished()
    });

    it('completes successfully for multi-service taps journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedMultiServicePages();
        completeCappedTapsJourney()
        isFinished()
    });

    it.only('completes successfully for geozone products journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedGeoZonePages();
        completeCappedProductJourney();
        isFinished();
    });

    it('completes successfully for multi-service products journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedMultiServicePages();
        completeCappedTapsJourney()
        isFinished()
    });
});
