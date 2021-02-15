import * as React from 'react';
import { shallow } from 'enzyme';
import ResetPassword, { getServerSideProps } from '../../src/pages/resetPassword';
import { getMockContext } from '../testData/mockData';
import { USER_ATTRIBUTE } from '../../src/constants/attributes';

describe('resetPassword', () => {
    // gets the time value in seconds and adds one hour
    const expiryDate = Math.floor(new Date(2018, 12, 28).getTime() / 1000) + 3600;
    const mockErrors = [
        {
            errorMessage: 'Passwords do not match',
            id: 'password',
        },
    ];

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        const tree = shallow(
            <ResetPassword
                username="test@tfn.com"
                regKey="123456"
                expiry={expiryDate.toString()}
                csrfToken=""
                errors={[]}
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render error messaging when errors are passed', () => {
        const tree = shallow(
            <ResetPassword
                username="test@tfn.com"
                regKey="123456"
                expiry={expiryDate.toString()}
                csrfToken=""
                errors={mockErrors}
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    describe('getServerSideProps', () => {
        const writeHeadMock = jest.fn();
        // eslint-disable-next-line @typescript-eslint/camelcase
        const mockQueryParams = { key: 'thisisarandomkey', user_name: 'user@email.com', expiry: expiryDate.toString() };

        it('should return default props when the page is first visited with a valid link', () => {
            const ctx = getMockContext({
                query: mockQueryParams,
            });
            const expectedProps = {
                errors: [],
                regKey: 'thisisarandomkey',
                username: 'user@email.com',
                expiry: '1548637200',
                csrfToken: '',
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });

        it('should throw an error when a query string parameter is missing', () => {
            const ctx = getMockContext();
            expect(() => getServerSideProps(ctx)).toThrowError('Could not retrieve parameters from query string');
        });

        it('should redirect to /resetLinkExpired when the link has expired', () => {
            const mockExpiredDate = (expiryDate - 7200).toString();
            const ctx = getMockContext({
                query: { ...mockQueryParams, expiry: mockExpiredDate },
                mockWriteHeadFn: writeHeadMock,
            });
            getServerSideProps(ctx);
            expect(writeHeadMock).toHaveBeenCalledWith(302, { Location: '/resetLinkExpired' });
        });

        it('should return props with errors when the user enters invalid info', () => {
            const ctx = getMockContext({
                query: mockQueryParams,
                session: {
                    [USER_ATTRIBUTE]: {
                        errors: mockErrors,
                    },
                },
            });
            const expectedProps = {
                errors: mockErrors,
                regKey: 'thisisarandomkey',
                username: 'user@email.com',
                expiry: '1548637200',
                csrfToken: '',
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });
    });
});
