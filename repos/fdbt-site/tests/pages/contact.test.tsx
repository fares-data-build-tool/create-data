import * as React from 'react';
import { shallow } from 'enzyme';
import Contact from '../../src/pages/contact';

describe('contact', () => {
    it('should render correctly', () => {
        const tree = shallow(<Contact supportEmail="mock-support-address@email.co.uk" supportPhone="0800 123 1234" />);
        expect(tree).toMatchSnapshot();
    });
});
