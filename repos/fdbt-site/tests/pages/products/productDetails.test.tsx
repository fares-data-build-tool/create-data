import { shallow } from 'enzyme';
import * as React from 'react';
import {
    getBodsServiceDirectionDescriptionsByNocAndLineName,
    getBodsServiceByNocAndId,
    getPassengerTypeNameByIdAndNoc,
    getProductById,
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
    expectedSchemeOperatorAfterFlatFareAdjustmentTicket,
    expectedSchemeOperatorTicketAfterGeoZoneAdjustment,
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
                    requiresAttention={true}
                    backHref={'/products/pointToPointProducts?serviceId=1'}
                    productName={'Carnet Return Test'}
                    startDate={'18/10/2021'}
                    endDate={'18/10/2121'}
                    productDetailsElements={[
                        {
                            name: 'Service',
                            content: ['19 - STAINING - BLACKPOOL via Victoria Hospital (Main Entrance)'],
                        },
                        { name: 'Passenger type', content: ['Adult Test'] },
                        { name: 'Time restriction', content: ['N/A'] },
                        { name: 'Quantity in bundle', content: ['2'] },
                        { name: 'Carnet expiry', content: ['22 year(s)'] },
                        { name: 'Purchase methods', content: ['SOP Test 1', 'SOP Test 2'] },
                        { name: 'Start date', content: ['18/10/2021'] },
                        { name: 'End date', content: ['18/10/2121'] },
                    ]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
    describe('getServerSideProps', () => {
        beforeEach(() => {
            (getBodsServiceByNocAndId as jest.Mock).mockResolvedValueOnce({
                id: '2',
                lineId: '1',
                origin: 'Test Origin',
                destination: 'Test Destination',
                lineName: 'Test Line Name',
                startDate: 'A date',
                endDate: 'Another date',
            });
            (getProductById as jest.Mock).mockResolvedValueOnce('path');
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

            (getBodsServiceDirectionDescriptionsByNocAndLineName as jest.Mock).mockResolvedValue({
                inboundDirectionDescription: 'this way',
                outboundDirectionDescription: 'another way',
            });
        });

        it('correctly returns the elements which should be displayed on the page for a school single ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedSingleTicket);
            const ctx = getMockContext({ query: { productId: '1', serviceId: '2' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    backHref: `/products/pointToPointProducts?serviceId=2`,
                    productName: 'Test Passenger Type - Single (school)',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Service', content: ['Test Line Name - Test Origin to Test Destination'] },
                        { name: 'Journey direction', content: ['Inbound - this way'] },
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Only valid during term time', content: ['Yes'] },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
                    ],
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a point to point period ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedPointToPointPeriodTicket);
            const ctx = getMockContext({ query: { productId: '1', serviceId: '2' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    backHref: `/products/pointToPointProducts?serviceId=2`,
                    productName: 'My product',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Service', content: ['Test Line Name - Test Origin to Test Destination'] },
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Time restriction', content: ['Test Time Restriction'] },
                        { name: 'Period duration', content: ['7 weeks'] },
                        { name: 'Product expiry', content: ['24 hr'] },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
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
                    requiresAttention: false,
                    backHref: `/products/otherProducts`,
                    productName: 'Test Return Product',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Time restriction', content: ['Test Time Restriction'] },
                        { name: 'Quantity in bundle', content: ['10'] },
                        { name: 'Carnet expiry', content: ['No expiry'] },
                        { name: 'Return ticket validity', content: ['3 month(s)'] },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
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
                    requiresAttention: false,
                    backHref: `/products/otherProducts`,
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Zone', content: ['Green Lane Shops'] },
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Time restriction', content: ['Test Time Restriction'] },
                        { name: 'Period duration', content: ['5 weeks'] },
                        { name: 'Product expiry', content: ['24 hr'] },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
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
                    requiresAttention: false,
                    backHref: `/products/otherProducts`,
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Zone', content: ['Green Lane Shops'] },
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Time restriction', content: ['Test Time Restriction'] },
                        { name: 'Multi Operator Group', content: ['TEST, MCTR, WBTR, BLAC'] },
                        { name: 'Period duration', content: ['5 weeks'] },
                        { name: 'Product expiry', content: ['24 hr'] },
                        { name: 'Purchase methods', content: ['SOP 1', 'SOP 2'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
                    ],
                },
            });
        });
        it('correctly returns the elements which should be displayed on the page for a scheme flat fare', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedSchemeOperatorAfterFlatFareAdjustmentTicket,
            });
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    backHref: '/products/otherProducts',
                    productName: 'product one',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Time restriction', content: ['Test Time Restriction'] },
                        { name: 'WBTR Services', content: ['343, 444, 543'] },
                        { name: 'BLAC Services', content: ['100, 101, 102'] },
                        { name: 'LEDS Services', content: ['63, 64, 65'] },
                        { name: 'Purchase methods', content: ['SOP 1'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
                    ],
                },
            });
        });
        it('correctly returns the elements which should be displayed on the page for a scheme geozone', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedSchemeOperatorTicketAfterGeoZoneAdjustment,
            });
            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    backHref: '/products/otherProducts',
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Zone', content: ['Green Lane Shops'] },
                        { name: 'Passenger type', content: ['Test Passenger Type'] },
                        { name: 'Time restriction', content: ['Test Time Restriction'] },
                        { name: 'Multi Operator Group', content: ['MCTR, WBTR, BLAC'] },
                        { name: 'Period duration', content: ['5 weeks'] },
                        { name: 'Product expiry', content: ['Fare day end'] },
                        { name: 'Purchase methods', content: ['SOP 2', 'SOP 1'] },
                        { name: 'Start date', content: ['17/12/2020'] },
                        { name: 'End date', content: ['18/12/2020'] },
                    ],
                },
            });
        });
    });
});
