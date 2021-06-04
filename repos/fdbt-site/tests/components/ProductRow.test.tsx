import React from 'react';
import { shallow } from 'enzyme';
import ProductRow from '../../src/components/ProductRow';

describe('product row', () => {
    it('renders the right amount of rows for a flatfare carnet', () => {
        const numberToRender = 2;
        const wrapper = shallow(
            <ProductRow numberOfProductsToDisplay={numberToRender} errors={[]} userInput={[]} flatFare carnet />,
        );
        expect(wrapper.find('.flex-container')).toHaveLength(numberToRender);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders the right amount of rows for a period carnet', () => {
        const numberToRender = 1;
        const wrapper = shallow(
            <ProductRow
                numberOfProductsToDisplay={numberToRender}
                errors={[]}
                userInput={[]}
                flatFare={false}
                carnet
            />,
        );
        expect(wrapper.find('.flex-container')).toHaveLength(numberToRender);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders the right amount of rows for a period ticket', () => {
        const numberToRender = 4;
        const wrapper = shallow(
            <ProductRow
                numberOfProductsToDisplay={numberToRender}
                errors={[]}
                userInput={[]}
                flatFare={false}
                carnet={false}
            />,
        );
        expect(wrapper.find('.flex-container')).toHaveLength(numberToRender);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders the right amount of rows for a flatFare ticket', () => {
        const numberToRender = 3;
        const wrapper = shallow(
            <ProductRow
                numberOfProductsToDisplay={numberToRender}
                errors={[]}
                userInput={[]}
                flatFare
                carnet={false}
            />,
        );
        expect(wrapper.find('.flex-container')).toHaveLength(numberToRender);
        expect(wrapper).toMatchSnapshot();
    });
});
