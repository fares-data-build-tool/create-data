import { getNamesOfFareZones, thereIsAFareStageNameMismatch } from '../../../src/pages/api/updateFareTriangle';
import { UserFareStages } from '../../../src/interfaces/index';
import { ReturnTicket, SingleTicket, WithIds } from '../../../shared/matchingJsonTypes';
import { expectedNonCircularReturnTicket, expectedSingleTicket } from '../../testData/mockData';

describe('test logic in helper functions', () => {
    it('getNamesOfFareZones returns array of fare zone names for single tickets', () => {
        const ticket: WithIds<SingleTicket> = expectedSingleTicket;
        const expectedResult = [
            'Acomb Green Lane',
            'Mattison Way',
            'Holl Bank/Beech Ave',
            'Blossom Street',
            'Piccadilly (York)',
        ];

        const result = getNamesOfFareZones(ticket);

        expect(result).toEqual(expectedResult);
    });

    it('getNamesOfFareZones returns array of fare zone names for return tickets', () => {
        const ticket: WithIds<ReturnTicket> = expectedNonCircularReturnTicket;
        const expectedResult = [
            'Acomb Green Lane',
            'Mattison Way',
            'Holl Bank/Beech Ave',
            'Blossom Street',
            'Piccadilly (York)',
        ];

        const result = getNamesOfFareZones(ticket);

        expect(result).toEqual(expectedResult);
    });

    it('ensures the thereIsAFareStageNameMismatch function returns false when there is no mismatch', () => {
        const fareTriangleData: UserFareStages = {
            fareStages: [
                {
                    stageName: 'Acomb Green Lane',
                    prices: [],
                },
                {
                    stageName: 'Mattison Way',
                    prices: [],
                },
                {
                    stageName: 'Holl Bank/Beech Ave',
                    prices: [],
                },
            ],
        };

        const fareZoneNames = ['Acomb Green Lane', 'Mattison Way', 'Holl Bank/Beech Ave'];

        const result = thereIsAFareStageNameMismatch(fareTriangleData, fareZoneNames);

        expect(result).toBe(false);
    });

    it('ensures the thereIsAFareStageNameMismatch function returns true when there is no mismatch', () => {
        const fareTriangleData: UserFareStages = {
            fareStages: [
                {
                    stageName: 'Acomb Green Lane',
                    prices: [],
                },
                {
                    stageName: 'Teeside Avenue',
                    prices: [],
                },
                {
                    stageName: 'Holl Bank/Beech Ave',
                    prices: [],
                },
            ],
        };

        const fareZoneNames = ['Acomb Green Lane', 'Mattison Way', 'Holl Bank/Beech Ave'];

        const result = thereIsAFareStageNameMismatch(fareTriangleData, fareZoneNames);

        expect(result).toBe(true);
    });
});
