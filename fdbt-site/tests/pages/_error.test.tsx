import * as React from 'react';
import { shallow } from 'enzyme';
import Error from '../../src/pages/_error';

describe('pages', () => {
    describe('operator', () => {
        it('should render correctly', () => {
            const tree = shallow(<Error />);
            expect(tree).toMatchSnapshot();
        });
    });
});
