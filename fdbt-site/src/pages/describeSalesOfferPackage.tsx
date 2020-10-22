import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { CustomAppProps, NextPageContextWithSession } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { SOP_ATTRIBUTE, SOP_INFO_ATTRIBUTE } from '../constants';
import { SalesOfferPackage, SalesOfferPackageWithErrors } from './api/describeSalesOfferPackage';
import { getSessionAttribute } from '../utils/sessions';
import SalesOfferPackageExplanation from '../components/SalesOfferPackageExplanation';
import { SalesOfferPackageInfo } from './api/salesOfferPackages';

const title = 'Sales Offer Package Description - Create Fares Data Service';
const description = 'Sales Offer Package Description page of the Create Fares Data Service';

interface DescribeSopProps {
    sopInfo: SalesOfferPackageInfo | SalesOfferPackageWithErrors | undefined;
}

export const isSalesOfferPackageWithErrors = (
    salesOfferPackage: SalesOfferPackage | SalesOfferPackageInfo | SalesOfferPackageWithErrors,
): salesOfferPackage is SalesOfferPackageWithErrors =>
    (salesOfferPackage as SalesOfferPackageWithErrors)?.errors?.length > 0;

const DescribeSOP = ({ sopInfo, csrfToken }: DescribeSopProps & CustomAppProps): ReactElement => {
    const sopNameError =
        sopInfo && isSalesOfferPackageWithErrors(sopInfo)
            ? sopInfo.errors.find(error => error.id === 'sop-name')
            : undefined;
    const sopDescriptionError =
        sopInfo && isSalesOfferPackageWithErrors(sopInfo)
            ? sopInfo.errors.find(error => error.id === 'sop-description')
            : undefined;
    const errors = sopInfo && isSalesOfferPackageWithErrors(sopInfo) ? sopInfo.errors : [];
    return (
        <BaseLayout title={title} description={description} errors={errors}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <CsrfForm action="/api/describeSalesOfferPackage" method="post" csrfToken={csrfToken}>
                        <>
                            <ErrorSummary errors={errors} />
                            <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
                                <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                        <h1 className="govuk-fieldset__heading" id="page-heading">
                                            Describe your sales offer package
                                        </h1>
                                    </legend>
                                    <span className="govuk-hint" id="describe-sop-hint">
                                        Enter a name and description for your sales offer package that means something
                                        to you. This will be displayed back to you when you choose from your saved sales
                                        offer packages.
                                    </span>
                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="sop-name">
                                            Name
                                        </label>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId={sopNameError ? sopNameError.id : ''}
                                            errorClass="govuk-input--error"
                                        >
                                            <input
                                                className="govuk-input"
                                                id="sop-name"
                                                name="salesOfferPackageName"
                                                type="text"
                                                defaultValue={
                                                    sopInfo && isSalesOfferPackageWithErrors(sopInfo)
                                                        ? sopInfo.name
                                                        : ''
                                                }
                                                aria-describedby="describe-sop-hint"
                                            />
                                        </FormElementWrapper>
                                    </div>
                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="sop-description">
                                            Description
                                        </label>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId={sopDescriptionError ? sopDescriptionError.id : ''}
                                            errorClass="govuk-textarea--error"
                                        >
                                            <textarea
                                                className="govuk-textarea"
                                                id="sop-description"
                                                name="salesOfferPackageDescription"
                                                rows={4}
                                                aria-describedby="describe-sop-hint"
                                            />
                                        </FormElementWrapper>
                                    </div>
                                </fieldset>
                            </div>
                            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                        </>
                    </CsrfForm>
                </div>
                <div className="govuk-grid-column-one-third">
                    <SalesOfferPackageExplanation />
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: DescribeSopProps } => {
    const salesOfferPackageInfo = getSessionAttribute(ctx.req, SOP_INFO_ATTRIBUTE);
    const salesOfferPackage = getSessionAttribute(ctx.req, SOP_ATTRIBUTE);
    return {
        props: {
            sopInfo:
                salesOfferPackage && isSalesOfferPackageWithErrors(salesOfferPackage)
                    ? salesOfferPackage
                    : salesOfferPackageInfo,
        },
    };
};

export default DescribeSOP;
