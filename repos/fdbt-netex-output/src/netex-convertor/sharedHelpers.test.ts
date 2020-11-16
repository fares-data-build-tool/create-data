import { FullTimeRestriction } from '../types';
import { getTimeRestrictions } from './sharedHelpers';

describe('Shared Helpers', () => {
    describe('getTimeRestrictions', () => {
        const fullTimeRestriction: FullTimeRestriction[] = [
            {
                day: 'monday',
                startTime: '',
                endTime: '',
            },
            {
                day: 'tuesday',
                startTime: '0900',
                endTime: '1700',
            },
            {
                day: 'wednesday',
                startTime: '',
                endTime: '1950',
            },
            {
                day: 'thursday',
                startTime: '0000',
                endTime: '2359',
            },
        ];

        it('generates the correct fareDayType', () => {
            const timeRestrictionNetex = getTimeRestrictions(fullTimeRestriction);

            expect(timeRestrictionNetex).toEqual({
                FareDemandFactor: {
                    id: 'op@Tariff@Demand',
                    validityConditions: {
                        AvailabilityCondition: {
                            IsAvailable: { $t: true },
                            dayTypes: {
                                FareDayType: [
                                    {
                                        DayLength: { $t: null },
                                        EarliestTime: { $t: null },
                                        id: 'op@Tariff@DayType@monday',
                                        properties: { PropertyOfDay: { DaysOfWeek: { $t: 'Monday' } } },
                                        version: '1.0',
                                    },
                                    {
                                        DayLength: { $t: 'PT8H' },
                                        EarliestTime: { $t: '09:00:00' },
                                        id: 'op@Tariff@DayType@tuesday',
                                        properties: { PropertyOfDay: { DaysOfWeek: { $t: 'Tuesday' } } },
                                        version: '1.0',
                                    },
                                    {
                                        DayLength: { $t: null },
                                        EarliestTime: { $t: null },
                                        id: 'op@Tariff@DayType@wednesday',
                                        properties: { PropertyOfDay: { DaysOfWeek: { $t: 'Wednesday' } } },
                                        version: '1.0',
                                    },
                                    {
                                        DayLength: { $t: 'PT23H59M' },
                                        EarliestTime: { $t: '00:00:00' },
                                        id: 'op@Tariff@DayType@thursday',
                                        properties: { PropertyOfDay: { DaysOfWeek: { $t: 'Thursday' } } },
                                        version: '1.0',
                                    },
                                ],
                            },
                            id: 'op@Tariff@Condition',
                            version: '1.0',
                        },
                    },
                    version: '1.0',
                },
            });
        });
    });
});
