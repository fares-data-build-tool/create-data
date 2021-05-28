import * as React from 'react';
import { shallow } from 'enzyme';
import RequestAccess from '../../src/pages/requestAccess';

describe('pages', () => {
    describe('requestAccess', () => {
        it('should render correctly', () => {
            const tree = shallow(<RequestAccess />);
            expect(tree).toMatchSnapshot();
        });
    });
});
