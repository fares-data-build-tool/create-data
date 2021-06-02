import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Cookies from 'universal-cookie';
import CookieBanner from '../../src/layout/CookieBanner';
import { COOKIES_POLICY_COOKIE, COOKIE_PREFERENCES_COOKIE } from '../../src/constants';

describe('CookieBanner', () => {
    Cookies.prototype.set = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        const tree = shallow(<CookieBanner />);
        expect(tree).toMatchSnapshot();
    });

    it('sets necessary cookies when clicking Accept All', async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const wrapper = await mount(<CookieBanner />);
        wrapper.update();

        wrapper.find('#accept-all-button').simulate('click');

        expect(Cookies.prototype.set).toHaveBeenNthCalledWith(1, COOKIE_PREFERENCES_COOKIE, 'true', {
            maxAge: 31556952,
            path: '/',
            sameSite: 'strict',
            secure: true,
        });
        expect(Cookies.prototype.set).toHaveBeenNthCalledWith(
            2,
            COOKIES_POLICY_COOKIE,
            '{"essential":true,"usage":true}',
            { maxAge: 31556952, path: '/', sameSite: 'strict', secure: true },
        );
    });

    it('displays confirmation banner after clicking Accept All', async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const wrapper = await mount(<CookieBanner />);
        wrapper.update();

        wrapper.find('#accept-all-button').simulate('click');

        expect(wrapper.find('#cookies-accepted-message')).toHaveLength(1);
    });
});
