import * as React from 'react';
import { shallow } from 'enzyme';
import InputMethod from '../../src/pages/inputMethod';

describe('pages', () => {
    describe('csvUpload', () => {
        it('should render correctly', () => {
            const tree = shallow(<InputMethod />);
            expect(tree).toMatchSnapshot();
        });
    });
});
