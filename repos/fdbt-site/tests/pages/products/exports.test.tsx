import * as React from 'react';
import { shallow } from 'enzyme';
import Exports from '../../../src/pages/products/exports';

describe('pages', () => {
    describe('confirmRegistration', () => {
        it('should render correctly without data', () => {
            const tree = shallow(
                <Exports csrf={''} myFaresEnabled={true} exportEnabled={true} operatorHasProducts={true} />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
