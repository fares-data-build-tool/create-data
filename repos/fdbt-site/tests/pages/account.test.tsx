import * as React from 'react';
import { shallow } from 'enzyme';
import AccountDetails, { getServerSideProps } from '../../src/pages/account';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    describe('account', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <AccountDetails emailAddress="joseppo.bloggo@somefakebuscompany.com" nocCode="FaBusCo" />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('throws an error if there is no ID_TOKEN cookie', () => {
            const ctx = getMockContext({ isLoggedin: false });

            expect(() => getServerSideProps(ctx)).toThrow('Necessary attributes not found to show account details');
        });

        it('throws an error when the user email address or noc code is missing from the ID_TOKEN cookie', () => {
            const ctx = getMockContext({
                cookies: {
                    idToken:
                        'eyJhbGciOiJIUzI1NiJ9.eyJjdXN0b206bm9jIjoiVEVTVCJ9.Hgdqdw7HX8cNT9NG7jcPP7ihZWHT1TYgPJyQNpKS8YQ',
                },
            });

            expect(() => getServerSideProps(ctx)).toThrow(
                'Could not extract the user email address and/or noc code from their ID token',
            );
        });
    });
});
