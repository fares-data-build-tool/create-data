import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { exportEnabled, myFaresEnabled } from '../../constants/featureFlag';
import { getAndValidateNoc, getCsrfToken } from '../../utils';
import { getS3FolderCount, getS3Exports, retrieveAndZipExportedNetexForNoc, getNetexSignedUrl } from '../../data/s3';
import { redirectTo } from '../../utils/apiUtils';
import { MATCHING_DATA_BUCKET_NAME, NETEX_BUCKET_NAME } from '../../constants';
import CsrfForm from '../../components/CsrfForm';
import { getAllProducts } from '../../data/auroradb';

const title = 'Exports';
const description = 'View and access your settings in one place.';

interface GlobalSettingsProps {
    exports: {
        matchingDataCount: number;
        name: string;
        netexCount: number;
        signedUrl: string | null;
        exportDate: string;
        exportTime: string;
    }[];
    csrf: string;
    myFaresEnabled: boolean;
    exportEnabled: boolean;
    operatorHasProducts: boolean;
}

const Exports = ({
    exports,
    csrf,
    myFaresEnabled,
    exportEnabled,
    operatorHasProducts,
}: GlobalSettingsProps): ReactElement => {
    return (
        <>
            <BaseLayout
                title={title}
                description={description}
                showNavigation
                myFaresEnabled={myFaresEnabled}
                exportEnabled={exportEnabled}
            >
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="dft-flex dft-flex-justify-space-between">
                            <h1 className="govuk-heading-m">Export your data</h1>{' '}
                            <CsrfForm csrfToken={csrf} method={'post'} action={'/api/exports'}>
                                {operatorHasProducts && (
                                    <button type="submit" className="govuk-button">
                                        Export all fares
                                    </button>
                                )}
                            </CsrfForm>
                        </div>
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <p className="govuk-body-m govuk-!-margin-bottom-6">
                                    This will export all of your current active products and any pending products. Any
                                    products flagged with ‘Needs Attention’ will be exported but may not be correct.
                                    Expired products or products for expired services, will not be included in the
                                    export. Once your export is complete, it will appear in the list below and you can
                                    download this and upload it to{' '}
                                    <a href="https://publish.bus-data.dft.gov.uk/">BODS</a>.
                                </p>
                            </div>
                        </div>

                        <h1 className="govuk-heading-m"> Previously exported fares</h1>
                        <table className="govuk-table">
                            <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                    <th scope="col" className="govuk-table__header">
                                        Export name
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        Export date
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        Export time
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        Export status
                                    </th>
                                    <th scope="col" className="govuk-table__header"></th>
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {exports.map((exportDetails) => (
                                    <tr className="govuk-table__row" key={exportDetails.name}>
                                        <td className="govuk-table__cell">{exportDetails.name}</td>
                                        <td className="govuk-table__cell">{exportDetails.exportDate}</td>
                                        <td className="govuk-table__cell">{exportDetails.exportTime}</td>
                                        <td className="govuk-table__cell">
                                            {exportDetails.netexCount === exportDetails.matchingDataCount ? (
                                                <strong className="govuk-tag govuk-tag--green">Complete</strong>
                                            ) : (
                                                <strong className="govuk-tag govuk-tag--blue">In Progress</strong>
                                            )}
                                        </td>
                                        <td className="govuk-table__cell">
                                            {exportDetails.signedUrl ? (
                                                <a href={exportDetails.signedUrl}>Download file</a>
                                            ) : (
                                                <p>Download file not ready</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: GlobalSettingsProps }> => {
    const noc = getAndValidateNoc(ctx);

    if (!exportEnabled && ctx.res) {
        redirectTo(ctx.res, '/home');
    }

    const exportNames = await getS3Exports(noc);

    const exports = await Promise.all(
        exportNames.map(async (it) => {
            const prefix = `${noc}/exports/${it}/`;
            const matchingDataCount = await getS3FolderCount(MATCHING_DATA_BUCKET_NAME, prefix);
            const exportDate = '14 Sep 2021';
            const exportTime = '10:37';

            const netexCount = await getS3FolderCount(NETEX_BUCKET_NAME, prefix);

            const complete = matchingDataCount === netexCount;

            let signedUrl: string | null = null;
            if (complete) {
                const zipKey = await retrieveAndZipExportedNetexForNoc(noc, it);
                signedUrl = await getNetexSignedUrl(zipKey || '');
            }

            return { name: it, matchingDataCount, netexCount, signedUrl, exportDate, exportTime };
        }),
    );

    const operatorHasProducts = (await getAllProducts(noc)).length > 0;

    return {
        props: {
            exports,
            csrf: getCsrfToken(ctx),
            myFaresEnabled: myFaresEnabled,
            exportEnabled: exportEnabled,
            operatorHasProducts,
        },
    };
};

export default Exports;
