/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import FareType from '../../src/pages/faretype';

describe('pages', () => {
    describe('faretype', () => {
        it('should render correctly', () => {
            const tree = shallow(<FareType />);
            expect(tree).toMatchSnapshot();
        });
    });
});
