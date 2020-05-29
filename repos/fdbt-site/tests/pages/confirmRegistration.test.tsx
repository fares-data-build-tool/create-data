import * as React from 'react';
import { shallow } from 'enzyme';
import ConfirmRegistration from '../../src/pages/confirmRegistration';

describe('pages', () => {
    describe('confirmRegistration', () => {
        it('should render correctly', () => {
            const tree = shallow(<ConfirmRegistration />);
            expect(tree).toMatchSnapshot();
        });
    });
});
