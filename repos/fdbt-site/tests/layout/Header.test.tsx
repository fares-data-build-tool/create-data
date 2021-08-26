import * as React from 'react';
import { shallow } from 'enzyme';
import Header from '../../src/layout/Header';

describe('Header', () => {
    it('should render correctly', () => {
        const tree = shallow(<Header isAuthed csrfToken="" noc={undefined} multiOperator={false} />);
        expect(tree).toMatchSnapshot();
    });

    it('expect title_link to be root', () => {
        const tree = shallow(<Header isAuthed csrfToken="" noc={'HELLO'} multiOperator />);
        expect(tree.find('#title-link').prop('href')).toEqual('/home');
    });
});
