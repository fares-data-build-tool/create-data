import * as React from 'react';
import { shallow } from 'enzyme';
import SalesOfferPackages, { getServerSideProps, SalesOfferPackagesProps } from '../../src/pages/salesOfferPackages';
import { getMockContext } from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';
import { SOP_INFO_ATTRIBUTE } from '../../src/constants';
import { SalesOfferPackageInfo, SalesOfferPackageInfoWithErrors } from '../../src/pages/api/salesOfferPackages';

describe('pages', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const salesOfferPackagesNoError: SalesOfferPackagesProps = {
        salesOfferPackage: {
            purchaseLocations: [],
            paymentMethods: [],
            ticketFormats: [],
        },
    };

    const salesOfferPackageWithError: SalesOfferPackagesProps = {
        salesOfferPackage: {
            purchaseLocations: [],
            paymentMethods: [],
            ticketFormats: [],
            errors: [{ errorMessage: 'error', id: '' }],
        },
    };

    describe('salesOfferPackage', () => {
        it('should render correctly', () => {
            // eslint-disable-next-line react/jsx-props-no-spreading
            const tree = shallow(<SalesOfferPackages {...salesOfferPackagesNoError} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render an error when errors are passed through', () => {
            // eslint-disable-next-line react/jsx-props-no-spreading
            const tree = shallow(<SalesOfferPackages {...salesOfferPackageWithError} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('should show the page correctly when there is no salesPackageOffer session', () => {
            const ctx = getMockContext();
            const expectedProps: SalesOfferPackageInfo = {
                purchaseLocations: [],
                paymentMethods: [],
                ticketFormats: [],
            };

            const result = getServerSideProps(ctx).props.salesOfferPackage;
            expect(result).toEqual(expectedProps);
        });

        it('should set the select purchaseLocations if item has been selected and populate errors if two other sections not selected', () => {
            const errors: ErrorInfo[] = [
                { errorMessage: 'Select ticket Payments', id: 'paymentMethods' },
                { errorMessage: 'Select ticket formats', id: 'ticketFormats' },
            ];

            const ctx = getMockContext({
                session: {
                    [SOP_INFO_ATTRIBUTE]: {
                        purchaseLocations: ['OnBoard'],
                        paymentMethods: [],
                        ticketFormats: [],
                        errors,
                    },
                },
            });

            const expectedProps: SalesOfferPackageInfoWithErrors = {
                purchaseLocations: ['OnBoard'],
                paymentMethods: [],
                ticketFormats: [],
                errors,
            };

            const result = getServerSideProps(ctx).props.salesOfferPackage;
            expect(result).toEqual(expectedProps);
        });
    });
});
