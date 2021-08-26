import * as React from 'react';
import { shallow } from 'enzyme';
import { getMockContext } from '../testData/mockData';
import { getSalesOfferPackagesByNocCode } from '../../src/data/auroradb';
import { SalesOfferPackage } from '../../src/interfaces';
import { FARE_TYPE_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../src/constants/attributes';
import SelectPurchaseMethods, { getServerSideProps, PurchaseMethodsProps } from '../../src/pages/selectPurchaseMethods';
import { FromDb } from 'shared/matchingJsonTypes';

jest.mock('../../src/data/auroradb');

const defaultSalesOfferPackageOne: FromDb<SalesOfferPackage> = {
    id: 1,
    name: 'Onboard (cash)',
    description: '',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['cash'],
    ticketFormats: ['paperTicket'],
};

const defaultSalesOfferPackageTwo: FromDb<SalesOfferPackage> = {
    id: 2,
    name: 'Onboard (contactless)',
    description: '',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['contactlessPaymentCard'],
    ticketFormats: ['paperTicket'],
};

const defaultSalesOfferPackageThree: FromDb<SalesOfferPackage> = {
    id: 3,
    name: 'Online (smart card)',
    description: '',
    purchaseLocations: ['online'],
    paymentMethods: ['directDebit', 'creditCard', 'debitCard'],
    ticketFormats: ['smartCard'],
};

const defaultSalesOfferPackageFour: FromDb<SalesOfferPackage> = {
    id: 4,
    name: 'Mobile App',
    description: '',
    purchaseLocations: ['mobileDevice'],
    paymentMethods: ['debitCard', 'creditCard', 'mobilePhone', 'directDebit'],
    ticketFormats: ['mobileApp'],
};

describe('pages', () => {
    const selectSalesOfferPackagePropsInfoNoError: PurchaseMethodsProps = {
        salesOfferPackagesList: [
            defaultSalesOfferPackageOne,
            defaultSalesOfferPackageTwo,
            defaultSalesOfferPackageThree,
            defaultSalesOfferPackageFour,
        ],
        errors: [],
        products: [],
        csrfToken: '',
    };

    const selectSalesOfferPackagePropsInfoWithError: PurchaseMethodsProps = {
        products: [],
        salesOfferPackagesList: [
            defaultSalesOfferPackageOne,
            defaultSalesOfferPackageTwo,
            defaultSalesOfferPackageThree,
            defaultSalesOfferPackageFour,
        ],
        errors: [{ errorMessage: 'Choose at least one service from the options', id: 'sales-offer-package-error' }],
        csrfToken: '',
    };

    describe('selectPurchaseMethods', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <SelectPurchaseMethods
                    salesOfferPackagesList={selectSalesOfferPackagePropsInfoNoError.salesOfferPackagesList}
                    products={[]}
                    errors={selectSalesOfferPackagePropsInfoNoError.errors}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render an error when an error message is passed through to props', () => {
            const tree = shallow(
                <SelectPurchaseMethods
                    salesOfferPackagesList={selectSalesOfferPackagePropsInfoWithError.salesOfferPackagesList}
                    products={[]}
                    errors={selectSalesOfferPackagePropsInfoWithError.errors}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it.each([
                ['single', '', false],
                ['flatFare', '', false],
                ['period', ' geoZone', false],
                ['period', ' mulitpleServices', true],
                ['multiOperator', ' geoZone', true],
                ['multiOperator', ' multipleServices', false],
            ])(
                'should return expected props when the page is visited by a user with stored sales offer packages on the %s%s ticket flow',
                async (fareType, _ticketType, multipleProducts) => {
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
                    const ctx = getMockContext({
                        session: {
                            [FARE_TYPE_ATTRIBUTE]: {
                                fareType,
                            },
                            ...(!multipleProducts && { [MULTIPLE_PRODUCT_ATTRIBUTE]: null }),
                        },
                    });
                    const result = await getServerSideProps(ctx);
                    const expectedSalesOfferPackageList: SalesOfferPackage[] = mockSalesOfferPackages.map(
                        (mockSalesOfferPackage) => {
                            return {
                                ...mockSalesOfferPackage,
                            };
                        },
                    );
                    const expectedProductNamesLength = !multipleProducts
                        ? 1
                        : ctx.req.session[MULTIPLE_PRODUCT_ATTRIBUTE].products.length;
                    expect(result.props.errors.length).toBe(0);
                    expect(result.props.products.length).toBe(expectedProductNamesLength);
                    expect(result.props.salesOfferPackagesList).toEqual(expectedSalesOfferPackageList);
                },
            );

            it('should throw an error when necessary nocCode is invalid, when the user is not a scheme operator', async () => {
                const ctx = getMockContext({
                    session: { [OPERATOR_ATTRIBUTE]: undefined },
                    body: null,
                    uuid: {},
                    mockWriteHeadFn: jest.fn(),
                    mockEndFn: jest.fn(),
                    isLoggedin: false,
                });
                await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
            });
        });
    });
});
