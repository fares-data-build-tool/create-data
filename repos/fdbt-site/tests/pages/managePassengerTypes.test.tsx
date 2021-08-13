import * as React from 'react';
import { shallow } from 'enzyme';
import ManagePassengerTypes from '../../src/pages/managePassengerTypes';

describe('pages', () => {
    describe('manage passenger types', () => {
        it('should render correctly', () => {
            const inputs = {
                id: 0,
                name: '',
                passengerType: {
                    passengerType: 'adult',
                },
            };

            const tree = shallow(<ManagePassengerTypes editMode={false} csrfToken={''} errors={[]} inputs={inputs} />);

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on passenger type form group when passenger type not selected', () => {
            const errors = [{ id: 'type', errorMessage: 'You must select a passenger type' }];

            const inputs = {
                name: 'Regular Adult',
                id: 0,
                passengerType: {
                    passengerType: 'Regular Adult',
                    ageRangeMin: '15',
                    ageRangeMax: '65',
                },
            };

            const tree = shallow(
                <ManagePassengerTypes editMode={false} csrfToken={''} errors={errors} inputs={inputs} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on name form group when name input left blank', () => {
            const errors = [{ id: 'name', errorMessage: 'You must provide a name' }];

            const inputs = {
                name: '',
                id: 0,
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '4',
                    ageRangeMax: '15',
                    proofDocuments: ['studentCard'],
                },
            };

            const tree = shallow(
                <ManagePassengerTypes editMode={false} csrfToken={''} errors={errors} inputs={inputs} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render update passenger type button when in edit mode', () => {
            const inputs = {
                id: 1,
                name: 'Regular child',
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '4',
                    ageRangeMax: '15',
                    proofDocuments: ['studentCard'],
                },
            };

            const tree = shallow(<ManagePassengerTypes editMode={false} csrfToken={''} errors={[]} inputs={inputs} />);

            expect(tree).toMatchSnapshot();
        });
    });
});
