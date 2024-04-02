import { shallow } from 'enzyme';
import * as React from 'react';
import {
    getServiceDirectionDescriptionsByNocAndServiceIdAndDataSource,
    getServiceByNocAndId,
    getPassengerTypeNameByIdAndNoc,
    getProductById,
    getSalesOfferPackageByIdAndNoc,
    getTimeRestrictionByIdAndNoc,
    getServiceByIdAndDataSource,
    getCaps,
} from '../../../src/data/auroradb';
import { getProductsMatchingJson } from '../../../src/data/s3';
import ProductDetails, { getServerSideProps } from '../../../src/pages/products/productDetails';
import {
    expectedCarnetReturnTicket,
    expectedFlatFareGeoZoneTicketWithExemptions,
    expectedMultiOperatorGeoZoneTicketWithMultipleProducts,
    expectedPeriodGeoZoneTicketWithMultipleProducts,
    expectedPointToPointPeriodTicket,
    expectedReturnTicketWithAdditionalService,
    expectedSchemeOperatorAfterFlatFareAdjustmentTicket,
    expectedSchemeOperatorTicketAfterGeoZoneAdjustment,
    expectedSingleTicket,
    getMockContext,
    mockRawService,
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
                            id: 'services',
                            name: 'Service',
                            content: ['19 - STAINING - BLACKPOOL via Victoria Hospital (Main Entrance)'],
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Adult Test'],
                            editLink: '/selectPassengerType',
                        },
                        { id: 'time-restriction', name: 'Time restriction', content: ['N/A'] },
                        {
                            id: 'quantity-in-bundle',
                            name: 'Quantity in bundle',
                            content: ['2'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'carnet-expiry',
                            name: 'Carnet expiry',
                            content: ['22 year(s)'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP Test 1', 'SOP Test 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['18/10/2021'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/10/2121'],
                            editLink: '/productDateInformation',
                        },
                        { id: 'cap', name: 'cap', content: ['Cap 1 - £2'] },
                    ]}
                    productId="2"
                    copiedProduct={false}
                    isSingle={false}
                    cannotGenerateReturn={false}
                    passengerTypeId={2}
                    csrfToken=""
                    stage="dev"
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for a copied product', () => {
            const tree = shallow(
                <ProductDetails
                    requiresAttention={true}
                    backHref={'/products/pointToPointProducts?serviceId=1'}
                    productName={'Carnet Return Test'}
                    startDate={'18/10/2021'}
                    endDate={'18/10/2121'}
                    productDetailsElements={[
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['19 - STAINING - BLACKPOOL via Victoria Hospital (Main Entrance)'],
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Adult Test'],
                            editLink: '/selectPassengerType',
                        },
                        { id: 'time-restriction', name: 'Time restriction', content: ['N/A'] },
                        {
                            id: 'quantity-in-bundle',
                            name: 'Quantity in bundle',
                            content: ['2'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'carnet-expiry',
                            name: 'Carnet expiry',
                            content: ['22 year(s)'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP Test 1', 'SOP Test 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['18/10/2021'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/10/2121'],
                            editLink: '/productDateInformation',
                        },
                    ]}
                    productId="2"
                    copiedProduct
                    isSingle={false}
                    cannotGenerateReturn={false}
                    passengerTypeId={2}
                    csrfToken=""
                    stage="dev"
                />,
            );

            expect(tree).toMatchSnapshot();
        });
        it('should render correctly while the cannot generate return popup is open', () => {
            const tree = shallow(
                <ProductDetails
                    requiresAttention={true}
                    backHref={'/products/pointToPointProducts?serviceId=1'}
                    productName={'Carnet Return Test'}
                    startDate={'18/10/2021'}
                    endDate={'18/10/2121'}
                    productDetailsElements={[
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['19 - STAINING - BLACKPOOL via Victoria Hospital (Main Entrance)'],
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Adult Test'],
                            editLink: '/selectPassengerType',
                        },
                        { id: 'time-restriction', name: 'Time restriction', content: ['N/A'] },
                        {
                            id: 'quantity-in-bundle',
                            name: 'Quantity in bundle',
                            content: ['2'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'carnet-expiry',
                            name: 'Carnet expiry',
                            content: ['22 year(s)'],
                            editLink: '/editCarnetProperties',
                        },
                        { id: 'purchase-methods', name: 'Purchase methods', content: ['SOP Test 1', 'SOP Test 2'] },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['18/10/2021'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/10/2121'],
                            editLink: '/productDateInformation',
                        },
                    ]}
                    productId="2"
                    copiedProduct={false}
                    isSingle
                    cannotGenerateReturn
                    passengerTypeId={2}
                    csrfToken=""
                    stage="dev"
                />,
            );

            expect(tree).toMatchSnapshot();
        });
        it('should render correctly for a fare triangle modified product', () => {
            const tree = shallow(
                <ProductDetails
                    requiresAttention={true}
                    backHref={'/products/pointToPointProducts?serviceId=1'}
                    productName={'Carnet Return Test'}
                    startDate={'18/10/2021'}
                    endDate={'18/10/2121'}
                    productDetailsElements={[
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['19 - STAINING - BLACKPOOL via Victoria Hospital (Main Entrance)'],
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Adult Test'],
                            editLink: '/selectPassengerType',
                        },
                        { id: 'time-restriction', name: 'Time restriction', content: ['N/A'] },
                        {
                            id: 'quantity-in-bundle',
                            name: 'Quantity in bundle',
                            content: ['2'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'carnet-expiry',
                            name: 'Carnet expiry',
                            content: ['22 year(s)'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP Test 1', 'SOP Test 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['18/10/2021'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/10/2121'],
                            editLink: '/productDateInformation',
                        },
                    ]}
                    productId="2"
                    copiedProduct
                    isSingle={false}
                    cannotGenerateReturn={false}
                    passengerTypeId={2}
                    csrfToken=""
                    fareTriangleModified={'18/10/2021'}
                    stage="dev"
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
    describe('getServerSideProps', () => {
        beforeEach(() => {
            (getServiceByNocAndId as jest.Mock).mockResolvedValueOnce({
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

            (getServiceDirectionDescriptionsByNocAndServiceIdAndDataSource as jest.Mock).mockResolvedValue({
                inboundDirectionDescription: 'this way',
                outboundDirectionDescription: 'another way',
            });

            (getServiceByIdAndDataSource as jest.Mock).mockResolvedValue(mockRawService);
            (getCaps as jest.Mock).mockResolvedValue([]);
        });

        it('correctly returns the elements which should be displayed on the page for a school single ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedSingleTicket);
            const ctx = getMockContext({ query: { productId: '1', serviceId: '2' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    stage: 'dev',
                    backHref: `/products/pointToPointProducts?serviceId=2`,
                    productName: 'Test Passenger Type - Single (school)',
                    startDate: '17/12/2020',
                    endDate: '18/12/2024',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Single (academic)'] },
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['Test Line Name - Test Origin to Test Destination'],
                            editLabel: '',
                            editLink: '',
                        },
                        { id: 'journey-direction', name: 'Journey direction', content: ['Inbound - this way'] },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        { id: 'time-restriction', name: 'Only valid during term time', content: ['Yes'] },
                        {
                            id: 'fare-triangle',
                            name: 'Fare triangle',
                            content: ['You created a fare triangle'],
                            editLink: '/csvUpload',
                        },
                        {
                            id: 'fare-stage-matching',
                            name: 'Fare stages and stops',
                            content: ['5 bus stops across 5 fare stages'],
                            editLink: '/editFareStageMatching',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1', 'SOP 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2024'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '2',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: true,
                    lineId: 'q2gv2ve',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a point to point period ticket', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedPointToPointPeriodTicket);
            const ctx = getMockContext({ query: { productId: '1', serviceId: '2' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    stage: 'dev',
                    backHref: `/products/pointToPointProducts?serviceId=2`,
                    productName: 'My product',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Period'] },
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['Test Line Name - Test Origin to Test Destination'],
                            editLabel: '',
                            editLink: '',
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'fare-triangle',
                            name: 'Fare triangle',
                            content: ['You created a fare triangle'],
                            editLink: '/csvUpload',
                        },
                        {
                            id: 'period-duration',
                            name: 'Period duration',
                            content: ['7 weeks'],
                            editLink: '/editPeriodDuration',
                        },
                        {
                            id: 'product-expiry',
                            name: 'Product expiry',
                            content: ['24 hr'],
                            editLink: '/selectPeriodValidity',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1', 'SOP 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '2',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    passengerTypeId: 9,
                    lineId: 'q2gv2ve',
                    csrfToken: '',
                    fareTriangleModified: undefined,
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a return ticket with additional service', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedReturnTicketWithAdditionalService);
            const ctx = getMockContext({ query: { productId: '1', serviceId: '2' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    stage: 'dev',
                    backHref: `/products/pointToPointProducts?serviceId=2`,
                    productName: 'Test Passenger Type - Return',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Return'] },
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['Test Line Name - Test Origin to Test Destination'],
                            editLabel: 'Add service',
                            editLink: '/returnService?selectedServiceId=2',
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'fare-triangle',
                            name: 'Fare triangle',
                            content: ['You created a fare triangle'],
                            editLink: '/csvUpload',
                        },
                        {
                            id: 'outbound-fare-stage-matching',
                            name: 'Outbound fare stages and stops',
                            content: ['1 bus stops across 1 fare stages'],
                            editLink: '/editFareStageMatching',
                        },
                        {
                            id: 'inbound-fare-stage-matching',
                            name: 'Inbound fare stages and stops',
                            content: ['5 bus stops across 5 fare stages'],
                            editLink: '/editFareStageMatching',
                        },
                        {
                            id: 'return-ticket-validity',
                            name: 'Return ticket validity',
                            content: ['N/A'],
                            editLink: '/returnValidity',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1', 'SOP 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '2',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    passengerTypeId: 9,
                    lineId: 'q2gv2ve',
                    csrfToken: '',
                    fareTriangleModified: undefined,
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
                    stage: 'dev',
                    backHref: `/products/otherProducts`,
                    productName: 'Test Return Product',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Return'] },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'fare-triangle',
                            name: 'Fare triangle',
                            content: ['You created a fare triangle'],
                            editLink: '/csvUpload',
                        },
                        {
                            id: 'outbound-fare-stage-matching',
                            name: 'Outbound fare stages and stops',
                            content: ['1 bus stops across 1 fare stages'],
                            editLink: '/editFareStageMatching',
                        },
                        {
                            id: 'inbound-fare-stage-matching',
                            name: 'Inbound fare stages and stops',
                            content: ['5 bus stops across 5 fare stages'],
                            editLink: '/editFareStageMatching',
                        },
                        {
                            id: 'quantity-in-bundle',
                            name: 'Quantity in bundle',
                            content: ['10'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'carnet-expiry',
                            name: 'Carnet expiry',
                            content: ['No expiry'],
                            editLink: '/editCarnetProperties',
                        },
                        {
                            id: 'return-ticket-validity',
                            name: 'Return ticket validity',
                            content: ['3 month(s)'],
                            editLink: '/returnValidity',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1', 'SOP 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    lineId: '',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
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
                    stage: 'dev',
                    backHref: `/products/otherProducts`,
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Period'] },
                        { id: 'zone', name: 'Zone', content: ['Green Lane Shops'], editLink: '/csvZoneUpload' },
                        {
                            id: 'stops',
                            name: 'Number of stops',
                            content: ['15'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'exempted-services',
                            name: 'Exempt services',
                            content: ['N/A'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'period-duration',
                            name: 'Period duration',
                            content: ['5 weeks'],
                            editLink: '/editPeriodDuration',
                        },
                        {
                            id: 'product-expiry',
                            name: 'Product expiry',
                            content: ['24 hr'],
                            editLink: '/selectPeriodValidity',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1', 'SOP 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    lineId: '',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
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
                    stage: 'dev',
                    backHref: '/products/multiOperatorProducts',
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Multi operator'] },
                        { id: 'zone', name: 'Zone', content: ['Green Lane Shops'], editLink: '/csvZoneUpload' },
                        {
                            id: 'stops',
                            name: 'Number of stops',
                            content: ['15'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'exempted-services',
                            name: 'Exempt services',
                            content: ['N/A'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'multi-operator-group',
                            name: 'Multi Operator Group',
                            content: ['MCTR, WBTR, BLAC'],
                            editLink: '/reuseOperatorGroup',
                        },
                        {
                            id: 'period-duration',
                            name: 'Period duration',
                            content: ['5 weeks'],
                            editLink: '/editPeriodDuration',
                        },
                        {
                            id: 'product-expiry',
                            name: 'Product expiry',
                            content: ['24 hr'],
                            editLink: '/selectPeriodValidity',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1', 'SOP 2'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    lineId: '',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
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
                    stage: 'dev',
                    backHref: '/products/otherProducts',
                    productName: 'product one',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Flat fare'] },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'additional-operators-services',
                            name: 'WBTR Services',
                            content: ['343, 444, 543'],
                            editLink: '/multiOperatorServiceList',
                        },
                        {
                            id: 'additional-operators-services',
                            name: 'BLAC Services',
                            content: ['100, 101, 102'],
                            editLink: '/multiOperatorServiceList',
                        },
                        {
                            id: 'additional-operators-services',
                            name: 'LEDS Services',
                            content: ['63, 64, 65'],
                            editLink: '/multiOperatorServiceList',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 1'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    lineId: '',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
                },
            });
        });
        it('correctly returns the elements which should be displayed on the page for a scheme geozone', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedSchemeOperatorTicketAfterGeoZoneAdjustment,
            });
            const ctx = getMockContext({ query: { productId: '1', copied: 'true' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    stage: 'dev',
                    backHref: '/products/otherProducts',
                    productName: 'Weekly Ticket',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Period'] },
                        { id: 'zone', name: 'Zone', content: ['Green Lane Shops'], editLink: '/csvZoneUpload' },
                        {
                            id: 'stops',
                            name: 'Number of stops',
                            content: ['15'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'exempted-services',
                            name: 'Exempt services',
                            content: ['N/A'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['Test Time Restriction'],
                            editLink: '/selectTimeRestrictions',
                        },
                        { id: 'multi-operator-group', name: 'Multi Operator Group', content: ['MCTR, WBTR, BLAC'] },
                        {
                            id: 'period-duration',
                            name: 'Period duration',
                            content: ['5 weeks'],
                            editLink: '/editPeriodDuration',
                        },
                        {
                            id: 'product-expiry',
                            name: 'Product expiry',
                            content: ['Fare day end'],
                            editLink: '/selectPeriodValidity',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 2', 'SOP 1'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '',
                    copiedProduct: true,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    lineId: '',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
                },
            });
        });
        it('correctly returns the elements which should be displayed on the page when fare triangle is modified', async () => {
            (getProductById as jest.Mock).mockReset();
            (getProductById as jest.Mock).mockResolvedValue({ fareTriangleModified: '2021-12-17T00:00:00.000Z' });
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce(expectedSingleTicket);
            const ctx = getMockContext({ query: { productId: '1', serviceId: '2' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    stage: 'dev',
                    backHref: `/products/pointToPointProducts?serviceId=2`,
                    productName: 'Test Passenger Type - Single (school)',
                    startDate: '17/12/2020',
                    endDate: '18/12/2024',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Single (academic)'] },
                        {
                            id: 'services',
                            name: 'Service',
                            content: ['Test Line Name - Test Origin to Test Destination'],
                            editLabel: '',
                            editLink: '',
                        },
                        { id: 'journey-direction', name: 'Journey direction', content: ['Inbound - this way'] },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        { id: 'time-restriction', name: 'Only valid during term time', content: ['Yes'] },
                        {
                            id: 'fare-triangle',
                            name: 'Fare triangle',
                            content: ['Updated: 17/12/2021'],
                            editLink: '/csvUpload',
                        },
                        {
                            id: 'fare-stage-matching',
                            name: 'Fare stages and stops',
                            content: ['5 bus stops across 5 fare stages'],
                            editLink: '/editFareStageMatching',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 2', 'SOP 1'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2024'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '2',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: true,
                    lineId: 'q2gv2ve',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: '2021-12-17T00:00:00.000Z',
                },
            });
        });

        it('correctly returns the elements which should be displayed on the page for a Flat Fare GeoZone Ticket with Exemptions', async () => {
            (getProductsMatchingJson as jest.Mock).mockResolvedValueOnce({
                ...expectedFlatFareGeoZoneTicketWithExemptions,
            });

            const ctx = getMockContext({ query: { productId: '1' } });
            expect(await getServerSideProps(ctx)).toStrictEqual({
                props: {
                    requiresAttention: false,
                    stage: 'dev',
                    backHref: '/products/otherProducts',
                    productName: 'Flat fare with geo zone',
                    startDate: '17/12/2020',
                    endDate: '18/12/2020',
                    productDetailsElements: [
                        { name: 'Fare type', id: 'fare-type', content: ['Flat fare'] },
                        { id: 'zone', name: 'Zone', content: ['my flat fare zone'], editLink: '/csvZoneUpload' },
                        {
                            id: 'stops',
                            name: 'Number of stops',
                            content: ['15'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'exempted-services',
                            name: 'Exempt services',
                            content: ['100, 101, 102'],
                            editLink: '/csvZoneUpload',
                        },
                        {
                            id: 'passenger-type',
                            name: 'Passenger type',
                            content: ['Test Passenger Type'],
                            editLink: '/selectPassengerType',
                        },
                        {
                            id: 'time-restriction',
                            name: 'Time restriction',
                            content: ['N/A'],
                            editLink: '/selectTimeRestrictions',
                        },
                        {
                            id: 'purchase-methods',
                            name: 'Purchase methods',
                            content: ['SOP 2', 'SOP 1'],
                            editLink: '/selectPurchaseMethods',
                        },
                        {
                            id: 'start-date',
                            name: 'Start date',
                            content: ['17/12/2020'],
                            editLink: '/productDateInformation',
                        },
                        {
                            id: 'end-date',
                            name: 'End date',
                            content: ['18/12/2020'],
                            editLink: '/productDateInformation',
                        },
                    ],
                    productId: '1',
                    serviceId: '',
                    copiedProduct: false,
                    cannotGenerateReturn: false,
                    isSingle: false,
                    lineId: '',
                    passengerTypeId: 9,
                    csrfToken: '',
                    fareTriangleModified: undefined,
                },
            });
        });
    });
});
