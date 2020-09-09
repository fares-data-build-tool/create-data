import * as React from 'react';
import { mount, shallow } from 'enzyme';
import Contact from '../../src/pages/contact';

describe('contact', () => {
    it('should render correctly', () => {
        const tree = shallow(<Contact />);
        expect(tree).toMatchSnapshot();
    });

    it('should not render the help text on the page', () => {
        const wrapper = mount(<Contact />);
        expect(wrapper.find('.govuk-link')).toHaveLength(0);
    });
});
