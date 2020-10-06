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
                    timeRestrictions={{
                        startTime: '0900',
                        endTime: '1600',
                        validDays: ['monday', 'tuesday', 'wednesday'],
                    }}
                    csrfToken=""
                    pageProps={[]}
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
                {
                    startTime: '0900',
                    endTime: '1600',
                    validDays: ['monday', 'tuesday', 'wednesday'],
                },
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
                { content: '0900', href: 'defineTimeRestrictions', name: 'Time Restrictions - Start Time' },
                { content: '1600', href: 'defineTimeRestrictions', name: 'Time Restrictions - End Time' },
                {
                    content: 'Monday, Tuesday, Wednesday',
                    href: 'defineTimeRestrictions',
                    name: 'Time Restrictions - Valid Days',
                },
            ]);
        });
    });
});
