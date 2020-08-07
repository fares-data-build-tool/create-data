import { shallow } from 'enzyme';
import React from 'react';
import InsetText from '../../src/components/InsetText';

describe('InsetText', () => {
    it('should render the inset text', () => {
        const wrapper = shallow(<InsetText text="Snapshot text" />);
        expect(wrapper).toMatchSnapshot();
    });
});
