import React from 'react';
import { shallow } from 'enzyme';
import TapPricingRow from '../../src/components/TapPricingRow';

describe('tap pricing row', () => {
    it('renders correctly for a single row ', () => {
        const numberToRender = 1;
        const wrapper = shallow(<TapPricingRow numberOfTapsToDisplay={numberToRender} errors={[]} userInput={[]} />);
        expect(wrapper.find('.flex-container')).toHaveLength(numberToRender);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly for more than one row ', () => {
        const numberToRender = 5;
        const wrapper = shallow(<TapPricingRow numberOfTapsToDisplay={numberToRender} errors={[]} userInput={[]} />);
        expect(wrapper.find('.flex-container')).toHaveLength(numberToRender);
        expect(wrapper).toMatchSnapshot();
    });
});
