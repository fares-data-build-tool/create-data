import * as React from 'react';
import { shallow } from 'enzyme';
import TableForm from '../../src/components/TableForm';

describe('TableForm', () => {
    it('should render correctly', () => {
        const tree = shallow(<TableForm offset={1} />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with 10 rows when offset is 0', () => {
        const tree = shallow(<TableForm offset={0} />);
        const rows = tree.find('#table_form_body').children();
        expect(rows.length).toEqual(10);
    });

    it('should render with 11 rows when offset is 1', () => {
        const tree = shallow(<TableForm offset={1} />);
        const rows = tree.find('#table_form_body').children();
        expect(rows.length).toEqual(11);
    });

    it('should render with 9 rows when offset is -1', () => {
        const tree = shallow(<TableForm offset={-1} />);
        const rows = tree.find('#table_form_body').children();
        expect(rows.length).toEqual(9);
    });
});
