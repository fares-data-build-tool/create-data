import * as React from 'react';
import { shallow } from 'enzyme';
import Register from '../../src/pages/register';

describe('pages', () => {
    describe('register', () => {
        it('should render correctly', () => {
            const tree = shallow(<Register regKey="abcdefg" errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <Register
                    regKey="abcdefg"
                    errors={[
                        {
                            errorMessage: 'Enter an email address in the correct format, like name@example.com',
                            id: 'email',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should store email if entered correctly but other fields fail validation', () => {
            const tree = shallow(
                <Register
                    regKey="abcdefg"
                    errors={[
                        {
                            errorMessage: 'Password must be at least 8 characters long',
                            id: 'password',
                        },
                        { userInput: 'test@tfn.com', errorMessage: '', id: 'email' },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
