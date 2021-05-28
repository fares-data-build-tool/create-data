import * as React from 'react';
import { shallow } from 'enzyme';
import Footer from '../../src/layout/Footer';

describe('Footer', () => {
    it('should render correctly', () => {
        const tree = shallow(<Footer />);
        expect(tree).toMatchSnapshot();
    });
});
