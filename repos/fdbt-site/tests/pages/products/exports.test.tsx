import * as React from 'react';
import { shallow } from 'enzyme';
import Exports from '../../../src/pages/products/exports';

describe('pages', () => {
    describe('confirmRegistration', () => {
        it('should render correctly without data when operator has no products', () => {
            const tree = shallow(<Exports csrf={''} exportEnabled={true} operatorHasProducts={false} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render the export button correctly when operator has products', () => {
            const tree = shallow(<Exports csrf={''} exportEnabled={true} operatorHasProducts={true} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
