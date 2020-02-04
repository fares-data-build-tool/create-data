import * as React from 'react';
import { shallow } from 'enzyme';
import Confirmation from '../../src/pages/confirmation';

describe('pages', () => {
    describe('confirmation', () => {
        it('should render correctly', () => {
            const tree = shallow(<Confirmation operator="operator" service="service" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
