import * as React from 'react';
import { shallow } from 'enzyme';
import PasswordUpdated, { getServerSideProps } from '../../src/pages/passwordUpdated';
import { getMockContext } from '../testData/mockData';
import { USER_ATTRIBUTE } from '../../src/constants/attributes';

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
            const mockUserAttributeValue = { redirectFrom };
            const ctx = getMockContext({ session: { [USER_ATTRIBUTE]: mockUserAttributeValue } });
            const props = getServerSideProps(ctx);
            expect(props).toEqual({ props: { redirectTo } });
        });

        it("should return redirectTo as '/' when the USER_ATTRIBUTE is missing", () => {
            const ctx = getMockContext();
            const props = getServerSideProps(ctx);
            expect(props).toEqual({ props: { redirectTo: '/account' } });
        });
    });
});
