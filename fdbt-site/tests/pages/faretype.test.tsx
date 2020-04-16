import * as React from 'react';
import { shallow } from 'enzyme';
// eslint-disable-next-line import/no-unresolved
import FareType from '../../src/pages/fareType';

describe('pages', () => {
    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<FareType errors={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
