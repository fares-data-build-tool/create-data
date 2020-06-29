import * as React from 'react';
import { shallow } from 'enzyme';
import PasswordUpdated, { getServerSideProps } from '../../src/pages/passwordUpdated';
import { getMockContext } from '../testData/mockData';

describe('passwordUpdated', () => {
    it('should render correctly', () => {
        const redirectTo = '/';
        const tree = shallow(<PasswordUpdated redirectTo={redirectTo} />);
        expect(tree).toMatchSnapshot();
    });

    describe('getServerSideProps', () => {
        it.each([
            ['/login', '/resetPassword'],
            ['/account', '/changePassword'],
        ])("should return redirectTo as '%s' when the user has come from the '%s' page", (redirectTo, redirectFrom) => {
            const mockUserCookieValue = { redirectFrom };
            const ctx = getMockContext({ cookies: { userCookieValue: mockUserCookieValue } });
            const props = getServerSideProps(ctx);
            expect(props).toEqual({ props: { redirectTo } });
        });

        it("should return redirectTo as '/' when the USER_COOKIE is missing", () => {
            const ctx = getMockContext();
            const props = getServerSideProps(ctx);
            expect(props).toEqual({ props: { redirectTo: '/account' } });
        });
    });
});
