import * as React from 'react';
import { shallow } from 'enzyme';
import Exports from '../../../src/pages/products/exports';

describe('pages', () => {
    describe('exports', () => {
        it('should render correctly without data when operator has no products', () => {
            const tree = shallow(<Exports csrf={''} operatorHasProducts={false} initialExportIsInProgress={false} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render the export button correctly when operator has products', () => {
            const tree = shallow(<Exports csrf={''} operatorHasProducts={true} initialExportIsInProgress={false} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render the export button correctly when operator has products and an export is in progress', () => {
            const tree = shallow(<Exports csrf={''} operatorHasProducts={true} initialExportIsInProgress />);
            expect(tree).toMatchSnapshot();
        });
    });
});
