import * as React from 'react';
import { shallow } from 'enzyme';
import Error from '../../src/pages/_error';

describe('pages', () => {
    describe('error page', () => {
        it('should render error page correctly', () => {
            const tree = shallow(<Error />);
            expect(tree).toMatchSnapshot();
        });
    });
});
