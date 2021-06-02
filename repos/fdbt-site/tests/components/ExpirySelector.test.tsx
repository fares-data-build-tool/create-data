import { shallow } from 'enzyme';
import React from 'react';
import ExpirySelector from '../../src/components/ExpirySelector';

describe('ExpirySelector', () => {
    it('should render the selector', () => {
        const wrapper = shallow(
            <ExpirySelector
                quantityId="test-quantity-id"
                unitId="test-unit-id"
                unitName="testUnitName"
                quantityName="testQuantityName"
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
