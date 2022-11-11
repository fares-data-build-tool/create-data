import React, { ReactElement } from 'react';
import { isArray, upperFirst } from 'lodash';
import moment from 'moment';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, PRODUCT_DATE_ATTRIBUTE, FARE_TYPE_ATTRIBUTE } from '../constants/attributes';
import { NextPageContextWithSession, ProductWithSalesOfferPackages, ConfirmationElement } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute, getRequiredSessionAttribute } from '../utils/sessions';
import { isProductWithSalesOfferPackages, isTicketPeriodAttributeWithErrors } from '../interfaces/typeGuards';
import { formatSOPArray, getCsrfToken } from '../utils';
import { ticketFormatsList } from './managePurchaseMethod';
import { GetServerSidePropsResult } from 'next';
import { SalesOfferPackage } from '../interfaces/matchingJsonTypes';

const title = 'Sales Confirmation - Create Fares Data Service';
const description = 'Sales Confirmation page of the Create Fares Data Service';

export interface SalesConfirmationProps {
    salesOfferPackages: SalesOfferPackage[] | ProductWithSalesOfferPackages[];
    csrfToken: string;
    startDate: string;
    endDate: string | null;
}

export const sopTicketFormatConverter = (enumerations: string[]): string => {
    return enumerations
        .map(
            (enumeration) =>
                ticketFormatsList.ticketFormats.find((ticketFormat) => ticketFormat.value === enumeration)?.display ||
                '',
        )
        .join(', ');
};

export const buildSalesConfirmationElements = (
    salesOfferPackages: SalesOfferPackage[] | ProductWithSalesOfferPackages[],
    startDateIn: string,
    endDateIn: string | null,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];
    if (isProductWithSalesOfferPackages(salesOfferPackages)) {
        salesOfferPackages.forEach((product) => {
            confirmationElements.push({
                name: 'Product',
                content: upperFirst(product.productName),
                href: 'selectPurchaseMethods',
            });
            product.salesOfferPackages.forEach((sop) => {
                confirmationElements.push({
                    name: `Sales offer package`,
                    content: [
                        `Name: ${sop.name}`,
                        ...(sop.price ? [`Price: £${sop.price}`] : []),
                        `Purchase location: ${formatSOPArray(sop.purchaseLocations)}`,
                        `Payment method(s): ${formatSOPArray(sop.paymentMethods)}`,
                        `Ticket formats: ${sopTicketFormatConverter(sop.ticketFormats)}`,
                    ],
                    href: 'selectPurchaseMethods',
                });
            });
        });
    } else {
        salesOfferPackages.forEach((sop, index) => {
            confirmationElements.push({
                name: `Sales offer package ${index + 1} - ${sop.name}`,
                content: sop.description || sop.name,
                href: 'selectPurchaseMethods',
            });
        });
    }
    const startDate = moment(startDateIn).format('DD-MM-YYYY');
    const endDate = endDateIn && moment(endDateIn).format('DD-MM-YYYY');

    confirmationElements.push(
        {
            name: `Ticket start date`,
            content: startDate,
            href: 'productDateInformation',
        },
        {
            name: `Ticket end date`,
            content: endDate || '-',
            href: 'productDateInformation',
        },
    );
    return confirmationElements;
};

const SalesConfirmation = ({
    csrfToken,
    salesOfferPackages,
    startDate,
    endDate,
}: SalesConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/salesConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your sales information answers before submitting</h1>
                <ConfirmationTable
                    header="Sales Information"
                    confirmationElements={buildSalesConfirmationElements(salesOfferPackages, startDate, endDate)}
                />
                <h2 className="govuk-heading-m">Now submit your data to create the product</h2>

                <p className="govuk-body">
                    By submitting this data you are confirming that, to the best of your knowledge, the details you are
                    providing are correct.
                </p>
                <input type="submit" value="Accept and submit" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (
    ctx: NextPageContextWithSession,
): GetServerSidePropsResult<SalesConfirmationProps> => {
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    if (!fareTypeAttribute) {
        return { redirect: { destination: '/home', permanent: false } };
    }
    const csrfToken = getCsrfToken(ctx);
    const salesOfferPackageInfo = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const ticketDatingInfo = getRequiredSessionAttribute(ctx.req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !salesOfferPackageInfo ||
        !isArray(salesOfferPackageInfo) ||
        isTicketPeriodAttributeWithErrors(ticketDatingInfo)
    ) {
        throw new Error('User has reached confirmation page with incorrect sales info.');
    }

    return {
        props: {
            salesOfferPackages: salesOfferPackageInfo,
            startDate: ticketDatingInfo.startDate,
            endDate: ticketDatingInfo.endDate ?? null,
            csrfToken,
        },
    };
};

export default SalesConfirmation;
