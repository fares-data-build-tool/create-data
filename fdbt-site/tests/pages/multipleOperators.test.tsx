import * as React from 'react';
import { shallow } from 'enzyme';
import MultipleOperators from '../../src/pages/multipleOperators';

describe('pages', () => {
    describe('multipleOperators', () => {
        it('should render correctly with one operator NOC pair', () => {
            const tree = shallow(
                <MultipleOperators
                    errors={[]}
                    operatorsAndNocs={[{ name: 'test', nocCode: 'testNoc' }]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with multiple operator NOC pairs', () => {
            const tree = shallow(
                <MultipleOperators
                    errors={[]}
                    operatorsAndNocs={[
                        { name: 'test', nocCode: 'testNoc' },
                        { name: 'test2', nocCode: 'testNoc2' },
                        { name: 'test3', nocCode: 'testNoc3' },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
