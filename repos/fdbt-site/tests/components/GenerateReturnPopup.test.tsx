import { shallow } from 'enzyme';
import React from 'react';
import GenerateReturnPopup from '../../src/components/GenerateReturnPopup';

describe('GenerateReturnPopup', () => {
    it('should render the GenerateReturnPopup', () => {
        const cancelActionHandler = jest.fn();
        const wrapper = shallow(<GenerateReturnPopup cancelActionHandler={cancelActionHandler} />);
        expect(wrapper).toMatchSnapshot();

        expect(cancelActionHandler).not.toHaveBeenCalled();
        wrapper.find('button').simulate('click');
        expect(cancelActionHandler).toHaveBeenCalled();
    });
});
