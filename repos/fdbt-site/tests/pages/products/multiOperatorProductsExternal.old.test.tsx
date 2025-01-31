import React from 'react';
import { shallow } from 'enzyme';
import MultiOperatorProducts, {
    MultiOperatorProductsProps,
} from '../../../src/pages/products/multiOperatorProductsExternal';
import DeleteConfirmationPopup from '../../../src/components/DeleteConfirmationPopup';

describe('MultiOperatorProductsExternal', () => {
    const ownedProducts = [
        {
            id: 1,
            actionRequired: false,
            productDescription: 'Product 1',
            duration: '1 month',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            passengerType: 'adult',
        },
    ];

    const sharedProducts = [
        {
            id: 2,
            actionRequired: true,
            productDescription: 'Product 2',
            duration: '1 week',
            startDate: '2023-02-01',
            endDate: '2023-02-07',
            passengerType: 'child',
        },
    ];

    const csrfToken = 'test-csrf-token';

    const defaultProps: MultiOperatorProductsProps = {
        ownedProducts,
        sharedProducts,
        csrfToken,
    };

    it('renders correctly', () => {
        const wrapper = shallow(<MultiOperatorProducts {...defaultProps} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('displays owned products', () => {
        const wrapper = shallow(<MultiOperatorProducts {...defaultProps} />);
        expect(wrapper.find('#fares-you-own').exists()).toBe(true);
        expect(wrapper.find('#fares-you-own').find('tbody tr').length).toBe(ownedProducts.length);
    });

    it('displays shared products', () => {
        const wrapper = shallow(<MultiOperatorProducts {...defaultProps} />);
        expect(wrapper.find('#fares-awaiting-your-input').exists()).toBe(true);
        expect(wrapper.find('#fares-awaiting-your-input').find('tbody tr').length).toBe(sharedProducts.length);
    });

    it('opens delete confirmation popup when delete button is clicked', () => {
        const wrapper = shallow(<MultiOperatorProducts {...defaultProps} />);
        wrapper.find('#delete-0').simulate('click');
        expect(wrapper.find(DeleteConfirmationPopup).prop('isOpen')).toBe(true);
    });

    it('renders correctly when there are no products', () => {
        const propsWithNoProducts: MultiOperatorProductsProps = {
            ownedProducts: [],
            sharedProducts: [],
            csrfToken,
        };
        const wrapper = shallow(<MultiOperatorProducts {...propsWithNoProducts} />);
        expect(wrapper.find('#fares-you-own').find('tbody tr').length).toBe(0);
        expect(wrapper.find('#fares-awaiting-your-input').find('tbody tr').length).toBe(0);
    });
});
