import React, { FunctionComponent, ReactElement, useState } from 'react';
import { getSalesOfferPackagesByNocCode } from '../data/auroradb';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { formatSOPArray, getAndValidateNoc, getCsrfToken } from '../utils';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';
import { sopTicketFormatConverter } from './salesConfirmation';
import { VIEW_PURCHASE_METHOD } from '../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { FromDb, SalesOfferPackage } from '../interfaces/matchingJsonTypes';
import PurchaseMethodCard from '../components/PurchaseMethodCard';
import { BaseLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import SubNavigation from '../layout/SubNavigation';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';

const title = 'Purchase methods';
const description =
    'Define the way your tickets are sold, including where they are bought, the payment method and format';

interface PurchaseMethodProps {
    csrfToken: string;
    purchaseMethods: FromDb<SalesOfferPackage>[];
    cappedPurchaseMethods: FromDb<SalesOfferPackage>[];
    referer: string | null;
    viewPurchaseMethodErrors: ErrorInfo[];
}

const ViewPurchaseMethods = ({
    purchaseMethods,
    cappedPurchaseMethods,
    referer,
    csrfToken,
    viewPurchaseMethodErrors,
}: PurchaseMethodProps): ReactElement => {
    const [popUpState, setPopUpState] = useState<{ entityId: number; entityName: string }>();

    const deleteActionHandler = (id: number, name: string): void => {
        setPopUpState({ entityId: id, entityName: name });
    };

    const cancelActionHandler = (): void => {
        setPopUpState(undefined);
    };

    const buildDeleteUrl = (isGroup: boolean, idToDelete: number, csrfToken: string): string => {
        return `/api/deletePassenger?id=${idToDelete}&isGroup=${isGroup}&_csrf=${csrfToken}`;
    };

    return (
        <>
            <BaseLayout title={title} description={description} showNavigation referer={referer}>
                <div>
                    <ErrorSummary errors={viewPurchaseMethodErrors} />
                </div>
                <div className="govuk-grid-row" data-card-count={purchaseMethods.length + cappedPurchaseMethods.length}>
                    <div className="govuk-grid-column-one-quarter">
                        <SubNavigation />
                    </div>

                    <div className="govuk-grid-column-three-quarters">
                        <h1 className="govuk-heading-xl">Purchase methods</h1>
                        <p className="govuk-body govuk-!-margin-bottom-8">
                            Define the way your tickets are sold, including where they are bought, the payment method
                            and format
                        </p>

                        <div>
                            {!purchaseMethods.length ? (
                                <NoPurchaseMethods title="Purchase methods" />
                            ) : (
                                <PurchaseMethods
                                    title="Normal purchase methods"
                                    purchaseMethods={purchaseMethods}
                                    deleteActionHandler={deleteActionHandler}
                                />
                            )}

                            <a className="govuk-button" data-module="govuk-button" href="/managePurchaseMethod">
                                Add a purchase method
                            </a>
                        </div>

                        <div className="govuk-!-margin-top-4">
                            {!cappedPurchaseMethods.length ? (
                                <NoPurchaseMethods title="Capped purchase methods" />
                            ) : (
                                <PurchaseMethods
                                    title="Capped purchase methods"
                                    deleteActionHandler={deleteActionHandler}
                                    purchaseMethods={cappedPurchaseMethods}
                                />
                            )}

                            <a
                                className="govuk-button"
                                data-module="govuk-button"
                                href="/managePurchaseMethod?capped=true"
                            >
                                Add a purchase method
                            </a>
                        </div>

                        {popUpState && (
                            <DeleteConfirmationPopup
                                entityName={popUpState.entityName}
                                deleteUrl={buildDeleteUrl(true, popUpState.entityId, csrfToken)}
                                cancelActionHandler={cancelActionHandler}
                            />
                        )}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

interface NoPurchaseMethodsProps {
    title: string;
}
const NoPurchaseMethods = ({ title }: NoPurchaseMethodsProps): ReactElement => {
    return (
        <>
            <h2 className="govuk-heading-l">{title}</h2>
            <p className="govuk-body">
                <em>You currently have no purchase methods saved.</em>
            </p>
        </>
    );
};

interface PurchaseMethodsProps {
    purchaseMethods: FromDb<SalesOfferPackage>[];
    title: string;
    deleteActionHandler: (id: number, name: string, isCapped: boolean) => void;
}

const PurchaseMethods = ({ purchaseMethods, title, deleteActionHandler }: PurchaseMethodsProps): ReactElement => {
    return (
        <>
            <h2 className="govuk-heading-l">{title}</h2>

            <div className="card-row">
                {purchaseMethods.map((purchaseMethod, index) => (
                    <PurchaseMethodCard
                        sop={purchaseMethod}
                        isCapped={false}
                        index={index}
                        deleteActionHandler={deleteActionHandler}
                        key={index}
                    />
                ))}
            </div>
        </>
    );
};
export const PurchaseMethodCardBody: FunctionComponent<{ entity: FromDb<SalesOfferPackage> }> = ({
    entity: { name, purchaseLocations, paymentMethods, ticketFormats },
}: {
    entity: SalesOfferPackage;
}) => (
    <>
        <h4 className="govuk-heading-m govuk-!-padding-bottom-6">{name}</h4>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Purchase locations:</span> {formatSOPArray(purchaseLocations)}
        </p>
        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Payment methods:</span> {formatSOPArray(paymentMethods)}
        </p>
        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Ticket formats:</span> {sopTicketFormatConverter(ticketFormats)}
        </p>
    </>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PurchaseMethodProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const purchaseMethods = await getSalesOfferPackagesByNocCode(nationalOperatorCode);
    const viewPurchaseMethod = getSessionAttribute(ctx.req, VIEW_PURCHASE_METHOD);

    updateSessionAttribute(ctx.req, VIEW_PURCHASE_METHOD, undefined);

    return {
        props: {
            purchaseMethods: purchaseMethods.filter((purchaseMethod) => !purchaseMethod.isCapped),
            cappedPurchaseMethods: purchaseMethods.filter((purchaseMethod) => purchaseMethod.isCapped),
            referer: extractGlobalSettingsReferer(ctx),
            csrfToken,
            viewPurchaseMethodErrors: viewPurchaseMethod || [],
        },
    };
};

export default ViewPurchaseMethods;
