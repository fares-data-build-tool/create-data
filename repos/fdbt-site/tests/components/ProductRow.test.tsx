import React from 'react';
import { shallow } from 'enzyme';
import ProductRow from '../../src/components/ProductRow';

describe('product row', () => {
    it('renders the right amount of rows', () => {
        const wrapper = shallow(<ProductRow numberOfProductsToDisplay="2" errors={[]} userInput={[]} />);
        expect(wrapper.find('.flex-container')).toHaveLength(2);
    });
});
