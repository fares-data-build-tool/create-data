import { shallow } from 'enzyme';
import React from 'react';
import SalesOfferPackageExplanation from '../../src/components/SalesOfferPackageExplanation';

describe('SalesOfferPackageExplanation', () => {
    it('should render the sales offer package explanation', () => {
        const wrapper = shallow(<SalesOfferPackageExplanation />);
        expect(wrapper).toMatchSnapshot();
    });
});
