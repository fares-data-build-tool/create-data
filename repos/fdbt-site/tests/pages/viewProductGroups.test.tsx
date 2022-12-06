import { shallow } from 'enzyme';
import * as React from 'react';
import { GroupOfProducts } from '../../src/interfaces';
import ViewProductGroups from '../../src/pages/viewProductGroups';

describe('pages', () => {
    describe('view product groups', () => {
        it('should render correctly when no product groups', () => {
            const tree = shallow(
                <ViewProductGroups productGroups={[]} csrfToken={''} referer={null} viewProductGroupErrors={[]} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on product group', () => {
            const productGroup: GroupOfProducts = {
                id: 1,
                name: 'first product group',
                productIds: ['1', '2'],
            };

            const tree = shallow(
                <ViewProductGroups
                    productGroups={[productGroup]}
                    csrfToken={''}
                    referer={'hello'}
                    viewProductGroupErrors={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
