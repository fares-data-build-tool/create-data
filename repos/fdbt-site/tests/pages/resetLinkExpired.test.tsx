import * as React from 'react';
import { shallow } from 'enzyme';
import ResetLinkExpired from '../../src/pages/resetLinkExpired';

describe('passwordUpdated', () => {
    it('should render correctly', () => {
        const tree = shallow(<ResetLinkExpired />);
        expect(tree).toMatchSnapshot();
    });
});
