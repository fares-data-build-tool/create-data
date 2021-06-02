import React, { ReactElement } from 'react';
import { isArray, upperFirst } from 'lodash';
import moment from 'moment';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, PRODUCT_DATE_ATTRIBUTE } from '../constants/attributes';
import {
    NextPageContextWithSession,
    SalesOfferPackage,
    ProductWithSalesOfferPackages,
    TicketPeriodWithInput,
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
    productDates: TicketPeriodWithInput;
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
                href: 'selectSalesOfferPackage',
            });
            product.salesOfferPackages.forEach(sop => {
                confirmationElements.push({
                    name: `${upperFirst(product.productName)} - Sales offer package`,
                    content: sop.name,
                    href: 'selectSalesOfferPackage',
                });
            });
        });
    } else {
        salesOfferPackages.forEach((sop, index) => {
            confirmationElements.push({
                name: `Sales offer package ${index + 1} - ${sop.name}`,
                content: sop.description || sop.name,
                href: 'selectSalesOfferPackage',
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
    let dateInput = {
        startDateDay: '',
        startDateMonth: '',
        startDateYear: '',
        endDateDay: '',
        endDateMonth: '',
        endDateYear: '',
    };
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
    } else {
        if (ticketDatingInfo.startDate) {
            startDate = ticketDatingInfo.startDate;
        } else {
            startDefault = true;
            startDate = moment()
                .add(1, 'hours')
                .toISOString();
        }
        if (ticketDatingInfo.endDate) {
            endDate = ticketDatingInfo.endDate;
        } else {
            endDefault = true;
            endDate = moment()
                .add(100, 'y')
                .toISOString();
        }
        dateInput = ticketDatingInfo.dateInput;
    }

    return {
        props: {
            salesOfferPackages: salesOfferPackageInfo,
            ticketDating: {
                productDates: {
                    startDate,
                    endDate,
                    dateInput,
                },
                startDefault,
                endDefault,
            },
            csrfToken,
        },
    };
};

export default SalesConfirmation;
