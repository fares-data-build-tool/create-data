import { shallow } from 'enzyme';
import React from 'react';
import ExpirySelector from '../../src/components/ExpirySelector';

describe('ExpirySelector', () => {
    it('should render the selector for a non-carnet', () => {
        const wrapper = shallow(
            <ExpirySelector
                quantityId="test-quantity-id"
                unitId="test-unit-id"
                unitName="testUnitName"
                quantityName="testQuantityName"
                hideFormGroupError={false}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the selector for a carnet', () => {
        const wrapper = shallow(
            <ExpirySelector
                quantityId="test-quantity-id"
                unitId="test-unit-id"
                unitName="testUnitName"
                quantityName="testQuantityName"
                carnet
                hideFormGroupError={false}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the selector for a school ticket', () => {
        const wrapper = shallow(
            <ExpirySelector
                quantityId="test-quantity-id"
                unitId="test-unit-id"
                unitName="testUnitName"
                quantityName="testQuantityName"
                carnet={false}
                school
                hideFormGroupError={false}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
