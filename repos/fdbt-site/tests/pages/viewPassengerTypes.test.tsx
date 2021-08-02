import * as React from 'react';
import { shallow } from 'enzyme';
import ViewPassengerTypes from '../../src/pages/viewPassengerTypes';

describe('pages', () => {
    describe('view passenger types', () => {
        it('should render correctly when no individual or group passenger types', () => {
            const tree = shallow(
                <ViewPassengerTypes singlePassengerTypes={[]} groupPrssengerTypes={[]} csrfToken={''} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when only individual passenger types', () => {
            const passengerType = {
                id: 1,
                name: 'Regular Child',
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '5',
                    ageRangeMax: '16',
                    proofDocuments: ['studentCard'],
                },
            };

            const tree = shallow(
                <ViewPassengerTypes singlePassengerTypes={[passengerType]} groupPrssengerTypes={[]} csrfToken={''} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when only passenger type groups', () => {
            const adultCompanion = {
                passengerType: 'adult',
                maxNumber: '2',
            };

            const childCompanion = {
                passengerType: 'child',
                minNumber: '0',
                maxNumber: '1',
                ageRangeMin: '4',
                ageRangeMax: '16',
                proofDocuments: ['studentCard'],
            };

            const passengerTypeGroup = {
                name: 'family group',
                maxGroupSize: '3',
                companions: [adultCompanion, childCompanion],
            };

            const tree = shallow(
                <ViewPassengerTypes
                    singlePassengerTypes={[]}
                    groupPrssengerTypes={[passengerTypeGroup]}
                    csrfToken={''}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when groups and individual passenger types', () => {
            const passengerType = {
                id: 1,
                name: 'Regular Child',
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '5',
                    ageRangeMax: '16',
                    proofDocuments: ['studentCard'],
                },
            };

            const adultCompanion = {
                passengerType: 'adult',
                maxNumber: '2',
            };

            const childCompanion = {
                passengerType: 'child',
                maxNumber: '1',
                ageRangeMin: '4',
                ageRangeMax: '16',
                proofDocuments: ['studentCard'],
            };

            const passengerTypeGroup = {
                name: 'family group',
                maxGroupSize: '3',
                companions: [adultCompanion, childCompanion],
            };

            const tree = shallow(
                <ViewPassengerTypes
                    singlePassengerTypes={[passengerType]}
                    groupPrssengerTypes={[passengerTypeGroup]}
                    csrfToken={''}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
