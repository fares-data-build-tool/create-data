import * as React from 'react';
import { shallow } from 'enzyme';
import SelectSalesOfferPackage, {
    SelectSalesOfferPackageProps,
    getServerSideProps,
    defaultSalesOfferPackageOne,
    defaultSalesOfferPackageTwo,
    defaultSalesOfferPackageThree,
    defaultSalesOfferPackageFour,
} from '../../src/pages/selectSalesOfferPackage';
import { getMockContext } from '../testData/mockData';
import { getSalesOfferPackagesByNocCode } from '../../src/data/auroradb';
import { SalesOfferPackage } from '../../src/interfaces';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    const selectSalesOfferPackagePropsInfoNoError: SelectSalesOfferPackageProps = {
        salesOfferPackagesList: [
            defaultSalesOfferPackageOne,
            defaultSalesOfferPackageTwo,
            defaultSalesOfferPackageThree,
            defaultSalesOfferPackageFour,
        ],
        errors: [],
        productNamesList: [],
    };

    const selectSalesOfferPackagePropsInfoWithError: SelectSalesOfferPackageProps = {
        productNamesList: [],
        salesOfferPackagesList: [
            defaultSalesOfferPackageOne,
            defaultSalesOfferPackageTwo,
            defaultSalesOfferPackageThree,
            defaultSalesOfferPackageFour,
        ],
        errors: [{ errorMessage: 'Choose at least one service from the options', id: 'sales-offer-package-error' }],
    };

    describe('serviceList', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <SelectSalesOfferPackage
                    salesOfferPackagesList={selectSalesOfferPackagePropsInfoNoError.salesOfferPackagesList}
                    productNamesList={[]}
                    errors={selectSalesOfferPackagePropsInfoNoError.errors}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render an error when an error message is passed through to props', () => {
            const tree = shallow(
                <SelectSalesOfferPackage
                    salesOfferPackagesList={selectSalesOfferPackagePropsInfoWithError.salesOfferPackagesList}
                    productNamesList={[]}
                    errors={selectSalesOfferPackagePropsInfoWithError.errors}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props to the page when the page is visited by a user with stored sales offer packages', async () => {
                const mockSalesOfferPackages: SalesOfferPackage[] = [
                    {
                        name: 'IW Bus Co - Package 1',
                        description: 'On bus - Cash - Paper Ticket',
                        purchaseLocations: ['On bus'],
                        paymentMethods: ['Cash'],
                        ticketFormats: ['Paper ticket'],
                    },
                    {
                        name: 'IW Bus Co - Package 2',
                        description: 'Online App - Card via App - eTicket',
                        purchaseLocations: ['Online App'],
                        paymentMethods: ['Card via App'],
                        ticketFormats: ['eTicket'],
                    },
                    {
                        name: 'IW Bus Co - Package 3',
                        description: 'Ticket Machine - Card - Pass',
                        purchaseLocations: ['Ticket Machine'],
                        paymentMethods: ['Card'],
                        ticketFormats: ['Pass'],
                    },
                ];
                (getSalesOfferPackagesByNocCode as jest.Mock).mockImplementation(() => mockSalesOfferPackages);
                const ctx = getMockContext();
                const result = await getServerSideProps(ctx);
                const expectedSalesOfferPackageList: SalesOfferPackage[] = mockSalesOfferPackages.map(
                    mockSalesOfferPackage => {
                        return {
                            ...mockSalesOfferPackage,
                        };
                    },
                );
                expect(result.props.errors.length).toBe(0);
                expect(result.props.salesOfferPackagesList).toEqual(expectedSalesOfferPackageList);
            });

            it('should throw an error when necessary nocCode is missing', async () => {
                const ctx = getMockContext({
                    cookies: { operator: null },
                    body: null,
                    uuid: {},
                    mockWriteHeadFn: jest.fn(),
                    mockEndFn: jest.fn(),
                    isLoggedin: false,
                });
                await expect(getServerSideProps(ctx)).rejects.toThrow(
                    'Necessary nocCode from ID Token cookie not found to show selectSalesOfferPackageProps page',
                );
            });
        });
    });
});
