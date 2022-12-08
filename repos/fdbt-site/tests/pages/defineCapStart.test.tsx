import * as React from 'react';
import { shallow } from 'enzyme';
import DefineCapStart from '../../src/pages/defineCapStart';

describe('pages', () => {
    describe('defineCapStart', () => {
        it('should render correctly', () => {
            const tree = shallow(<DefineCapStart errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <DefineCapStart
                    errors={[
                        {
                            id: 'fixed-weekdays',
                            errorMessage: 'Choose an option regarding your cap ticket start',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
