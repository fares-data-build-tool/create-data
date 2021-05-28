import * as React from 'react';
import { shallow } from 'enzyme';
import NoServices from '../../src/pages/noServices';

describe('pages', () => {
    describe('noServices', () => {
        it('should render correctly', () => {
            const tree = shallow(<NoServices />);
            expect(tree).toMatchSnapshot();
        });
    });
});
