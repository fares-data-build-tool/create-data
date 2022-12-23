import { shallow } from 'enzyme';
import React from 'react';
import EditPeriodDuration from '../../src/pages/editPeriodDuration';

describe('pages', () => {
    describe('editPeriodDuration', () => {
        it('should render editPeriodDuration page correctly', () => {
            const wrapper = shallow(
                <EditPeriodDuration
                    errors={[]}
                    csrfToken=""
                    productDurationValue="1"
                    productDurationUnit="week"
                    backHref=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
        it('should render editPeriodDuration page correctly with an error', () => {
            const wrapper = shallow(
                <EditPeriodDuration
                    errors={[{ id: 'edit-period-duration-quantity', errorMessage: 'Product duration cannot be empty' }]}
                    csrfToken=""
                    productDurationValue=""
                    productDurationUnit="week"
                    backHref=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
