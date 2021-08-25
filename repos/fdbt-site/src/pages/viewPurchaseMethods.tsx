import React, { FunctionComponent, ReactElement } from 'react';
import { FromDb, SalesOfferPackage } from '../../shared/matchingJsonTypes';
import { GlobalSettingsViewPage } from '../components/GlobalSettingsViewPage';
import { getSalesOfferPackagesByNocCode } from '../data/auroradb';
import { NextPageContextWithSession } from '../interfaces';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';
import { sopTicketFormatConverter } from './salesConfirmation';
import { formatSOPArray } from './selectSalesOfferPackage';

const title = 'Purchase methods';
const description =
    'Define the way your tickets are sold, including where they are bought, the payment method and format';

interface PurchaseMethodProps {
    csrfToken: string;
    purchaseMethods: FromDb<SalesOfferPackage>[];
    referer: string | null;
}

const ViewPurchaseMethods = ({ purchaseMethods, referer, csrfToken }: PurchaseMethodProps): ReactElement => {
    return (
        <>
            <GlobalSettingsViewPage
                entities={purchaseMethods}
                entityDescription="purchase method"
                referer={referer}
                csrfToken={csrfToken}
                title={title}
                description={description}
                CardBody={PurchaseMethod}
            />
        </>
    );
};

export const PurchaseMethod: FunctionComponent<{ entity: FromDb<SalesOfferPackage> }> = ({
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

    return { props: { purchaseMethods: purchaseMethods, referer: extractGlobalSettingsReferer(ctx), csrfToken } };
};

export default ViewPurchaseMethods;
