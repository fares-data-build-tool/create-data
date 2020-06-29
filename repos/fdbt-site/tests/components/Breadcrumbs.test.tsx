import { shallow } from 'enzyme';
import React from 'react';
import Breadcrumbs from '../../src/components/Breadcrumbs';
import { mockBreadCrumbList } from '../testData/mockData';

describe('Breadcrumbs', () => {
    it('should render the breadcrumbs', () => {
        const wrapper = shallow(<Breadcrumbs breadcrumbs={mockBreadCrumbList} />);
        expect(wrapper).toMatchSnapshot();
    });
});
