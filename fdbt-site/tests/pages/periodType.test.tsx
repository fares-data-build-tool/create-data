import * as React from 'react';
import { shallow } from 'enzyme';
import PeriodType from '../../src/pages/periodType';

describe('pages', () => {
    describe('periodtype', () => {
        it('should render correctly', () => {
            const tree = shallow(<PeriodType errors={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <PeriodType
                    errors={[
                        {
                            errorMessage: 'Choose an option regarding your period ticket type',
                            id: 'period-type-error',
                        },
                    ]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
