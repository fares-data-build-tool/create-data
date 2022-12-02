import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import ExpirySelector from '../../src/components/ExpirySelector';
import { getSessionAttribute } from '../../src/utils/sessions';
import { EDIT_PERIOD_DURATION_ERROR, MATCHING_JSON_ATTRIBUTE } from '../../src/constants/attributes';
import { ExpiryUnit } from '../../src/interfaces/matchingJsonTypes';

const title = 'Edit Period Duration - Create Fares Data Service';
const description = 'Edit Period Duration page of the Create Fares Data Service';

interface EditPeriodDurationProps {
    errors?: ErrorInfo[];
    csrfToken: string;
    productDurationValue: string;
    productDurationUnit: string;
}

const EditPeriodDuration = ({
    errors = [],
    csrfToken,
    productDurationValue,
    productDurationUnit,
}: EditPeriodDurationProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/editPeriodDuration" method="post" csrfToken={csrfToken}>
                <div className="govuk-form-group">
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="multiple-product-page-heading">
                        Edit Period Duration
                    </h1>

                    <>
                        <label className="govuk-label" htmlFor="product-details-period-duration">
                            Period duration
                        </label>
                        <span className="govuk-hint" id="product-period-duration-hint">
                            For example, 3 days
                        </span>
                    </>
                    <ExpirySelector
                        defaultDuration={productDurationValue || undefined}
                        defaultUnit={(productDurationUnit as ExpiryUnit) || undefined}
                        quantityName={'multipleProductDurationInput'}
                        quantityId={'product-details-period-duration-quantity'}
                        hintId="product-period-duration-hint"
                        unitName={'multipleProductDurationUnitsInput'}
                        unitId={`product-details-period-duration-unit`}
                        carnet={false}
                        errors={errors}
                        school={false}
                        hideFormGroupError
                    />
                    <br />
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </div>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: EditPeriodDurationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const errors = getSessionAttribute(ctx.req, EDIT_PERIOD_DURATION_ERROR);

    let productDuration = '';
    if (ticket) {
        const product = ticket.products[0];

        if ('productDuration' in product) {
            productDuration = product.productDuration;
        }
    }
    const productDurationSplit = productDuration.split(' ');
    const productDurationValue = productDurationSplit[0];
    const productDurationUnit = productDurationSplit[1];
    return {
        props: {
            errors: errors || [],
            csrfToken,
            productDurationValue: productDurationValue,
            productDurationUnit: productDurationUnit,
        },
    };
};

export default EditPeriodDuration;
