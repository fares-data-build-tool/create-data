import React from 'react';
import { shallow } from 'enzyme';
import { FareTypeRadioProps } from '../../src/interfaces';
import FareTypeRadios from '../../src/components/FareTypeRadios';

describe('FareTypeRadios', () => {
    const mockStandardFaresRadioProps = {
        standardFares: [
            {
                fareType: 'single',
                label: 'Single Ticket - Point to Point',
            },
            {
                fareType: 'period',
                label: 'Period Ticket (Day, Week, Month and Annual)',
            },
            {
                fareType: 'return',
                label: 'Return Ticket - Single Service',
            },
            {
                fareType: 'flatFare',
                label: 'Flat Fare Ticket - Single Journey',
            },
        ],
        otherFares: [],
    };

    const mockOtherFaresRadioProps = {
        otherFares: [
            {
                fareType: 'multiOperator',
                label: 'Multi-operator - A ticket that covers more than one operator',
            },
            {
                fareType: 'schoolService',
                label: 'School Service - A ticket available to pupils in full-time education',
            },
        ],
    };

    it('should render a set of radio buttons with standard fares and other fares separated under their respective headings', () => {
        const mockProps: FareTypeRadioProps = { ...mockStandardFaresRadioProps, ...mockOtherFaresRadioProps };
        const wrapper = shallow(
            <FareTypeRadios standardFares={mockProps.standardFares} otherFares={mockProps.otherFares} />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a set of radio buttons for just standard fares when no other fares are provided', () => {
        const mockProps: FareTypeRadioProps = { ...mockStandardFaresRadioProps };
        const wrapper = shallow(<FareTypeRadios standardFares={mockProps.standardFares} otherFares={[]} />);
        expect(wrapper).toMatchSnapshot();
    });
});
