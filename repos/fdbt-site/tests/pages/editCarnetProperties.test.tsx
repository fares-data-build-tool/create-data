import { shallow } from 'enzyme';
import React from 'react';
import { CarnetExpiryUnit } from '../../src/interfaces/matchingJsonTypes';
import EditCarnetProperties from '../../src/pages/editCarnetProperties';

describe('pages', () => {
    describe('editCarnetProperties', () => {
        it('should render editCarnetProperties page correctly', () => {
            const wrapper = shallow(
                <EditCarnetProperties
                    errors={[]}
                    csrfToken=""
                    expiryTime="3"
                    expiryUnit={CarnetExpiryUnit.HOUR}
                    quantity="3"
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
