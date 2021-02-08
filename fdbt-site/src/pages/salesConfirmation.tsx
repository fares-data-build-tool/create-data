import React, { ReactElement } from 'react';
import { isArray, upperFirst } from 'lodash';
import moment from 'moment';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, PRODUCT_DATE_ATTRIBUTE } from '../constants';
import {
    NextPageContextWithSession,
    SalesOfferPackage,
    ProductWithSalesOfferPackages,
    TicketPeriod,
    ConfirmationElement,
} from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isProductWithSalesOfferPackages, isTicketPeriodAttributeWithErrors } from '../interfaces/typeGuards';
import { getCsrfToken } from '../utils';
import { redirectTo } from './api/apiUtils';

const title = 'Sales Confirmation - Create Fares Data Service';
const description = 'Sales Confirmation page of the Create Fares Data Service';

interface SalesConfirmationProps {
    salesOfferPackages: SalesOfferPackage[] | ProductWithSalesOfferPackages[];
    ticketDating: TicketDating;
    csrfToken: string;
}

interface TicketDating {
    productDates: TicketPeriod;
    startDefault: boolean;
    endDefault: boolean;
}

export const buildSalesConfirmationElements = (
    salesOfferPackages: SalesOfferPackage[] | ProductWithSalesOfferPackages[],
    ticketDating: TicketDating,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];
    if (isProductWithSalesOfferPackages(salesOfferPackages)) {
        salesOfferPackages.forEach(product => {
            confirmationElements.push({
                name: 'Product',
                content: upperFirst(product.productName),
                href: 'selectSalesOfferPackages',
            });
            product.salesOfferPackages.forEach(sop => {
                confirmationElements.push({
                    name: `${upperFirst(product.productName)} - Sales offer package`,
                    content: sop.name,
                    href: 'selectSalesOfferPackages',
                });
            });
        });
    } else {
        salesOfferPackages.forEach((sop, index) => {
            confirmationElements.push({
                name: `Sales offer package ${index + 1} - ${sop.name}`,
                content: sop.description || sop.name,
                href: 'selectSalesOfferPackages',
            });
        });
    }
    const startDate = moment(ticketDating.productDates.startDate).format('DD-MM-YYYY');
    const endDate = moment(ticketDating.productDates.endDate).format('DD-MM-YYYY');

    confirmationElements.push(
        {
            name: `Ticket start date ${ticketDating.startDefault ? '(default)' : ''}`,
            content: startDate,
            href: 'productDateInformation',
        },
        {
            name: `Ticket end date ${ticketDating.endDefault ? '(default)' : ''}`,
            content: endDate,
            href: 'productDateInformation',
        },
    );
    return confirmationElements;
};

const SalesConfirmation = ({ csrfToken, salesOfferPackages, ticketDating }: SalesConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/salesConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your sales information answers before submitting</h1>
                <ConfirmationTable
                    header="Sales Information"
                    confirmationElements={buildSalesConfirmationElements(salesOfferPackages, ticketDating)}
                />
                <h2 className="govuk-heading-m">Now submit your data for NeTEx creation</h2>

                <p className="govuk-body">
                    By submitting this data you are confirming that, to the best of your knowledge, the details you are
                    providing are correct.
                </p>
                <input type="submit" value="Submit" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SalesConfirmationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const salesOfferPackageInfo = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const ticketDatingInfo = getSessionAttribute(ctx.req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !salesOfferPackageInfo ||
        !isArray(salesOfferPackageInfo) ||
        isTicketPeriodAttributeWithErrors(ticketDatingInfo)
    ) {
        if (ctx.res) {
            redirectTo(ctx.res, '/home');
        }

        throw new Error('User has reached confirmation page with incorrect sales info.');
    }

    let startDate = '';
    let endDate = '';
    let startDefault = false;
    let endDefault = false;

    if (!ticketDatingInfo) {
        startDate = moment()
            .add(1, 'hours')
            .toISOString();
        endDate = moment()
            .add(100, 'y')
            .toISOString();
        startDefault = true;
        endDefault = true;
    } else if (!ticketDatingInfo.startDate || !ticketDatingInfo.endDate) {
        if (!ticketDatingInfo.startDate) {
            startDefault = true;
            startDate = moment()
                .add(1, 'hours')
                .toISOString();
        } else {
            startDate = ticketDatingInfo.startDate;
        }
        if (!ticketDatingInfo.endDate) {
            endDefault = true;
            endDate = moment()
                .add(100, 'y')
                .toISOString();
        } else {
            endDate = ticketDatingInfo.endDate;
        }
    } else {
        startDate = ticketDatingInfo.startDate;
        endDate = ticketDatingInfo.endDate;
    }

    return {
        props: {
            salesOfferPackages: salesOfferPackageInfo,
            ticketDating: {
                productDates: {
                    startDate,
                    endDate,
                },
                startDefault,
                endDefault,
            },
            csrfToken,
        },
    };
};

export default SalesConfirmation;
