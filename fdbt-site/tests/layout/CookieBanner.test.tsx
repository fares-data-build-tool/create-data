import * as React from 'react';
import { shallow } from 'enzyme';
import CookieBanner from '../../src/layout/CookieBanner';

describe('CookieBanner', () => {
    it('should render correctly', () => {
        const tree = shallow(<CookieBanner />);
        expect(tree).toMatchSnapshot();
    });

    it('should have the cookie banner button linking to the cookie preferences page', () => {
        const tree = shallow(<CookieBanner />);
        expect(tree.find('#set-cookie-preferences-link').prop('href')).toEqual('/cookies');
    });
});
