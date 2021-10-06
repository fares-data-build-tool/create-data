import * as React from 'react';
import { shallow } from 'enzyme';
import ManagePurchaseMethod from '../../src/pages/managePurchaseMethod';

describe('pages', () => {
    describe('manage purchase method', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ManagePurchaseMethod csrfToken={''} errors={[]} inputs={undefined} editMode={false} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly in edit mode', () => {
            const inputs = {
                id: 0,
                name: 'test',
                ticketFormats: ['blah'],
                paymentMethods: ['blob'],
                purchaseLocations: ['baz'],
            };

            const tree = shallow(<ManagePurchaseMethod csrfToken={''} errors={[]} inputs={inputs} editMode />);

            expect(tree).toMatchSnapshot();
        });

        it('should render error state on purchase method form group when error', () => {
            const errors = [{ id: 'purchase-method-name', errorMessage: 'You must select at least one day.' }];

            const inputs = {
                id: 0,
                name: 'test',
                ticketFormats: ['blah'],
                paymentMethods: ['blob'],
                purchaseLocations: ['baz'],
            };

            const tree = shallow(<ManagePurchaseMethod csrfToken={''} errors={errors} inputs={inputs} editMode />);

            expect(tree).toMatchSnapshot();
        });
    });
});
