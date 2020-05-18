/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import PeriodValidity from '../../src/pages/periodValidity';

describe('pages', () => {
    describe('periodValidity', () => {
        it('should render correctly', () => {
            const tree = shallow(<PeriodValidity errors={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <PeriodValidity
                    errors={[
                        {
                            errorMessage: 'Choose an option regarding your period ticket validity',
                            id: 'period-validity-error',
                        },
                    ]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
