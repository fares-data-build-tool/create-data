import * as netexHelpers from './periodTicketNetexHelpers';
import geoZonePeriodData from '../testdata/geoZonePeriodData';
import { expectedScheduledStopPointsList, expectedTopographicProjectionsList } from '../testdata/test-data';

describe('periodTicketNetexHelpers', () => {
    const { stops } = geoZonePeriodData;

    describe('getScheduledStopPointsList', () => {
        it('returns a list of NeTEx scheduled stop points given a list of stops', () => {
            const scheduledStopPointsList = netexHelpers.getScheduledStopPointsList(stops);

            expect(scheduledStopPointsList).toEqual(expectedScheduledStopPointsList)
        });
    });

    describe('getTopographicProjectionRefList', () => {
        it('returns a list of NeTEx topographic projections given a list of stops', () => {
            const topographicProjectionsList = netexHelpers.getTopographicProjectionRefList(stops);

            expect(topographicProjectionsList).toEqual(expectedTopographicProjectionsList);
        });
    });
});
