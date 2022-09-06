import * as React from 'react';
import { shallow } from 'enzyme';
import Cookies from 'universal-cookie';
import CookieBanner from '../../src/layout/CookieBanner';

describe('CookieBanner', () => {
    Cookies.prototype.set = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        const tree = shallow(<CookieBanner />);
        expect(tree).toMatchSnapshot();
    });
});
