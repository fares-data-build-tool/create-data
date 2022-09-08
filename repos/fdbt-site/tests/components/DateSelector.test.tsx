import { shallow } from 'enzyme';
import React from 'react';
import DateSelector from '../../src/components/DateSelector';

describe('DateSelector', () => {
    it('should render the start DateSelector component empty', () => {
        const wrapper = shallow(<DateSelector startOrEnd="start" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the end DateSelector component empty', () => {
        const wrapper = shallow(<DateSelector startOrEnd="end" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the DateSelector component with errors', () => {
        const wrapper = shallow(
            <DateSelector
                startOrEnd="start"
                errors={[{ errorMessage: 'Start date must be a real date', id: 'start-day-input' }]}
                inputs={{
                    dayInput: 'first',
                    monthInput: 'august',
                    yearInput: '2020',
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the DateSelector component with valid inputs', () => {
        const wrapper = shallow(
            <DateSelector
                startOrEnd="start"
                errors={[]}
                inputs={{
                    dayInput: '01',
                    monthInput: '01',
                    yearInput: '2020',
                }}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
