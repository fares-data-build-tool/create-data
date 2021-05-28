import { FullTimeRestriction } from '../types';
import { getTimeRestrictions, getEarliestTime } from './sharedHelpers';

describe('Shared Helpers', () => {
    describe('getTimeRestrictions', () => {
        const fullTimeRestriction: FullTimeRestriction[] = [
            {
                day: 'bankHoliday',
                timeBands: [
                    {
                        startTime: '',
                        endTime: '',
                    },
                ],
            },
            {
                day: 'tuesday',
                timeBands: [
                    {
                        startTime: '0900',
                        endTime: '1700',
                    },
                    {
                        startTime: '1800',
                        endTime: '2200',
                    },
                ],
            },
            {
                day: 'wednesday',
                timeBands: [
                    {
                        startTime: '1350',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                ],
            },
            {
                day: 'thursday',
                timeBands: [
                    {
                        startTime: '0000',
                        endTime: '2359',
                    },
                ],
            },
        ];

        it('generates the correct fareDayType', () => {
            const timeRestrictionNetex = getTimeRestrictions(fullTimeRestriction);

            expect(timeRestrictionNetex).toEqual({
                FareDemandFactor: {
                    id: 'op@Tariff@Demand',
                    validityConditions: {
                        AvailabilityCondition: {
                            IsAvailable: {
                                $t: true,
                            },
                            dayTypes: {
                                FareDayType: [
                                    {
                                        EarliestTime: {
                                            $t: null,
                                        },
                                        id: 'op@Tariff@DayType@bankHoliday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Everyday',
                                                },
                                                HolidayTypes: {
                                                    $t: 'NationalHoliday',
                                                },
                                            },
                                        },
                                        timebands: { Timeband: [] },
                                        version: '1.0',
                                    },
                                    {
                                        EarliestTime: {
                                            $t: '09:00:00',
                                        },
                                        id: 'op@Tariff@DayType@tuesday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Tuesday',
                                                },
                                                HolidayTypes: {
                                                    $t: null,
                                                },
                                            },
                                        },
                                        timebands: {
                                            Timeband: [
                                                {
                                                    EndTime: {
                                                        $t: '17:00:00',
                                                    },
                                                    StartTime: {
                                                        $t: '09:00:00',
                                                    },
                                                    id: 'op:timeband_for_tuesday@timeband_1',
                                                    version: '1.0',
                                                },
                                                {
                                                    EndTime: {
                                                        $t: '22:00:00',
                                                    },
                                                    StartTime: {
                                                        $t: '18:00:00',
                                                    },
                                                    id: 'op:timeband_for_tuesday@timeband_2',
                                                    version: '1.0',
                                                },
                                            ],
                                        },
                                        version: '1.0',
                                    },
                                    {
                                        EarliestTime: {
                                            $t: '13:50:00',
                                        },
                                        id: 'op@Tariff@DayType@wednesday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Wednesday',
                                                },
                                                HolidayTypes: {
                                                    $t: null,
                                                },
                                            },
                                        },
                                        timebands: {
                                            Timeband: [
                                                {
                                                    EndTime: {
                                                        $t: '19:50:00',
                                                    },
                                                    StartTime: {
                                                        $t: '13:50:00',
                                                    },
                                                    id: 'op:timeband_for_wednesday@timeband_1',
                                                    version: '1.0',
                                                },
                                                {
                                                    EndTime: {
                                                        $t: null,
                                                    },
                                                    StartTime: {
                                                        $t: '23:50:00',
                                                    },
                                                    id: 'op:timeband_for_wednesday@timeband_2',
                                                    version: '1.0',
                                                },
                                            ],
                                        },
                                        version: '1.0',
                                    },
                                    {
                                        EarliestTime: {
                                            $t: '00:00:00',
                                        },
                                        id: 'op@Tariff@DayType@thursday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Thursday',
                                                },
                                                HolidayTypes: {
                                                    $t: null,
                                                },
                                            },
                                        },
                                        timebands: {
                                            Timeband: [
                                                {
                                                    EndTime: {
                                                        $t: '23:59:00',
                                                    },
                                                    StartTime: {
                                                        $t: '00:00:00',
                                                    },
                                                    id: 'op:timeband_for_thursday@timeband_1',
                                                    version: '1.0',
                                                },
                                            ],
                                        },
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
    describe('getEarliestTime', () => {
        it('returns the earliest time in the array', () => {
            const times = {
                day: 'wednesday',
                timeBands: [
                    {
                        startTime: '0200',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '0200',
                    },
                    {
                        startTime: '2200',
                        endTime: '1950',
                    },
                    {
                        startTime: '0300',
                        endTime: '',
                    },
                    {
                        startTime: '1500',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                    {
                        startTime: '2300',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                    {
                        startTime: '',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                    {
                        startTime: '0100',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                ],
            };
            const result = getEarliestTime(times);
            expect(result).toBe('0100');
        });
    });
});
