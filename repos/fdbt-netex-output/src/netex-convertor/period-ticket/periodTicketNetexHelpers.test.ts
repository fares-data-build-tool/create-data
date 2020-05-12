import { expectedMultiServiceFareTables, expectedMultipleFareTables, expectedSalesOfferPackages, expectedGeoZonePreassignedFareProducts, expectedMultiServicesPreassignedFareProducts, expectedTimeIntervals, expectedMultiServiceFareStructureElements, expectedGeoZoneFareStructureElements } from './../testdata/test-data';
import { PeriodGeoZoneTicket } from './../types';
import * as netexHelpers from './periodTicketNetexHelpers';
import geoZonePeriodData from '../testdata/geoZonePeriodData';
import {
    expectedScheduledStopPointsList,
    expectedTopographicProjectionsList,
    expectedLinesList,
    expectedLineRefList,
    multiServicesPeriodData,
    operatorData,
    expectedGeoZoneFareTables
} from '../testdata/test-data';

describe('periodTicketNetexHelpers', () => {
    const { stops } = geoZonePeriodData;
    const geoUserPeriodTicket: PeriodGeoZoneTicket = geoZonePeriodData;
    const multiServicesUserPeriodTicket = multiServicesPeriodData;
    const opData = operatorData;
    const placeHolderText = "PLACEHOLDER";

    describe('getScheduledStopPointsList', () => {
        it('returns a list of NeTEx scheduled stop points given a list of stops', () => {
            const scheduledStopPointsList = netexHelpers.getScheduledStopPointsList(stops);

            expect(scheduledStopPointsList).toEqual(expectedScheduledStopPointsList);
        });
    });

    describe('getTopographicProjectionRefList', () => {
        it('returns a list of NeTEx topographic projections given a list of stops', () => {
            const topographicProjectionsList = netexHelpers.getTopographicProjectionRefList(stops);

            expect(topographicProjectionsList).toEqual(expectedTopographicProjectionsList);
        });
    });

    describe('getLinesList', () => {
        it('returns a list of NeTEx lines given a UserPeriodTicket object', () => {
            const linesList = netexHelpers.getLinesList(multiServicesUserPeriodTicket, opData);

            expect(linesList).toEqual(expectedLinesList);
        });
    });

    describe('getLineRefList', () => {
        it('returns a list of NeTEx line refs given a UserPeriodTicket object', () => {
            const lineRefList = netexHelpers.getLineRefList(multiServicesUserPeriodTicket);

            expect(lineRefList).toEqual(expectedLineRefList);
        });
    });

    describe('getGeoZoneFareTable', () => {
        it('returns a fare table for geoZone products', () => {
            const result = netexHelpers.getGeoZoneFareTable(geoUserPeriodTicket);

            expect(result).toEqual(expectedGeoZoneFareTables);
        });
    });

    describe('getMultiServiceFareTable', () => {
        it('returns a fare table for multiple services products', () => {
            const result = netexHelpers.getMultiServiceFareTable(multiServicesUserPeriodTicket);

            expect(result).toEqual(expectedMultiServiceFareTables);
        });
    });

    describe('getFareTableList', () => {
        it('returns a fare table row for every product in the products array', () => {
            const result = netexHelpers.getFareTableList(multiServicesPeriodData, placeHolderText);

            expect(result).toEqual(expectedMultipleFareTables);
        });
    });

    describe('getSalesOfferPackageList', () => {
        it('returns a sales offer package for each product in the products array', () => {
            const result = netexHelpers.getSalesOfferPackageList(geoUserPeriodTicket, placeHolderText);

            expect(result).toEqual(expectedSalesOfferPackages);
        });
    });

    describe('getPreassignedFareProduct', () => {
        it('returns a preassigned fare product per each product in the products array for geoZone', () => {
            const result = netexHelpers.getPreassignedFareProduct(geoUserPeriodTicket, `noc:${geoUserPeriodTicket.nocCode}`, "noc:TestOperatorOpId", true, false);

            expect(result).toEqual(expectedGeoZonePreassignedFareProducts);
        });

        it('returns a preassigned fare product per each product in the products array for multiService', () => {
            const result = netexHelpers.getPreassignedFareProduct(multiServicesPeriodData, `noc:${multiServicesPeriodData.nocCode}`, "noc:TestOperatorOpId", false, true);

            expect(result).toEqual(expectedMultiServicesPreassignedFareProducts);
        });
    });

    describe('getTimeIntervals', () => {
        it('returns a time interval for each product in the products array', () => {
            const result = netexHelpers.getTimeIntervals(multiServicesPeriodData);

            expect(result).toEqual(expectedTimeIntervals);
        });
    });

    describe('getFareStructureElements', () => {
        it('returns a list of fareSructureElements for each product in the products array for multiService', () => {
            const result = netexHelpers.getFareStructuresElements(multiServicesPeriodData, false, true, placeHolderText);

            expect(result).toEqual(expectedMultiServiceFareStructureElements);
        });

        it('returns a list of fareSructureElements for each product in the products array for geoZone', () => {
            const result = netexHelpers.getFareStructuresElements(geoUserPeriodTicket, true, false, placeHolderText);

            expect(result).toEqual(expectedGeoZoneFareStructureElements);
        });
    });

});
