import * as React from 'react';
import { shallow } from 'enzyme';
import Home from '../../src/pages/home';

describe('pages', () => {
    describe('home page', () => {
        it('should render correctly', () => {
            const tree = shallow(<Home multipleOperators csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with no multiple operators', () => {
            const tree = shallow(<Home multipleOperators={false} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
