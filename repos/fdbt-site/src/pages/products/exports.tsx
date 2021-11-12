import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { exportEnabled } from '../../constants/featureFlag';
import { getAndValidateNoc, getCsrfToken } from '../../utils';
import { getS3FolderCount, getS3Exports, retrieveAndZipExportedNetexForNoc, getNetexSignedUrl } from '../../data/s3';
import { redirectTo } from '../../utils/apiUtils';
import { MATCHING_DATA_BUCKET_NAME, NETEX_BUCKET_NAME } from '../../constants';
import CsrfForm from '../../components/CsrfForm';

const title = 'Exports';
const description = 'View and access your settings in one place.';

interface GlobalSettingsProps {
    exports: { matchingDataCount: number; name: string; netexCount: number; signedUrl: string | null }[];
    csrf: string;
}

const Exports = ({ exports, csrf }: GlobalSettingsProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description} showNavigation>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <h1 className="govuk-heading-xl">Exports</h1>

                        <CsrfForm csrfToken={csrf} method={'post'} action={'/api/exports'}>
                            <button type="submit" className="govuk-button">
                                Export all
                            </button>
                        </CsrfForm>

                        <table className="govuk-table">
                            <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                    <th scope="col" className="govuk-table__header">
                                        Export Name
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        Files
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {exports.map((exportDetails) => (
                                    <tr className="govuk-table__row" key={exportDetails.name}>
                                        <td className="govuk-table__cell">
                                            {exportDetails.signedUrl ? (
                                                <a href={exportDetails.signedUrl}>{exportDetails.name}</a>
                                            ) : (
                                                exportDetails.name
                                            )}
                                        </td>
                                        <td className="govuk-table__cell">
                                            {exportDetails.netexCount} / {exportDetails.matchingDataCount}
                                        </td>
                                        <td className="govuk-table__cell">
                                            {exportDetails.netexCount === exportDetails.matchingDataCount ? (
                                                <strong className="govuk-tag govuk-tag--green">Complete</strong>
                                            ) : (
                                                <strong className="govuk-tag govuk-tag--blue">In Progress</strong>
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

            const netexCount = await getS3FolderCount(NETEX_BUCKET_NAME, prefix);

            const complete = matchingDataCount === netexCount;

            let signedUrl: string | null = null;
            if (complete) {
                const zipKey = await retrieveAndZipExportedNetexForNoc(noc, it);
                signedUrl = await getNetexSignedUrl(zipKey || '');
            }

            return { name: it, matchingDataCount, netexCount, signedUrl };
        }),
    );

    return { props: { exports, csrf: getCsrfToken(ctx) } };
};

export default Exports;
