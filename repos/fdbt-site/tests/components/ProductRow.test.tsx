import React from 'react';
import { shallow } from 'enzyme';
import ProductRow from '../../src/components/ProductRow';
import { multipleProducts } from '../testData/mockData';

describe('product row', () => {
    it('renders the right amount of rows', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="2" errors={[]} userInput={[]} />);
        expect(wrapper.find('.flex-container')).toHaveLength(2);
    });

    it('populates the default product name if entry present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="3" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-name-0').props().defaultValue).toBe(multipleProducts[0].productName);
    });

    it('leaves the product name field blank if entry not present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="4" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-name-3').props().defaultValue).toBe('');
    });

    it('populates the default product price if entry present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="3" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-price-0').props().defaultValue).toBe(multipleProducts[0].productPrice);
    });

    it('leaves the product price field blank if entry not present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="4" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-price-3').props().defaultValue).toBe('');
    });

    it('populates the default product duration if entry present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="3" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-duration-0').props().defaultValue).toBe(
            multipleProducts[0].productDuration,
        );
    });

    it('leaves the product duration field blank if entry not present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="4" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-duration-3').props().defaultValue).toBe('');
    });

    it('populates the default product duration units if entry present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="3" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-duration-units-0').props().defaultValue).toBe(
            multipleProducts[0].productDurationUnits,
        );
    });

    it('leaves the product duration units field blank if entry not present in userInput', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="4" errors={[]} userInput={multipleProducts} />);
        expect(wrapper.find('#multiple-product-duration-units-3').props().defaultValue).toBe('');
    });
});
