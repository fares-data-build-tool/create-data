import * as React from 'react';
import { shallow } from 'enzyme';
import Operator from '../../src/pages/operator';

describe('pages', () => {
    describe('operator', () => {
        it('should render correctly', () => {
            const tree = shallow(<Operator errors={[]} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
