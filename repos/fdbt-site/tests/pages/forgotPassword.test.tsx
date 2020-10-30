import * as React from 'react';
import { shallow } from 'enzyme';
import ForgotPassword from '../../src/pages/forgotPassword';

describe('pages', () => {
    const mockErrors = [{ errorMessage: 'Choose a fare type from the options', id: 'fare-type-error' }];

    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<ForgotPassword email="" errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed to the page', () => {
            const tree = shallow(<ForgotPassword email="" errors={mockErrors} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
