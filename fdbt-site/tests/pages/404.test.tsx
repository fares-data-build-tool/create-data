import * as React from 'react';
import { shallow } from 'enzyme';
import PageNotFound from '../../src/pages/404';

describe('pages', () => {
    describe('404', () => {
        it('should render 404 page correctly', () => {
            const tree = shallow(<PageNotFound />);
            expect(tree).toMatchSnapshot();
        });
    });
});
