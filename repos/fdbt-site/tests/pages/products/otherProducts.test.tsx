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
        id: 1,
        startDate: '17/12/2020',
        endDate: '18/12/2020',
    },
    {
        matchingJsonLink: 'path2',
        id: 2,
        startDate: '17/12/2020',
        endDate: '18/12/2020',
    },
    {
        matchingJsonLink: 'path3',
        id: 3,
        startDate: '17/12/2020',
        endDate: '18/12/2020',
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
        id: 1,
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
        id: 2,
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
        id: 3,
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
            const tree = shallow(<OtherProducts otherProducts={testProducts} csrfToken="" />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when no non-Point-to-Point products exist', () => {
            const tree = shallow(<OtherProducts otherProducts={[]} csrfToken={''} />);

            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('creates the array of products from the main matching json and the nested products inside it', async () => {
            const ctx = getMockContext();

            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    csrfToken: '',
                    otherProducts: [
                        {
                            carnet: false,
                            duration: '5 weeks',
                            id: 1,
                            endDate: '18/12/2020',
                            passengerType: 'My best passenger',
                            productDescription: 'Weekly Ticket',
                            quantity: '1',
                            startDate: '17/12/2020',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '1 year',
                            id: 1,
                            endDate: '18/12/2020',
                            passengerType: 'My other passenger',
                            productDescription: 'Day Ticket',
                            quantity: '1',
                            startDate: '17/12/2020',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '28 months',
                            id: 1,
                            endDate: '18/12/2020',
                            passengerType: 'My last passenger',
                            productDescription: 'Monthly Ticket',
                            quantity: '1',
                            startDate: '17/12/2020',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '5 weeks',
                            id: 3,
                            endDate: '18/12/2020',
                            passengerType: '',
                            productDescription: 'Weekly Ticket',
                            quantity: '1',
                            startDate: '17/12/2020',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '1 year',
                            id: 3,
                            endDate: '18/12/2020',
                            passengerType: '',
                            productDescription: 'Day Ticket',
                            quantity: '1',
                            startDate: '17/12/2020',
                            type: 'period',
                        },
                        {
                            carnet: false,
                            duration: '28 months',
                            id: 3,
                            endDate: '18/12/2020',
                            passengerType: '',
                            productDescription: 'Monthly Ticket',
                            quantity: '1',
                            startDate: '17/12/2020',
                            type: 'period',
                        },
                    ],
                },
            });
        });
    });
});
