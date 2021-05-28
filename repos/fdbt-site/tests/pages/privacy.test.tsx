import * as React from 'react';
import { shallow } from 'enzyme';
import Privacy from '../../src/pages/privacy';

describe('pages', () => {
    describe('privacy', () => {
        it('should render privacy page correctly', () => {
            const tree = shallow(<Privacy />);
            expect(tree).toMatchSnapshot();
        });
    });
});
