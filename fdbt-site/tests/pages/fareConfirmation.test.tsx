import * as React from 'react';
import { shallow } from 'enzyme';
import FareConfirmation, { buildFareConfirmationElements } from '../../src/pages/fareConfirmation';

describe('pages', () => {
    describe('fareConfirmation', () => {
        it('should render correctly for non school tickets', () => {
            const tree = shallow(
                <FareConfirmation
                    fareType="single"
                    passengerType={{
                        passengerType: 'adult',
                        ageRange: 'yes',
                        ageRangeMin: '18',
                        ageRangeMax: '100',
                        proof: 'yes',
                        proofDocuments: ['membership card'],
                    }}
                    groupPassengerInfo={[]}
                    schoolFareType=""
                    termTime=""
                    fullTimeRestrictions={[
                        {
                            day: 'thursday',
                            startTime: '0900',
                            endTime: '1600',
                        },
                        {
                            day: 'friday',
                            startTime: '',
                            endTime: '1600',
                        },
                        {
                            day: 'bank holiday',
                            startTime: '',
                            endTime: '',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for school tickets', () => {
            const tree = shallow(
                <FareConfirmation
                    fareType="schoolService"
                    passengerType={{
                        passengerType: 'schoolPupil',
                        ageRange: 'yes',
                        ageRangeMax: '18',
                        proof: 'yes',
                        proofDocuments: ['Student Card'],
                    }}
                    groupPassengerInfo={[]}
                    schoolFareType="single"
                    termTime="true"
                    fullTimeRestrictions={[]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('buildFareConfirmationElements', () => {
            it('should create confirmation elements for non school tickets', () => {
                const result = buildFareConfirmationElements(
                    'return',
                    {
                        passengerType: 'adult',
                        ageRange: 'yes',
                        ageRangeMin: '18',
                        ageRangeMax: '100',
                        proof: 'yes',
                        proofDocuments: ['membership card'],
                    },
                    [],
                    '',
                    '',
                    [
                        {
                            day: 'wednesday',
                            startTime: '0900',
                            endTime: '1600',
                        },
                        {
                            day: 'thursday',
                            startTime: '',
                            endTime: '1600',
                        },
                        {
                            day: 'friday',
                            startTime: '',
                            endTime: '',
                        },
                    ],
                );
                expect(result).toStrictEqual([
                    { content: 'Return', href: 'fareType', name: 'Fare type' },
                    { content: 'Adult', href: 'passengerType', name: 'Passenger type' },
                    {
                        content: 'Minimum age: 18 Maximum age: 100',
                        href: 'definePassengerType',
                        name: 'Passenger information - age range',
                    },
                    {
                        content: 'Membership card',
                        href: 'definePassengerType',
                        name: 'Passenger information - proof documents',
                    },
                    {
                        content: 'Start time: 0900 End time: 1600',
                        href: 'defineTimeRestrictions',
                        name: 'Time restrictions - Wednesday',
                    },
                    {
                        content: 'Start time: N/A End time: 1600',
                        href: 'defineTimeRestrictions',
                        name: 'Time restrictions - Thursday',
                    },
                    {
                        content: 'Start time: N/A End time: N/A',
                        href: 'defineTimeRestrictions',
                        name: 'Time restrictions - Friday',
                    },
                ]);
            });

            it('should create confirmation elements for school tickets', () => {
                const result = buildFareConfirmationElements(
                    'schoolService',
                    {
                        passengerType: 'schoolPupil',
                        ageRange: 'yes',
                        ageRangeMax: '18',
                        proof: 'yes',
                        proofDocuments: ['Student Card'],
                    },
                    [],
                    'single',
                    'true',
                    [],
                );
                expect(result).toStrictEqual([
                    { content: 'School service', href: 'fareType', name: 'Fare type' },
                    { content: 'School pupil', href: '', name: 'Passenger type' },
                    {
                        content: 'Minimum age: N/A Maximum age: 18',
                        href: 'definePassengerType',
                        name: 'Passenger information - age range',
                    },
                    {
                        content: 'Student card',
                        href: 'definePassengerType',
                        name: 'Passenger information - proof documents',
                    },
                    {
                        content: 'yes',
                        href: 'termTime',
                        name: 'Only valid during term times',
                    },
                    {
                        content: 'Single',
                        href: 'schoolFareType',
                        name: 'School ticket fare type',
                    },
                ]);
            });
        });
    });
});
