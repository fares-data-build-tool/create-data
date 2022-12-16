import { isFinished } from '../support/helpers';
import {
    defineUserTypeAndTimeRestrictions,
    selectFareType,
    completeCappedGeoZonePages,
    completeCappedDistanceJourney,
    completeCappedMultiServicePages,
} from '../support/steps';


describe('the capped faretype product journey', () => {
    it('completes successfully for geozone distance journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedGeoZonePages()
        completeCappedDistanceJourney()
    });

    it('completes successfully for multi-service distance journey', () => {
        selectFareType('cappedProduct', false);
        defineUserTypeAndTimeRestrictions();
        completeCappedMultiServicePages();
        completeCappedDistanceJourney()
        isFinished();
    });
});
