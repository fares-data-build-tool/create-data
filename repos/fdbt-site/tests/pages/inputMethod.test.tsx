import * as React from 'react';
import { shallow } from 'enzyme';
import InputMethod from '../../src/pages/inputMethod';

describe('pages', () => {
    describe('inputMethod', () => {
        it('should render correctly', () => {
            const tree = shallow(<InputMethod errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
