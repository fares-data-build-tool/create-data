import * as React from 'react';
import { shallow } from 'enzyme';
import DefinePricingPerDistance from '../../src/pages/definePricingPerDistance';

describe('pages', () => {
    describe('DefinePricingPerDistance', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <DefinePricingPerDistance
                    errors={[]}
                    csrfToken=""
                    pricingPerDistanceData={{
                        maximumPrice: '4',
                        minimumPrice: '3',
                        capPricing: [
                            {
                                distanceFrom: '0',
                                distanceTo: '2',
                                pricePerKm: '5',
                            },
                            {
                                distanceFrom: '2',
                                distanceTo: 'Max',
                                pricePerKm: '5',
                            },
                        ],
                        productName: 'Product',
                    }}
                    numberOfEntitesByDistanceInitial={1}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <DefinePricingPerDistance
                    errors={[
                        {
                            id: `distance-to-0`,
                            errorMessage: 'Enter a value for the distance',
                        },
                    ]}
                    csrfToken=""
                    pricingPerDistanceData={{
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
                        productName: 'Product',
                    }}
                    numberOfEntitesByDistanceInitial={2}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
