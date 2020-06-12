import * as React from 'react';
import { shallow } from 'enzyme';
import FareType from '../../src/pages/fareType';

describe('pages', () => {
    const mockErrors = [{ errorMessage: 'Choose a fare type from the options', id: 'fare-type-error' }];

    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<FareType operator={' '} errors={[]} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed to the page', () => {
            const tree = shallow(<FareType operator={' '} errors={mockErrors} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
