import * as React from 'react';
import { shallow } from 'enzyme';
import Cookies, { CookiePreferencesProps, getServerSideProps } from '../../src/pages/cookies';
import { getMockContext } from '../testData/mockData';
import { CookiePolicy } from '../../src/interfaces';

describe('pages', () => {
    describe('cookies', () => {
        it("should render correctly with the tracking cookie selection radio defaulted to 'off'", () => {
            const tree = shallow(
                <Cookies settingsSaved={false} trackingDefaultValue="off" csrfToken="" pageProps={[]} />,
            );
            expect(tree).toMatchSnapshot();
            expect(tree.find('#accept-analytics-cookies').prop('defaultChecked')).toEqual(false);
            expect(tree.find('#decline-analytics-cookies').prop('defaultChecked')).toEqual(true);
        });

        it('should display a confirmation box when the user saves their preferences', () => {
            const tree = shallow(<Cookies settingsSaved trackingDefaultValue="off" csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it("should set the tracking cookie selection radio to 'on' when the user has just saved this as their preference", () => {
            const tree = shallow(<Cookies settingsSaved trackingDefaultValue="on" csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
            expect(tree.find('#accept-analytics-cookies').prop('defaultChecked')).toEqual(true);
            expect(tree.find('#decline-analytics-cookies').prop('defaultChecked')).toEqual(false);
        });
    });

    describe('getServerSideProps', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should return default props when a user first visits the page', () => {
            const ctx = getMockContext();
            const defaultProps: { props: CookiePreferencesProps } = {
                props: {
                    settingsSaved: false,
                    trackingDefaultValue: 'off',
                },
            };
            const props = getServerSideProps(ctx);
            expect(props).toEqual(defaultProps);
        });

        it('should return the expected props when a user saves their preferences to allow tracking', () => {
            const mockCookiePolicy: CookiePolicy = { essential: true, usage: true };
            const ctx = getMockContext({ cookies: { cookieSettingsSaved: 'true', cookiePolicy: mockCookiePolicy } });
            const expectedProps: { props: CookiePreferencesProps } = {
                props: {
                    settingsSaved: true,
                    trackingDefaultValue: 'on',
                },
            };
            const props = getServerSideProps(ctx);
            expect(props).toEqual(expectedProps);
        });
    });
});
