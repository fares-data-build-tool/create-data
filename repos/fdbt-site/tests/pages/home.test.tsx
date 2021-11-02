import * as React from 'react';
import { shallow } from 'enzyme';
import Home from '../../src/pages/home';

describe('pages', () => {
    describe('home page', () => {
        it('should render correctly', () => {
            const tree = shallow(<Home />);
            expect(tree).toMatchSnapshot();
        });
    });
});
