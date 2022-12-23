import React, { ReactElement, useState } from 'react';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
import { getProductGroupsByNoc } from '../data/auroradb';
import { NextPageContextWithSession, ErrorInfo, GroupOfProducts } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, VIEW_PRODUCT_GROUP } from '../constants/attributes';
import ErrorSummary from '../components/ErrorSummary';
import { FromDb } from '../interfaces/matchingJsonTypes';
import ProductGroupCard from '../components/ProductGroupCard';

const title = 'Product Groups - Create Fares Data Service';
const description = 'View and edit product group page for the Create Fares Data Service';

interface viewProductGroupsProps {
    csrfToken: string;
    productGroups: FromDb<GroupOfProducts>[];
    referer: string | null;
    viewProductGroupErrors: ErrorInfo[];
}

const viewProductGroups = ({
    productGroups,
    csrfToken,
    referer,
    viewProductGroupErrors,
}: viewProductGroupsProps): ReactElement => {
    const [popUpState, setPopUpState] = useState<{
        productGroupName: string;
        productGroupId: number;
    }>();

    const deleteActionHandler = (id: number, name: string): void => {
        setPopUpState({
            ...popUpState,
            productGroupName: name,
            productGroupId: id,
        });
    };

    const cancelActionHandler = (): void => {
        setPopUpState(undefined);
    };

    const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
        return `/api/deleteProductGroup?id=${idToDelete}&_csrf=${csrfToken}`;
    };

    return (
        <BaseLayout title={title} description={description} showNavigation referer={referer}>
            <div>
                <ErrorSummary errors={viewProductGroupErrors} />
            </div>
            <div
                className="govuk-grid-row"
                data-card-count={productGroups.length}
                product-groups={productGroups.map((element) => element.name).toString()}
            >
                <div className="govuk-grid-column-one-quarter">
                    <SubNavigation />
                </div>

                <div className="govuk-grid-column-three-quarters">
                    <h1 className="govuk-heading-xl">Product Groups</h1>
                    <p className="govuk-body govuk-!-margin-bottom-8">
                        Define a group of products for use in a capped product
                    </p>

                    <div>
                        {!productGroups.length ? (
                            <>
                                <NoProductGroups />
                                <a
                                    className="govuk-button govuk-button"
                                    data-module="govuk-button"
                                    href="/manageProductGroup"
                                    aria-disabled
                                >
                                    Add a product group
                                </a>
                            </>
                        ) : (
                            <div>
                                <div className="card-row">
                                    {productGroups.map((productGroup, index) => (
                                        <>
                                            <ProductGroupCard
                                                index={index}
                                                groupDetails={productGroup}
                                                key={productGroup.id.toString()}
                                                defaultChecked={false}
                                                deleteActionHandler={deleteActionHandler}
                                            />
                                        </>
                                    ))}
                                </div>
                                <a className="govuk-button" data-module="govuk-button" href="/manageProductGroup">
                                    Add a product group
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {popUpState && (
                    <DeleteConfirmationPopup
                        entityName={popUpState.productGroupName}
                        deleteUrl={buildDeleteUrl(popUpState.productGroupId, csrfToken)}
                        cancelActionHandler={cancelActionHandler}
                    />
                )}
            </div>
        </BaseLayout>
    );
};

const NoProductGroups = (): ReactElement => {
    return (
        <>
            <p className="govuk-body">
                <em>You currently have no product groups saved.</em>
            </p>
        </>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: viewProductGroupsProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nocCode = getAndValidateNoc(ctx);
    const productGroups = await getProductGroupsByNoc(nocCode);
    const viewProductGroup = getSessionAttribute(ctx.req, VIEW_PRODUCT_GROUP);

    updateSessionAttribute(ctx.req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, undefined);
    updateSessionAttribute(ctx.req, VIEW_PRODUCT_GROUP, undefined);

    return {
        props: {
            csrfToken,
            productGroups,
            referer: extractGlobalSettingsReferer(ctx),
            viewProductGroupErrors: viewProductGroup || [],
        },
    };
};

export default viewProductGroups;
