import * as React from 'react';
import { shallow } from 'enzyme';
import Header from '../../src/layout/Header';

describe('Header', () => {
    it('should render correctly', () => {
        const tree = shallow(<Header isAuthed csrfToken="" />);
        expect(tree).toMatchSnapshot();
    });

    it('expect title_link to be root', () => {
        const tree = shallow(<Header isAuthed csrfToken="" />);
        expect(tree.find('#title_link').prop('href')).toEqual('/');
    });
});
