import * as React from 'react';
import { shallow } from 'enzyme';
import Changelog from '../../src/pages/changelog';

describe('changelog', () => {
    it('should render correctly', () => {
        const tree = shallow(<Changelog />);
        expect(tree).toMatchSnapshot();
    });
});
