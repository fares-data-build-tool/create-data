import React from 'react';
import { shallow } from 'enzyme';
import FareTypeRadios from '../../src/components/FareTypeRadios';

describe('FareTypeRadios', () => {
    const mockFareProps = {
        fares: [
            {
                fareType: 'single',
                label: 'Single ticket',
                hint: 'A ticket for a point to point journey',
            },
            {
                fareType: 'return',
                label: 'Return ticket',
                hint: 'An inbound and outbound ticket for the same service',
            },
            {
                fareType: 'flatFare',
                label: 'Flat fare ticket',
                hint: 'A fixed fee ticket for a single journey',
            },
            {
                fareType: 'period',
                label: 'Period ticket',
                hint: 'A ticket valid for a number of days, weeks, months or years',
            },
            {
                fareType: 'carnet',
                label: 'Carnet ticket',
                hint: 'A bundle of pre-paid tickets',
            },
            {
                fareType: 'multiOperator',
                label: 'Multi-operator',
                hint: 'A ticket that covers more than one operator',
            },
            {
                fareType: 'schoolService',
                label: 'School service',
                hint: 'A ticket available to pupils in full-time education',
            },
        ],
    };

    it('should render a set of radio buttons the fares provided', () => {
        const wrapper = shallow(<FareTypeRadios fares={mockFareProps.fares} />);
        expect(wrapper).toMatchSnapshot();
    });
});
