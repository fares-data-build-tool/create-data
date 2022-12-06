import * as React from 'react';
import { shallow } from 'enzyme';
import ManageProductGroup from '../../src/pages/manageProductGroup';
import { mockOtherProducts, mockPointToPointProducts, mockServicesToDisplay } from '../testData/mockData';

describe('pages', () => {
    describe('manage product group', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ManageProductGroup
                    editMode={false}
                    csrf={''}
                    errors={[]}
                    inputs={undefined}
                    productsToDisplay={[]}
                    servicesToDisplay={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly in edit mode', () => {
            const inputs = {
                id: 3,
                name: 'Product Group 1',
                productIds: ['1', '2'],
            };

            const tree = shallow(
                <ManageProductGroup
                    editMode
                    csrf={''}
                    errors={[]}
                    inputs={inputs}
                    productsToDisplay={[...mockOtherProducts, ...mockPointToPointProducts]}
                    servicesToDisplay={mockServicesToDisplay}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on passenger type form group when passenger type not selected', () => {
            const errors = [{ id: '', errorMessage: 'You must select a product group ' }];

            const inputs = {
                id: 3,
                name: 'Product Group 1',
                productIds: ['1', '2'],
            };

            const tree = shallow(
                <ManageProductGroup
                    editMode={false}
                    csrf={''}
                    errors={errors}
                    inputs={inputs}
                    productsToDisplay={[...mockOtherProducts, ...mockPointToPointProducts]}
                    servicesToDisplay={mockServicesToDisplay}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on name form group when name input left blank', () => {
            const errors = [{ id: 'product-group-name', errorMessage: 'You must provide a product group name' }];

            const inputs = {
                id: 3,
                name: 'Product Group 1',
                productIds: ['1', '2'],
            };

            const tree = shallow(
                <ManageProductGroup
                    editMode={false}
                    csrf={''}
                    errors={errors}
                    inputs={inputs}
                    productsToDisplay={[...mockOtherProducts, ...mockPointToPointProducts]}
                    servicesToDisplay={mockServicesToDisplay}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render update product group button when in edit mode', () => {
            const inputs = {
                id: 3,
                name: 'Product Group 1',
                productIds: ['1', '2'],
            };

            const tree = shallow(
                <ManageProductGroup
                    editMode={false}
                    csrf={''}
                    errors={[]}
                    inputs={inputs}
                    productsToDisplay={[...mockOtherProducts, ...mockPointToPointProducts]}
                    servicesToDisplay={mockServicesToDisplay}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
