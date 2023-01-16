import * as React from 'react';
import { shallow } from 'enzyme';
import NoServices from '../../src/pages/noServices';

describe('pages', () => {
    describe('noServices', () => {
        it('should render correctly', () => {
            const tree = shallow(<NoServices dataSource="bods" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for tnds datasource', () => {
            const tree = shallow(<NoServices dataSource="tnds" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
