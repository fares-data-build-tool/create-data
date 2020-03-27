/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import PeriodProduct from '../../src/pages/periodProduct';
import { PeriodProductType } from '../../src/interfaces';

const mockPeriodProduct: PeriodProductType = {
    productPrice: '',
    productName: '',
    productNameError: '',
    productPriceError: '',
    uuid: '',
};

describe('pages', () => {
    describe('periodProduct', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <PeriodProduct product={mockPeriodProduct} operator="bus company" zoneName="Test Zone" />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
