import { shallow } from 'enzyme';
import React from 'react';
import LoadingSpinner from '../../src/components/LoadingSpinner';

describe('LoadingSpinner', () => {
    it('should render the loading spinner', () => {
        const wrapper = shallow(<LoadingSpinner />);
        expect(wrapper).toMatchSnapshot();
    });
});
