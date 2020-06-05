import * as React from 'react';
import { shallow } from 'enzyme';
import Login from '../../src/pages/login';

describe('pages', () => {
    describe('login', () => {
        it('should render correctly', () => {
            const tree = shallow(<Login errors={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <Login
                    errors={[
                        {
                            errorMessage: 'Enter an email address in the correct format, like name@example.com',
                            id: 'email',
                        },
                    ]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
