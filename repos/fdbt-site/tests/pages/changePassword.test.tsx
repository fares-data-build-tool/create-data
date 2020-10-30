import * as React from 'react';
import { shallow } from 'enzyme';
import { getMockContext } from '../testData/mockData';
import ChangePassword, { getServerSideProps } from '../../src/pages/changePassword';

describe('changePassword', () => {
    it('should render correctly', () => {
        const tree = shallow(<ChangePassword csrfToken="" errors={[]} />);
        expect(tree).toMatchSnapshot();
    });

    it('should render error messaging when errors are passed', () => {
        const tree = shallow(
            <ChangePassword
                csrfToken=""
                errors={[
                    {
                        errorMessage: 'Passwords do not match',
                        id: 'password',
                    },
                ]}
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    describe('getServerSideProps', () => {
        it('should return props containing no errors when the USER_COOKIE is missing (i.e. no errors are present)', () => {
            const ctx = getMockContext();
            const res = getServerSideProps(ctx);
            expect(res).toEqual({ props: { errors: [], csrfToken: '' } });
        });

        it('should return props containing errors when errors are present', () => {
            const mockError = {
                id: 'old-password',
                errorMessage: 'Your old password is incorrect.',
            };
            const mockUserCookieValue = {
                inputChecks: [mockError],
            };
            const ctx = getMockContext({ cookies: { userCookieValue: mockUserCookieValue } });
            const res = getServerSideProps(ctx);
            expect(res).toEqual({ props: { errors: [mockError], csrfToken: '' } });
        });
    });
});
