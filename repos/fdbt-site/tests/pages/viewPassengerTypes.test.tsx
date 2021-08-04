import * as React from 'react';
import { shallow } from 'enzyme';
import ViewPassengerTypes from '../../src/pages/viewPassengerTypes';
import { GroupPassengerType, SinglePassengerType } from '../../src/interfaces';

describe('pages', () => {
    describe('view passenger types', () => {
        it('should render correctly when no individual or group passenger types', () => {
            const tree = shallow(
                <ViewPassengerTypes singlePassengerTypes={[]} groupPassengerTypes={[]} csrfToken={''} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when only individual passenger types', () => {
            const passengerType = {
                name: 'Regular Child',
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '5',
                    ageRangeMax: '16',
                    proofDocuments: ['studentCard'],
                },
            };

            const tree = shallow(
                <ViewPassengerTypes singlePassengerTypes={[passengerType]} groupPassengerTypes={[]} csrfToken={''} />,
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
                    groupPassengerTypes={[passengerTypeGroup]}
                    csrfToken={''}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when groups and individual passenger types', () => {
            const passengerTypes: SinglePassengerType[] = [
                {
                    name: 'Regular Child',
                    passengerType: {
                        passengerType: 'child',
                        ageRangeMin: '5',
                        ageRangeMax: '16',
                        proofDocuments: ['studentCard'],
                    },
                },
            ];

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

            const passengerTypeGroups: GroupPassengerType[] = [
                {
                    name: 'family group',
                    maxGroupSize: '3',
                    companions: [adultCompanion, childCompanion],
                },
            ];

            const tree = shallow(
                <ViewPassengerTypes
                    singlePassengerTypes={passengerTypes}
                    groupPassengerTypes={passengerTypeGroups}
                    csrfToken={''}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
