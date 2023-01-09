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
    
    it(`completes successfully for journey by distance`, () => {

        const isGeoZoneJourney = getRandomNumber(1, 2) === 1 ? true: false;
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        isGeoZoneJourney ? completeCappedGeoZonePages() : completeCappedMultiServicePages();
        completeCappedDistanceJourney()
        isFinished()
    });
    
    it(`completes successfully for journey by taps`, () => {

        const isGeoZoneJourney = getRandomNumber(1, 2) === 1 ? true: false;
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        isGeoZoneJourney ? completeCappedGeoZonePages() : completeCappedMultiServicePages();        
        completeCappedTapsJourney()
        isFinished()
    });

    it(`completes successfully for journey by product group`, () => {
        
        const isGeoZoneJourney = getRandomNumber(1, 2) === 1 ? true: false;
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        isGeoZoneJourney ? completeCappedGeoZonePages() : completeCappedMultiServicePages();
        completeCappedProductJourney();
        isFinished();
    });

});