import * as React from 'react';
import { shallow } from 'enzyme';
import Home from '../../src/pages/home';

describe('pages', () => {
    describe('home page', () => {
        it('should render correctly', () => {
            const tree = shallow(<Home myFaresEnabled={false} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with my fares enabled', () => {
            const tree = shallow(<Home myFaresEnabled={true} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
