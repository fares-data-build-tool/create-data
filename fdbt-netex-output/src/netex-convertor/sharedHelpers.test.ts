import { TimeRestriction } from '../types';
import { getTimeRestrictions } from './sharedHelpers';

describe('Shared Helpers', () => {
    describe('getTimeRestrictions', () => {
        const fullTimeRestriction: TimeRestriction = {
            startTime: '0500',
            endTime: '1200',
            validDays: ['monday'],
        };

        const timeOnlyTimeRestriction: TimeRestriction = {
            startTime: '0401',
            endTime: '2032',
        };

        const validDaysOnlyTimeRestriction: TimeRestriction = {
            validDays: ['monday', 'tuesday', 'wednesday', 'sunday'],
        };

        it.each([
            [fullTimeRestriction, 'PT7H', '05:00:00', 'Monday'],
            [timeOnlyTimeRestriction, 'PT16H31M', '04:01:00', null],
            [validDaysOnlyTimeRestriction, null, null, 'Monday Tuesday Wednesday Sunday'],
        ])('generates the correct fareDayType', (timeRestrictionData, dayLength, earliestTime, daysOfWeek) => {
            const timeRestrictionNetex = getTimeRestrictions(timeRestrictionData);

            expect(timeRestrictionNetex).toEqual({
                FareDemandFactor: {
                    id: 'op@Tariff@Demand',
                    validityConditions: {
                        AvailabilityCondition: {
                            IsAvailable: { $t: true },
                            dayTypes: {
                                FareDayType: {
                                    DayLength: { $t: dayLength },
                                    EarliestTime: { $t: earliestTime },
                                    id: 'op@Tariff@DayType',
                                    properties: daysOfWeek
                                        ? {
                                              PropertyOfDay: {
                                                  DaysOfWeek: {
                                                      $t: daysOfWeek,
                                                  },
                                              },
                                          }
                                        : null,
                                    version: '1.0',
                                },
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
