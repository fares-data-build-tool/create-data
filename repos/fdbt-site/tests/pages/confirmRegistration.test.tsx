import * as React from 'react';
import { shallow } from 'enzyme';
import ConfirmRegistration from '../../src/pages/confirmRegistration';

describe('pages', () => {
    describe('confirmRegistration', () => {
        it('should render correctly with no tndsless nocs', () => {
            const tree = shallow(<ConfirmRegistration tndslessNocs={[]} />);
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with tndsless nocs', () => {
            const tree = shallow(<ConfirmRegistration tndslessNocs={['AAAA', 'ZZZZ']} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
