import * as React from 'react';
import { shallow } from 'enzyme';
import CookieDetails from '../../src/pages/cookieDetails';

describe('pages', () => {
    describe('cookieDetails', () => {
        it('should render correctly', () => {
            const tree = shallow(<CookieDetails />);
            expect(tree).toMatchSnapshot();
        });
    });
});
