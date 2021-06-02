import { shallow } from 'enzyme';
import React from 'react';
import Help from '../../src/components/Help';

describe('Help', () => {
    it('should render the Help component', () => {
        const wrapper = shallow(<Help />);
        expect(wrapper).toMatchSnapshot();
    });
});
