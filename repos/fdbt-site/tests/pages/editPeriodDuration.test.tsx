import { shallow } from 'enzyme';
import React from 'react';
import EditPeriodDuration from '../../src/pages/editPeriodDuration';

describe('pages', () => {
    describe('editPeriodDuration', () => {
        it('should render editPeriodDuration page correctly', () => {
            const wrapper = shallow(
                <EditPeriodDuration errors={[]} csrfToken="" productDurationValue="1" productDurationUnit="week" />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
