import * as React from 'react';
import { shallow } from 'enzyme';
import FareConfirmation, { buildFareConfirmationElements } from '../../src/pages/fareConfirmation';

describe('pages', () => {
    describe('fareConfirmation', () => {
        it('should render correctly', () => {
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
    });
    describe('buildFareConfirmationElements', () => {
        it('should create confirmation elements for the fare information', () => {
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
                { content: 'Return', href: 'fareType', name: 'Fare Type' },
                { content: 'Adult', href: 'passengerType', name: 'Passenger Type' },
                {
                    content: 'Minimum Age: 18 Maximum Age: 100',
                    href: 'definePassengerType',
                    name: 'Passenger Information - Age Range',
                },
                {
                    content: 'Membership Card',
                    href: 'definePassengerType',
                    name: 'Passenger Information - Proof Documents',
                },
                {
                    content: 'Start time: 0900 End time: 1600',
                    href: 'defineTimeRestrictions',
                    name: 'Time Restrictions - Wednesday',
                },
                {
                    content: 'Start time: N/A End time: 1600',
                    href: 'defineTimeRestrictions',
                    name: 'Time Restrictions - Thursday',
                },
                {
                    content: 'Start time: N/A End time: N/A',
                    href: 'defineTimeRestrictions',
                    name: 'Time Restrictions - Friday',
                },
            ]);
        });
    });
});
