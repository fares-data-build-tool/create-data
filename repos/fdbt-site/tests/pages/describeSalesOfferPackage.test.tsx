import { shallow } from 'enzyme';
import React from 'react';
import DescribeSalesOfferPackage, { getServerSideProps } from '../../src/pages/describeSalesOfferPackage';
import { SalesOfferPackageInfo } from '../../src/pages/api/salesOfferPackages';
import { getMockContext } from '../testData/mockData';
import { SOP_INFO_ATTRIBUTE, SOP_ATTRIBUTE } from '../../src/constants';
import { SalesOfferPackage, SalesOfferPackageWithErrors } from '../../src/pages/api/describeSalesOfferPackage';
import { ErrorInfo } from '../../src/interfaces';

describe('describeSalesOfferPackage', () => {
    const mockError: ErrorInfo = expect.objectContaining({ errorMessage: expect.any(String), id: expect.any(String) });

    const mockSopInfoAttribute: SalesOfferPackageInfo = {
        purchaseLocations: ['OnBus', 'Shop', 'Mobile'],
        paymentMethods: ['Card', 'Cash'],
        ticketFormats: ['Paper', 'Mobile'],
    };
    const mockSopAttributeWithErrors: SalesOfferPackageWithErrors = {
        ...mockSopInfoAttribute,
        name: '',
        description: 'This is a sales offer package',
        errors: [mockError],
    };

    it('should render the page with no errors when no errors are present', () => {
        const tree = shallow(<DescribeSalesOfferPackage sopInfo={mockSopInfoAttribute} csrfToken="" />);
        expect(tree).toMatchSnapshot();
    });

    it('should render the page with errors when errors are present', () => {
        const tree = shallow(<DescribeSalesOfferPackage sopInfo={mockSopAttributeWithErrors} csrfToken="" />);
        expect(tree).toMatchSnapshot();
    });

    it('should be able to handle being passed undefined props', () => {
        const tree = shallow(<DescribeSalesOfferPackage sopInfo={undefined} csrfToken="" />);
        expect(tree).toMatchSnapshot();
    });

    describe('getServerSideProps', () => {
        it('should return props with no errors when only SOP_INFO_ATTRIBUTE is present', () => {
            const ctx = getMockContext({
                session: {
                    [SOP_INFO_ATTRIBUTE]: mockSopInfoAttribute,
                },
            });
            const expectedProps = {
                props: {
                    sopInfo: mockSopInfoAttribute,
                    csrfToken: '',
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps).toEqual(expectedProps);
        });
        it('should return props based on SOP_INFO_ATTRIBUTE when both SOP_INFO_ATTRIBUTE and SOP_ATTRIBUTE are present, but SOP_ATTRIBUTE contains no errors', () => {
            const sopAttribute: SalesOfferPackage = {
                ...mockSopInfoAttribute,
                name: 'Sales Offer Package',
                description: 'This is a sales offer package',
            };
            const ctx = getMockContext({
                session: {
                    [SOP_INFO_ATTRIBUTE]: mockSopInfoAttribute,
                    [SOP_ATTRIBUTE]: sopAttribute,
                },
            });
            const expectedProps = {
                props: {
                    sopInfo: mockSopInfoAttribute,
                    csrfToken: '',
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps).toEqual(expectedProps);
        });
        it('should return props with errors based on SOP_ATTRIBUTE when both SOP_INFO_ATTRIBUTE and SOP_ATTRIBUTE are present, but SOP_ATTRIBUTE contains errors', () => {
            const ctx = getMockContext({
                session: {
                    [SOP_INFO_ATTRIBUTE]: mockSopInfoAttribute,
                    [SOP_ATTRIBUTE]: mockSopAttributeWithErrors,
                },
            });
            const expectedProps = {
                props: {
                    sopInfo: mockSopAttributeWithErrors,
                    csrfToken: '',
                },
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps).toEqual(expectedProps);
        });
    });
});
