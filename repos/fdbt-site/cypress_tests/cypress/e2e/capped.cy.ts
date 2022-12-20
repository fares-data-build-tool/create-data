import { getRandomNumber, isFinished } from '../support/helpers';
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

    const isGeoZoneJourney = getRandomNumber(1, 2) === 1 ? true: false;
    
    it(`completes successfully for ${isGeoZoneJourney ? 'geo-zone' : 'multi-service'} distance journey`, () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        isGeoZoneJourney ? completeCappedGeoZonePages() : completeCappedMultiServicePages();
        completeCappedDistanceJourney()
        isFinished()
    });
    
    it(`completes successfully for ${isGeoZoneJourney ? 'geo-zone' : 'multi-service'} taps journey`, () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        isGeoZoneJourney ? completeCappedGeoZonePages() : completeCappedMultiServicePages();        
        completeCappedTapsJourney()
        isFinished()
    });

    it(`completes successfully for ${isGeoZoneJourney ? 'geo-zone' : 'multi-service'} products journey`, () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        isGeoZoneJourney ? completeCappedGeoZonePages() : completeCappedMultiServicePages();
        completeCappedProductJourney();
        isFinished();
    });

});
