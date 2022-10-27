import * as React from 'react';
import { shallow } from 'enzyme';
import Exports, { exportStartedOverAnHourAgo } from '../../../src/pages/products/exports';

describe('pages', () => {
    describe('exports', () => {
        it('should render correctly without data when operator has no products', () => {
            const tree = shallow(<Exports csrf={''} operatorHasProducts={false} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render the export button correctly when operator has products', () => {
            const tree = shallow(<Exports csrf={''} operatorHasProducts={true} />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('exportStartedOverAnHourAgo', () => {
        it('returns true if the export started over an hour ago', () => {
            const testExport = {
                name: 'test',
                matchingDataCount: 2,
                netexCount: 3,
                exportStarted: new Date('2022-06-17T03:24:00'),
            };
            const result = exportStartedOverAnHourAgo(testExport);

            expect(result).toBeTruthy();
        });

        it('returns false if the export started less than an hour ago', () => {
            const testExport = {
                name: 'test',
                matchingDataCount: 2,
                netexCount: 3,
                exportStarted: new Date(),
            };
            const result = exportStartedOverAnHourAgo(testExport);

            expect(result).toBeFalsy();
        });
    });
});
