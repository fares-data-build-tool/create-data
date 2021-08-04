import * as React from 'react';
import { shallow } from 'enzyme';
import ManagePassengerTypes from '../../src/pages/managePassengerTypes';

describe('pages', () => {
    describe('manage passenger types', () => {
        it('should render correctly', () => {
            const model = {
                passengerType: {},
            };

            const tree = shallow(
                <ManagePassengerTypes isInEditMode={false} csrfToken={''} errors={[]} model={model} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on passenger type form group when passenger type not selected', () => {
            const errors = [{ id: 'type', errorMessage: 'You must select a passenger type' }];

            const model = {
                errors: [{ id: 'type', errorMessage: 'You must select a passenger type' }],
                name: 'Regular Adult',
                passengerType: { ageRangeMin: '15', ageRangeMax: '65' },
            };

            const tree = shallow(
                <ManagePassengerTypes isInEditMode={false} csrfToken={''} errors={errors} model={model} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on name form group when name input left blank', () => {
            const errors = [{ id: 'name', errorMessage: 'You must provide a name' }];

            const model = {
                errors: [{ id: 'name', errorMessage: 'You must provide a name' }],
                name: '',
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '4',
                    ageRangeMax: '15',
                    proofDocuments: ['studentCard'],
                },
            };

            const tree = shallow(
                <ManagePassengerTypes isInEditMode={false} csrfToken={''} errors={errors} model={model} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render update passenger type button when in edit mode', () => {
            const model = {
                errors: [],
                id: 1,
                name: 'Regular child',
                passengerType: {
                    passengerType: 'child',
                    ageRangeMin: '4',
                    ageRangeMax: '15',
                    proofDocuments: ['studentCard'],
                },
            };

            const tree = shallow(
                <ManagePassengerTypes isInEditMode={false} csrfToken={''} errors={[]} model={model} />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
