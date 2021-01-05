import * as React from 'react';
import { shallow } from 'enzyme';
import Register, { getServerSideProps } from '../../src/pages/register';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    describe('register', () => {
        const mockErrors = [
            {
                errorMessage: 'Enter an email address in the correct format, like name@example.com',
                id: 'email',
                userInput: 'test@tfn.com',
            },
        ];

        it('should render correctly', () => {
            const tree = shallow(<Register regKey="abcdefg" errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render errors correctly', () => {
            const tree = shallow(<Register regKey="abcdefg" errors={mockErrors} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            const mockRegKey = 'thisisarandomquerystringkey';
            it('should return default props when the page is first visited', () => {
                const ctx = getMockContext({ query: { key: mockRegKey } });
                const expectedProps = { csrfToken: '', errors: [], regKey: mockRegKey };
                const actualProps = getServerSideProps(ctx);
                expect(actualProps.props).toEqual(expectedProps);
            });

            it('should return props containing errors when the user submits invalid info', () => {
                const ctx = getMockContext({
                    cookies: { userCookieValue: { inputChecks: mockErrors } },
                    query: { key: mockRegKey },
                });
                const expectedProps = { csrfToken: '', errors: mockErrors, regKey: mockRegKey };
                const actualProps = getServerSideProps(ctx);
                expect(actualProps.props).toEqual(expectedProps);
            });
        });
    });
});
