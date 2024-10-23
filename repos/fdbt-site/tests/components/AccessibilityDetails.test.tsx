import { shallow } from 'enzyme';
import React from 'react';
import AccessibilityDetails from '../../src/components/AccessibilityDetails';

describe('AccessibilityDetails', () => {
    it('should render the AccessibilityDetails component', () => {
        const wrapper = shallow(<AccessibilityDetails supportEmail="test@gmail.com" />);
        expect(wrapper).toMatchSnapshot();
    });
});
