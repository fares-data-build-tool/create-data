import { shallow } from 'enzyme';
import * as React from 'react';
import {
    getPassengerTypeNameByIdAndNoc,
    getProductMatchingJsonLinkByProductId,
    getSalesOfferPackageByIdAndNoc,
    getTimeRestrictionByIdAndNoc,
} from '../../../src/data/auroradb';
import { getProductsMatchingJson } from '../../../src/data/s3';
import ProductDetails, { getServerSideProps } from '../../../src/pages/products/productDetails';
import {
    expectedCarnetReturnTicket,
    expectedMultiOperatorGeoZoneTicketWithMultipleProducts,
    expectedPeriodGeoZoneTicketWithMultipleProducts,
    expectedPointToPointPeriodTicket,
    expectedSingleTicket,
    getMockContext,
} from '../../testData/mockData';

jest.mock('../../../src/data/auroradb');
jest.mock('../../../src/data/s3');

describe('myfares pages', () => {
    describe('productDetails', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ProductDetails
                    productName={'Carnet Return Test'}
                    startDate={'18/10/2021'}
                    endDate={'18/10/2121'}
                    productDetailsElements={[
                        { name: 'Service', content: '19 - STAINING - BLACKPOOL via Victoria Hospital (Main Entrance)' },
                        { name: 'Passenger type', content: 'Adult Test' },
                        { name: 'Time restriction', content: 'N/A' },
                        { name: 'Quantity in bundle', content: '2' },
                        { name: 'Carnet expiry', content: '22 year(s)' },
                        { name: 'Purchase methods', content: ['SOP Test 1', 'SOP Test 2'] },
                        { name: 'Start date', content: '18/10/2021' },
                        { name: 'End date', content: '18/10/2121' },
                    ]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
    describe('getServerSideProps', () => {
        beforeEach(() => {
            (getProductMatchingJsonLinkByProductId as jest.Mock).mockResolvedValueOnce('path');
            (getPassengerTypeNameByIdAndNoc as jest.Mock).mockResolvedValue('Test Passenger Type');

            (getSalesOfferPackageByIdAndNoc as jest.Mock).mockResolvedValueOnce({
                name: 'SOP 1',
            });
            (getSalesOfferPackageByIdAndNoc as jest.Mock).mockResolvedValueOnce({
                name: 'SOP 2',
            });

            (getTimeRestrictionByIdAndNoc as jest.Mock).mockResolvedValue({
                name: 'Test Time Restriction',
            });
        });

        it('correctly returns the elements which should be displayed on the page for a school single ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedSingleTicket);
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    productName: 'Test Passenger Type - Single (school)',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Service', content: '215 - Worthing - Seaham - Crawley' },
                        { name: 'Passenger type', content: 'Test Passenger Type' },
                        { name: 'Only valid during term time', content: 'Yes' },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: '17/12/2020' },
                        { name: 'End date', content: '18/12/2020' },
                    ],
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a point to point period ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedPointToPointPeriodTicket);
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    productName: 'My product',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Service', content: '215 - Worthing - Seaham - Crawley' },
                        { name: 'Passenger type', content: 'Test Passenger Type' },
                        { name: 'Time restriction', content: 'Test Time Restriction' },
                        { name: 'Period duration', content: '7 weeks' },
                        { name: 'Product expiry', content: '24 hr' },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: '17/12/2020' },
                        { name: 'End date', content: '18/12/2020' },
                    ],
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a carnet return ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedCarnetReturnTicket,
                returnPeriodValidity: { amount: '3', typeOfDuration: 'month' },
            });
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    productName: 'Test Return Product',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Service', content: '215 - Worthing - Seaham - Crawley' },
                        { name: 'Passenger type', content: 'Test Passenger Type' },
                        { name: 'Time restriction', content: 'Test Time Restriction' },
                        { name: 'Quantity in bundle', content: '10' },
                        { name: 'Carnet expiry', content: 'No expiry' },
                        { name: 'Return ticket validity', content: '3 month(s)' },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: '17/12/2020' },
                        { name: 'End date', content: '18/12/2020' },
                    ],
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a Period GeoZone', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedPeriodGeoZoneTicketWithMultipleProducts,
            });
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Passenger type', content: 'Test Passenger Type' },
                        { name: 'Zone', content: 'Green Lane Shops' },
                        { name: 'Time restriction', content: 'Test Time Restriction' },
                        { name: 'Period duration', content: '5 weeks' },
                        { name: 'Product expiry', content: '24 hr' },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: '17/12/2020' },
                        { name: 'End date', content: '18/12/2020' },
                    ],
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a Multi Operator GeoZone Ticket with Multiple Products', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedMultiOperatorGeoZoneTicketWithMultipleProducts,
            });
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Passenger type', content: 'Test Passenger Type' },
                        { name: 'Zone', content: 'Green Lane Shops' },
                        { name: 'Time restriction', content: 'Test Time Restriction' },
                        { name: 'Multi Operator Group', content: 'TEST, MCTR, WBTR, BLAC' },
                        { name: 'Period duration', content: '5 weeks' },
                        { name: 'Product expiry', content: '24 hr' },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: '17/12/2020' },
                        { name: 'End date', content: '18/12/2020' },
                    ],
                },
            });
        });
    });
});
