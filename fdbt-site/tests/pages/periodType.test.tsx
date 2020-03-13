/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import PeriodType from '../../src/pages/periodType';

describe('pages', () => {
    describe('periodtype', () => {
        it('should render correctly', () => {
            const tree = shallow(<PeriodType error={false} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
