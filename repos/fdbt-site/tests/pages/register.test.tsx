import * as React from 'react';
import { shallow } from 'enzyme';
import Register from '../../src/pages/register';

describe('pages', () => {
    describe('register', () => {
        it('should render correctly', () => {
            const tree = shallow(<Register regKey="abcdefg" errors={[]} csrfToken="" pageProps={[]} />);
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
                    pageProps={[]}
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
                            errorMessage: 'Enter valid nocCode',
                            id: 'nocCode',
                        },
                        { userInput: 'test@tfn.com', errorMessage: '', id: 'email' },
                    ]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
