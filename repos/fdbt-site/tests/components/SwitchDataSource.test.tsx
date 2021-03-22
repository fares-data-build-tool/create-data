import { shallow } from 'enzyme';
import React from 'react';
import SwitchDataSource from '../../src/components/SwitchDataSource';

describe('SwitchDataSource', () => {
    it('should render the button not disabled', () => {
        const wrapper = shallow(
            <SwitchDataSource
                dataSourceAttribute={{ source: 'bods', hasTnds: true, hasBods: true }}
                pageUrl="/service"
                csrfToken="token"
            />,
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('#change-data-source').props().disabled).toBeFalsy();
    });

    it('should render the button disabled', () => {
        const wrapper = shallow(
            <SwitchDataSource
                dataSourceAttribute={{ source: 'bods', hasTnds: false, hasBods: true }}
                pageUrl="/service"
                csrfToken="token"
            />,
        );
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('#change-data-source').props().disabled).toBeTruthy();
    });
});
