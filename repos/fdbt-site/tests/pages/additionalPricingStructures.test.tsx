import * as React from 'react';
import { shallow } from 'enzyme';
import AdditionalPricingStructures from '../../src/pages/additionalPricingStructures';

describe('pages', () => {
    describe('additionalPricingStructures', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <AdditionalPricingStructures
                    errors={[]}
                    csrfToken=""
                    additionalPricingStructures={{
                        additionalDiscounts: 'yes',
                        pricingStructureStart: '2',
                        structureDiscount: '2',
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <AdditionalPricingStructures
                    errors={[
                        {
                            id: 'pricing-structure-start',
                            errorMessage: 'Enter a value for the pricing structure',
                        },
                    ]}
                    csrfToken=""
                    additionalPricingStructures={{
                        additionalDiscounts: 'yes',
                        pricingStructureStart: '',
                        structureDiscount: '2',
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
