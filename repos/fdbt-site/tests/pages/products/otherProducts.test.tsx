import { shallow } from 'enzyme';
import * as React from 'react';
import { getProductsMatchingJson } from '../../../src/data/s3';
import { getOtherProductsByNoc, getPassengerTypeById } from '../../../src/data/auroradb';
import { MyFaresOtherFaresProduct } from '../../../src/interfaces';
import OtherProducts, { getServerSideProps } from '../../../src/pages/products/otherProducts';
import {
    expectedMultiOperatorGeoZoneTicketWithMultipleProducts,
    expectedPeriodGeoZoneTicketWithMultipleProducts,
    expectedPeriodMultipleServicesTicketWithMultipleProducts,
    getMockContext,
} from '../../../tests/testData/mockData';

jest.mock('../../../src/data/auroradb');
jest.mock('../../../src/data/s3');

(getOtherProductsByNoc as jest.Mock).mockResolvedValue([
    {
        matchingJsonLink: 'path',
        startDate: 'a date',
        endDate: 'another date',
    },
    {
        matchingJsonLink: 'path2',
        startDate: 'a date2',
        endDate: 'another date2',
    },
    {
        matchingJsonLink: 'path3',
        startDate: 'a date3',
        endDate: 'another date3',
    },
]);
(getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedPeriodMultipleServicesTicketWithMultipleProducts);
(getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedMultiOperatorGeoZoneTicketWithMultipleProducts);
(getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedPeriodGeoZoneTicketWithMultipleProducts);
(getPassengerTypeById as jest.Mock).mockResolvedValueOnce({
    id: 9,
    name: 'My best passenger',
    passengerType: {
        passengerType: 'Adult',
    },
});
(getPassengerTypeById as jest.Mock).mockResolvedValueOnce({
    id: 2,
    name: 'My other passenger',
    passengerType: {
        passengerType: 'Infant',
    },
});
(getPassengerTypeById as jest.Mock).mockResolvedValueOnce({
    id: 3,
    name: 'My last passenger',
    passengerType: {
        passengerType: 'Student',
    },
});

const testProducts: MyFaresOtherFaresProduct[] = [
    {
        productDescription: 'First product',
        type: 'flatFare',
        duration: '1 trip',
        quantity: '1',
        passengerType: 'infant',
        startDate: '11/04/2020',
        endDate: '02/09/2090',
        carnet: false,
    },
    {
        productDescription: 'The greatest product eveer!',
        type: 'period',
        duration: '3 days',
        quantity: '20',
        passengerType: 'infant',
        startDate: '11/12/2021',
        endDate: '02/09/2023',
        carnet: true,
    },
    {
        productDescription: 'The greatest product eveer!',
        type: 'period',
        duration: '3 days',
        quantity: '1',
        passengerType: 'adult',
        startDate: '11/12/2021',
        endDate: '02/09/2023',
        carnet: false,
    },
];

describe('myfares pages', () => {
    describe('otherProducts', () => {
        it('should render correctly when some non-Point-to-Point products exist', () => {
            const tree = shallow(<OtherProducts myFaresEnabled otherProducts={testProducts} />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when no non-Point-to-Point products exist', () => {
            const tree = shallow(<OtherProducts myFaresEnabled otherProducts={[]} />);

            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('creates the array of products from the main matching json and the nested products inside it', async () => {
            const ctx = getMockContext();

            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    myFaresEnabled: false,
                    otherProducts: [
                        {
                            carnet: false,
                            duration: '5 weeks',
                            endDate: 'another date',
                            passengerType: 'My best passenger',
                            productDescription: 'Weekly Ticket',
                            quantity: '1',
                            startDate: 'a date',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '1 year',
                            endDate: 'another date',
                            passengerType: 'My other passenger',
                            productDescription: 'Day Ticket',
                            quantity: '1',
                            startDate: 'a date',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '28 months',
                            endDate: 'another date',
                            passengerType: 'My last passenger',
                            productDescription: 'Monthly Ticket',
                            quantity: '1',
                            startDate: 'a date',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '5 weeks',
                            endDate: 'another date2',
                            passengerType: '',
                            productDescription: 'Weekly Ticket',
                            quantity: '1',
                            startDate: 'a date2',
                            type: 'multiOperator',
                        },
                        {
                            carnet: false,
                            duration: '1 year',
                            endDate: 'another date2',
                            passengerType: '',
                            productDescription: 'Day Ticket',
                            quantity: '1',
                            startDate: 'a date2',
                            type: 'multiOperator',
                        },
                        {
                            carnet: false,
                            duration: '28 months',
                            endDate: 'another date2',
                            passengerType: '',
                            productDescription: 'Monthly Ticket',
                            quantity: '1',
                            startDate: 'a date2',
                            type: 'multiOperator',
                        },
                        {
                            carnet: false,
                            duration: '5 weeks',
                            endDate: 'another date3',
                            passengerType: '',
                            productDescription: 'Weekly Ticket',
                            quantity: '1',
                            startDate: 'a date3',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '1 year',
                            endDate: 'another date3',
                            passengerType: '',
                            productDescription: 'Day Ticket',
                            quantity: '1',
                            startDate: 'a date3',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '28 months',
                            endDate: 'another date3',
                            passengerType: '',
                            productDescription: 'Monthly Ticket',
                            quantity: '1',
                            startDate: 'a date3',
                            type: 'period',
                        },
                    ],
                },
            });
        });
    });
});
