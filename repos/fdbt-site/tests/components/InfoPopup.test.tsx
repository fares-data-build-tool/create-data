import { shallow } from 'enzyme';
import React from 'react';
import InfoPopup from '../../src/components/InfoPopup';

describe('InfoPopup', () => {
    it('should render the InfoPopup', () => {
        const okActionHandler = jest.fn();
        const wrapper = shallow(
            <InfoPopup title="my title" text="this is my text" okActionHandler={okActionHandler} isOpen={true} />,
        );
        expect(wrapper).toMatchSnapshot();

        expect(okActionHandler).not.toHaveBeenCalled();
        wrapper.find('button').simulate('click');
        expect(okActionHandler).toHaveBeenCalled();
    });
});
