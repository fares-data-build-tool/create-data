import * as React from 'react';
import { shallow } from 'enzyme';
import ManagePassengerGroup from '../../src/pages/managePassengerGroup';

describe('pages', () => {
    describe('managePassengerGroup', () => {
        it('should render correctly on first opening of page', () => {
            const tree = shallow(
                <ManagePassengerGroup
                    csrfToken={''}
                    errors={[]}
                    inputs={{
                        companions: [],
                        name: '',
                        maxGroupSize: '',
                    }}
                    passengers={[
                        {
                            id: 1,
                            name: 'Normal adult',
                            passengerType: {
                                passengerType: 'adult',
                                proofDocuments: [],
                                ageRangeMin: '18',
                                ageRangeMax: '75',
                            },
                        },
                        {
                            id: 2,
                            name: 'Normal child',
                            passengerType: {
                                passengerType: 'child',
                                proofDocuments: [],
                                ageRangeMin: '5',
                                ageRangeMax: '13',
                            },
                        },
                    ]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly after errors are made and page rerenders', () => {
            const tree = shallow(
                <ManagePassengerGroup
                    csrfToken={''}
                    errors={[
                        {
                            errorMessage: 'Minimum amount cannot be greater than 4',
                            id: 'minimum-passengers-Regular Senior',
                            userInput: '5',
                        },
                        {
                            errorMessage: 'Maximum amount is required',
                            id: 'minimum-passengers-Regular Senior',
                        },
                        {
                            errorMessage: 'Enter a group name of up to 50 characters',
                            id: 'passenger-group-name',
                            userInput: '',
                        },
                    ]}
                    inputs={{ name: '', maxGroupSize: '4', companions: [] }}
                    passengers={[
                        {
                            id: 1,
                            name: 'Regular Senior',
                            passengerType: {
                                passengerType: 'senior',
                                ageRangeMin: '',
                                ageRangeMax: '',
                                proofDocuments: [],
                            },
                        },
                        {
                            id: 2,
                            name: 'Regular infant',
                            passengerType: {
                                passengerType: 'infant',
                                ageRangeMin: '1',
                                ageRangeMax: '3',
                                proofDocuments: [],
                            },
                        },
                    ]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
