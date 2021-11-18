import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { myFaresEnabled, exportEnabled } from '../../constants/featureFlag';
import { getAndValidateNoc, getCsrfToken } from '../../utils';
import { redirectTo } from '../../utils/apiUtils';
import CsrfForm from '../../components/CsrfForm';
import { getAllProductsByNoc as getAllProductsByNoc } from '../../data/auroradb';
import useSWR from 'swr';
import { Export } from '../api/getExportProgress';

const title = 'Exports';
const description = 'View and access your settings in one place.';

interface GlobalSettingsProps {
    csrf: string;
    myFaresEnabled: boolean;
    exportEnabled: boolean;
    operatorHasProducts: boolean;
}

const Exports = ({ csrf, myFaresEnabled, exportEnabled, operatorHasProducts }: GlobalSettingsProps): ReactElement => {
    const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

    const { data } = useSWR('/api/getExportProgress', fetcher, { refreshInterval: 5000 });

    const exports: Export[] | undefined = data?.exports;

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
                            <h1 className="govuk-heading-xl">Export your data</h1>{' '}
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
                                <p className="govuk-body-m govuk-!-margin-bottom-9">
                                    This will export all of your current active products and any pending products. Any
                                    products flagged with ‘Needs Attention’ will be exported but may not be correct.
                                    Expired products or products for expired services, will not be included in the
                                    export. Once your export is complete, it will appear in the list below and you can
                                    download this and upload it to{' '}
                                    <a href="https://publish.bus-data.dft.gov.uk/">BODS</a>.
                                </p>
                            </div>
                        </div>

                        <h2 className="govuk-heading-m"> Previously exported fares</h2>
                        <table className="govuk-table">
                            <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                    <th scope="col" className="govuk-table__header">
                                        Export name
                                    </th>
                                    <th scope="col" className="govuk-table__header">
                                        Export status
                                    </th>
                                    <th scope="col" className="govuk-table__header"></th>
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {exports?.map((exportDetails) => (
                                    <tr className="govuk-table__row" key={exportDetails.name}>
                                        <td className="govuk-table__cell">{exportDetails.name}</td>
                                        <td className="govuk-table__cell">
                                            {exportDetails.netexCount === exportDetails.matchingDataCount ? (
                                                <strong className="govuk-tag govuk-tag--green">{`EXPORT COMPLETE ${exportDetails.netexCount} / ${exportDetails.matchingDataCount}`}</strong>
                                            ) : (
                                                <strong className="govuk-tag govuk-tag--blue">{`IN PROGRESS ${exportDetails.netexCount} / ${exportDetails.matchingDataCount}`}</strong>
                                            )}
                                        </td>
                                        <td className="govuk-table__cell">
                                            {exportDetails.signedUrl ? (
                                                <a href={exportDetails.signedUrl}>Download file</a>
                                            ) : null}
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

    const operatorHasProducts = (await getAllProductsByNoc(noc)).length > 0;

    return {
        props: {
            csrf: getCsrfToken(ctx),
            myFaresEnabled: myFaresEnabled,
            exportEnabled: exportEnabled,
            operatorHasProducts,
        },
    };
};

export default Exports;
