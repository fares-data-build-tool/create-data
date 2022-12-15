import * as React from 'react';
import { shallow } from 'enzyme';
import CapConfirmation, { buildCapConfirmationElements } from '../../src/pages/capConfirmation';
import { ExpiryUnit } from '../../src/interfaces/matchingJsonTypes';

describe('pages', () => {
    describe('capConfirmation', () => {
        it('should render correctly for capped ticket by products', () => {
            const tree = shallow(
                <CapConfirmation
                    typeOfCap="byProducts"
                    productGroupName="capped-product-group-name"
                    caps={[
                        {
                            name: 'Cap 1',
                            price: '2',
                            durationAmount: '1',
                            durationUnits: ExpiryUnit.HOUR,
                        },
                    ]}
                    capValidity="24 hr"
                    capStartInfo={{
                        type: 'rollingDays',
                    }}
                    services={['1', '2C']}
                    tapsPricingContents={[]}
                    capDistancePricingContents={[]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for capped ticket by taps', () => {
            const tree = shallow(
                <CapConfirmation
                    typeOfCap="byTaps"
                    productGroupName=""
                    caps={[
                        {
                            name: 'Cap 1',
                            price: '2',
                            durationAmount: '1',
                            durationUnits: ExpiryUnit.HOUR,
                        },
                    ]}
                    capValidity="24 hr"
                    capStartInfo={{
                        type: 'rollingDays',
                    }}
                    services={['1', '2C']}
                    tapsPricingContents={['Tap Number: 1, Price: 2']}
                    capDistancePricingContents={[]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for capped ticket by distance', () => {
            const tree = shallow(
                <CapConfirmation
                    typeOfCap="byDistance"
                    productGroupName=""
                    caps={[
                        {
                            name: 'Cap 1',
                            price: '2',
                            durationAmount: '1',
                            durationUnits: ExpiryUnit.DAY,
                        },
                    ]}
                    capValidity="24 hr"
                    capStartInfo={{
                        type: 'fixedWeekdays',
                        startDay: 'monday',
                    }}
                    services={['1', '2C']}
                    tapsPricingContents={[]}
                    capDistancePricingContents={['Min Price: 2, Max Price: 4', 'Distance: 0-2, Price per km: 4']}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('buildCapConfirmationElements', () => {
            it('should create confirmation elements for capped ticket by products', () => {
                const result = buildCapConfirmationElements(
                    'byProducts',
                    'capped-product-group-name',
                    [{ name: 'Cap 1', price: '2', durationAmount: '1', durationUnits: ExpiryUnit.DAY }],
                    'endOfCalendarDay',
                    {
                        type: 'fixedWeekdays',
                        startDay: 'monday',
                    },
                    ['1', '2'],
                    [],
                    [],
                );
                expect(result).toStrictEqual([
                    { content: 'Pricing by products ', href: 'typeOfCap', name: 'Cap type' },
                    {
                        content: 'capped-product-group-name',
                        href: '/selectCappedProductGroup',
                        name: 'Product group name',
                    },
                    {
                        content: ['Price - £2', 'Duration - 1 day'],
                        href: '/createCaps',
                        name: 'Cap 1',
                    },
                    {
                        content: 'End of calendar day',
                        href: '/selectCapValidity',
                        name: 'Cap expiry',
                    },
                    {
                        content: 'Fixed days - Monday',
                        href: '/defineCapStart',
                        name: 'Cap starts',
                    },
                    {
                        content: '1, 2',
                        href: '/serviceList',
                        name: 'Services',
                    },
                ]);
            });

            it('should create confirmation elements for capped ticket by taps', () => {
                const result = buildCapConfirmationElements(
                    'byTaps',
                    '',
                    [{ name: 'Cap 1', price: '2', durationAmount: '1', durationUnits: ExpiryUnit.DAY }],
                    '24hr',
                    {
                        type: 'rollingDays',
                    },
                    ['1', '2'],
                    ['Tap Number: 1, Price: 2', 'Tap Number: 2, Price: 4'],
                    [],
                );
                expect(result).toStrictEqual([
                    { content: 'Pricing by taps ', href: 'typeOfCap', name: 'Cap type' },
                    {
                        content: ['Price - £2', 'Duration - 1 day'],
                        href: '/createCaps',
                        name: 'Cap 1',
                    },
                    {
                        content: '24 hr',
                        href: '/selectCapValidity',
                        name: 'Cap expiry',
                    },
                    {
                        content: 'Rolling days',
                        href: '/defineCapStart',
                        name: 'Cap starts',
                    },
                    {
                        content: '1, 2',
                        href: '/serviceList',
                        name: 'Services',
                    },
                    {
                        name: 'Prices by taps',
                        href: '/multiTapsPricing',
                        content: ['Tap Number: 1, Price: 2', 'Tap Number: 2, Price: 4'],
                    },
                ]);
            });

            it('should create confirmation elements for capped ticket by distance', () => {
                const result = buildCapConfirmationElements(
                    'byDistance',
                    '',
                    [{ name: 'Cap 1', price: '2', durationAmount: '1', durationUnits: ExpiryUnit.DAY }],
                    '24hr',
                    {
                        type: 'rollingDays',
                    },
                    ['1', '2'],
                    [],
                    [
                        'Min Price: 2, Max Price: 9',
                        'Distance: 0 - 2, Price per km: 4',
                        'Distance: 2 - 4, Price per km: 3',
                    ],
                );
                expect(result).toStrictEqual([
                    { content: 'Pricing by distance ', href: 'typeOfCap', name: 'Cap type' },
                    {
                        content: ['Price - £2', 'Duration - 1 day'],
                        href: '/createCaps',
                        name: 'Cap 1',
                    },
                    {
                        content: '24 hr',
                        href: '/selectCapValidity',
                        name: 'Cap expiry',
                    },
                    {
                        content: 'Rolling days',
                        href: '/defineCapStart',
                        name: 'Cap starts',
                    },
                    {
                        content: '1, 2',
                        href: '/serviceList',
                        name: 'Services',
                    },
                    {
                        content: [
                            'Min Price: 2, Max Price: 9',
                            'Distance: 0 - 2, Price per km: 4',
                            'Distance: 2 - 4, Price per km: 3',
                        ],
                        href: '/defineCapPricingPerDistance',
                        name: 'Prices',
                    },
                ]);
            });
        });
    });
});
