import * as React from 'react';
import { shallow } from 'enzyme';
import DefineCapPricingPerDistance from '../../src/pages/defineCapPricingPerDistance';

describe('pages', () => {
    describe('defineCapPricingPerDistance', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <DefineCapPricingPerDistance
                    errors={[]}
                    csrfToken=""
                    capPricePerDistances={{
                        maximumPrice: '4',
                        minimumPrice: '3',
                        capPricing: [
                            {
                                distanceFrom: '0',
                                distanceTo: '2',
                                pricePerKm: '5',
                            },
                            {
                                distanceFrom: '3',
                                distanceTo: 'Max',
                                pricePerKm: '5',
                            },
                        ],
                    }}
                    numberOfCapInitial={1}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <DefineCapPricingPerDistance
                    errors={[
                        {
                            id: `distance-to-0`,
                            errorMessage: 'Enter a value for the distance',
                        },
                    ]}
                    csrfToken=""
                    capPricePerDistances={{
                        maximumPrice: '4',
                        minimumPrice: '3',
                        capPricing: [
                            {
                                distanceFrom: '0',
                                distanceTo: '',
                                pricePerKm: '6',
                            },
                            {
                                distanceFrom: '3',
                                distanceTo: 'Max',
                                pricePerKm: '5',
                            },
                        ],
                    }}
                    numberOfCapInitial={2}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
