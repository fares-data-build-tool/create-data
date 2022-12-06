import { shallow } from 'enzyme';
import React from 'react';
import ProductGroupCard from '../../src/components/ProductGroupCard';

describe('ProductGroupCard', () => {
    it('should render not checked', () => {
        const wrapper = shallow(
            <ProductGroupCard
                groupDetails={{
                    id: 1,
                    productIds: ['1', '2', '3', '4'],
                    name: 'The capped products',
                }}
                index={0}
                defaultChecked={false}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render checked', () => {
        const wrapper = shallow(
            <ProductGroupCard
                groupDetails={{
                    id: 1,
                    productIds: ['1', '2', '3', '4'],
                    name: 'The capped products',
                }}
                index={0}
                defaultChecked
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with delete handler', () => {
        const wrapper = shallow(
            <ProductGroupCard
                groupDetails={{
                    id: 1,
                    productIds: ['1', '2', '3', '4'],
                    name: 'The capped products',
                }}
                index={0}
                defaultChecked={false}
                deleteActionHandler={jest.fn()}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
