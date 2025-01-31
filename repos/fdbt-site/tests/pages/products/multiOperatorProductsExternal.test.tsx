import { shallow } from 'enzyme';
import * as React from 'react';
import { getProductsMatchingJson } from '../../../src/data/s3';
import { getMultiOperatorExternalProducts, getPassengerTypeById } from '../../../src/data/auroradb';
import { expectedSchemeOperatorMultiServicesTicket, getMockContext } from '../../testData/mockData';
import MultiOperatorProducts, {
    getServerSideProps,
    MultiOperatorProduct,
} from '../../../src/pages/products/multiOperatorProductsExternal';

jest.mock('../../../src/data/auroradb');
jest.mock('../../../src/data/s3');

(getMultiOperatorExternalProducts as jest.Mock).mockResolvedValue([
    {
        matchingJsonLink: 'path',
        id: 1,
        nocCode: 'TEST',
        startDate: '17/12/2020',
        endDate: '18/12/2020',
    },
    {
        matchingJsonLink: 'path2',
        id: 2,
        nocCode: 'LNUD',
        startDate: '17/12/2020',
        endDate: '18/12/2020',
    },
    {
        matchingJsonLink: 'path3',
        id: 3,
        nocCode: 'ABCD',
        startDate: '17/12/2020',
        endDate: '18/12/2020',
    },
]);
(getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedSchemeOperatorMultiServicesTicket);
(getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedSchemeOperatorMultiServicesTicket);
(getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
    ...expectedSchemeOperatorMultiServicesTicket,
    additionalOperators: [
        {
            nocCode: 'RAND',
            selectedServices: [],
        },
        {
            nocCode: 'TEST',
            selectedServices: [],
        },
    ],
});
(getPassengerTypeById as jest.Mock).mockResolvedValue({
    id: 9,
    name: 'My best passenger',
    passengerType: {
        passengerType: 'Adult',
    },
});

describe('multiOperatorProductsExternal page', () => {
    const ownedProducts: MultiOperatorProduct[] = [
        {
            id: 1,
            actionRequired: false,
            productDescription: 'product one',
            duration: '2 weeks',
            startDate: '17/12/2020',
            endDate: '18/12/2020',
            passengerType: 'My best passenger',
        },
        {
            id: 1,
            actionRequired: false,
            productDescription: 'product two',
            duration: '5 days',
            startDate: '17/12/2020',
            endDate: '18/12/2020',
            passengerType: 'My best passenger',
        },
    ];
    const sharedProducts: MultiOperatorProduct[] = [
        {
            id: 3,
            actionRequired: true,
            productDescription: 'product one',
            duration: '2 weeks',
            startDate: '17/12/2020',
            endDate: '18/12/2020',
            passengerType: 'My best passenger',
        },
        {
            id: 3,
            actionRequired: true,
            productDescription: 'product two',
            duration: '5 days',
            startDate: '17/12/2020',
            endDate: '18/12/2020',
            passengerType: 'My best passenger',
        },
    ];

    it('renders correctly', () => {
        const tree = shallow(
            <MultiOperatorProducts ownedProducts={ownedProducts} sharedProducts={sharedProducts} csrfToken="" />,
        );

        expect(tree).toMatchSnapshot();
        expect(tree.find('span').exists()).toBeFalsy();
    });

    it('displays a no products message when there are no owned products', () => {
        const tree = shallow(<MultiOperatorProducts ownedProducts={[]} sharedProducts={sharedProducts} csrfToken="" />);

        expect(tree.find('span').first().text()).not.toContain('There are no multi-operator products shared with you');
    });

    it('displays a no products message when there are no shared products', () => {
        const tree = shallow(<MultiOperatorProducts ownedProducts={ownedProducts} sharedProducts={[]} csrfToken="" />);

        expect(tree.find('span').first().text()).not.toContain('You currently have no multi-operator products');
    });

    describe('getServerSideProps', () => {
        it('sorts multi-operator products by owned and shared product lists', async () => {
            const ctx = getMockContext();
            const result = await getServerSideProps(ctx);

            expect(result.props.ownedProducts).toEqual([
                {
                    id: 1,
                    actionRequired: false,
                    productDescription: 'product one',
                    duration: '2 weeks',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    passengerType: 'My best passenger',
                },
                {
                    id: 1,
                    actionRequired: false,
                    productDescription: 'product two',
                    duration: '5 days',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    passengerType: 'My best passenger',
                },
            ]);
            expect(result.props.sharedProducts).toEqual([
                {
                    id: 3,
                    actionRequired: true,
                    productDescription: 'product one',
                    duration: '2 weeks',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    passengerType: 'My best passenger',
                },
                {
                    id: 3,
                    actionRequired: true,
                    productDescription: 'product two',
                    duration: '5 days',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    passengerType: 'My best passenger',
                },
            ]);
        });
    });
});
