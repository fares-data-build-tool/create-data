import { shallow } from 'enzyme';
import React from 'react';
import DeleteSOPButton from '../../src/components/DeleteSOPButton';

describe('DeleteSOPButton', () => {
    it('should render the button', () => {
        const wrapper = shallow(<DeleteSOPButton sopId="1" csrfToken="token" />);
        expect(wrapper).toMatchSnapshot();
    });
});
