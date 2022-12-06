import React, { ReactElement } from 'react';
import { getProductGroupsByNoc } from 'src/data/auroradb';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import ProductsGroupCard from '../components/ProductGroupCard';
import { CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, GroupOfProducts, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Select capped products group - Create Fares Data Service';
const description = 'Capped products group selection page of the Create Fares Data Service';

interface SelectCappedProductGroupProps {
    errors: ErrorInfo[];
    csrfToken: string;
    savedGroups: GroupOfProducts[];
    selectedId: number | null;
}

const SelectPassengerType = ({
    errors = [],
    csrfToken,
    savedGroups,
    selectedId,
}: SelectCappedProductGroupProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/selectCappedProductGroup" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="select-capped-products-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="select-capped-products-page-heading">
                                Select a group of products
                            </h1>
                        </legend>

                        <div className="govuk-warning-text">
                            <span className="govuk-warning-text__icon govuk-!-margin-top-1" aria-hidden="true">
                                !
                            </span>
                            <strong className="govuk-warning-text__text">
                                <span className="govuk-warning-text__assistive">Warning</span>
                                You can create groups of capped products in your{' '}
                                <a className="govuk-link" href="/viewProductGroups">
                                    operator settings.
                                </a>{' '}
                                <br />
                                Don&apos;t worry you can navigate back to this page when you are finished.
                            </strong>
                        </div>

                        {savedGroups.length === 0 ? (
                            <>
                                <span className="govuk-body">
                                    <i>You currently have no saved capped product groups</i>
                                </span>
                            </>
                        ) : (
                            <>
                                <h3 className="govuk-heading-m">Product groups</h3>

                                <div className="card-row" id="product-groups">
                                    {savedGroups.map((savedGroup, index) => (
                                        <ProductsGroupCard
                                            key={savedGroup.name}
                                            defaultChecked={selectedId === savedGroup.id}
                                            index={index}
                                            groupDetails={savedGroup}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </fieldset>
                </div>
                {!!savedGroups.length && (
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-!-margin-right-2"
                    />
                )}
                <a className="govuk-button govuk-button--secondary" href="/viewGroupsOfProducts">
                    Create new
                </a>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: SelectCappedProductGroupProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const groupOfProductsAttribute = getSessionAttribute(ctx.req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE);
    const errors =
        !!groupOfProductsAttribute && !(typeof groupOfProductsAttribute === 'string') ? [groupOfProductsAttribute] : [];

    const nocCode = getAndValidateNoc(ctx);
    const savedGroups = await getProductGroupsByNoc(nocCode);
    return {
        props: {
            errors,
            csrfToken,
            savedGroups,
            selectedId: null,
        },
    };
};

export default SelectPassengerType;
