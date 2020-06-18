import * as React from 'react';
import { shallow } from 'enzyme';
import Contact from '../../src/pages/contact';

describe('contact', () => {
    it('should render correctly', () => {
        const tree = shallow(<Contact />);
        expect(tree).toMatchSnapshot();
    });
});
