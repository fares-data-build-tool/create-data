import { shallow } from 'enzyme';
import React from 'react';
import DirectionDropdown from '../../src/components/DirectionDropdown';
import { mockService } from '../testData/mockData';

describe('DirectionDropdown', () => {
    it('should render the dropdown with options', () => {
        const wrapper = shallow(
            <DirectionDropdown
                journeyPatterns={mockService.journeyPatterns}
                selectNameID="test-drop-down"
                selectName="testDropDown"
                dropdownLabel="test"
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should select the options from selection if passed in', () => {
        const wrapper = shallow(
            <DirectionDropdown
                journeyPatterns={mockService.journeyPatterns}
                selectNameID="test-drop-down"
                selectName="testDropDown"
                inboundJourney="13003921A#13003655B"
                dropdownLabel="test"
            />,
        );
        const selector = wrapper.find('.govuk-select');
        expect(selector.prop('defaultValue')).toEqual('13003921A#13003655B');
    });
});
