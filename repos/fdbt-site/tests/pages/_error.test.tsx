import * as React from 'react';
import { shallow } from 'enzyme';
import Error from '../../src/pages/_error';

describe('pages', () => {
    describe('operator', () => {
        it('should render error page correctly', () => {
            const tree = shallow(<Error statusCode={500} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render 404 page correctly', () => {
            const tree = shallow(<Error statusCode={404} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
