import React, { ReactElement, useState } from 'react';
import { NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { myFaresEnabled, exportEnabled } from '../../constants/featureFlag';
import { getAndValidateNoc, getCsrfToken } from '../../utils';
import { redirectTo } from '../../utils/apiUtils';
import CsrfForm from '../../components/CsrfForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllProductsByNoc as getAllProductsByNoc } from '../../data/auroradb';
import useSWR from 'swr';
import { Export } from '../api/getExportProgress';
import InfoPopup from '../../components/InfoPopup';

const title = 'Exports';
const description = 'View and access your settings in one place.';
const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

interface GlobalSettingsProps {
    csrf: string;
    myFaresEnabled: boolean;
    exportEnabled: boolean;
    operatorHasProducts: boolean;
}

const Exports = ({ csrf, myFaresEnabled, exportEnabled, operatorHasProducts }: GlobalSettingsProps): ReactElement => {
    const { data } = useSWR('/api/getExportProgress', fetcher, { refreshInterval: 5000 });

    const exports: Export[] | undefined = data?.exports;

    const anExportIsInProgress: boolean = exports
        ? exports.some((exportDetails) => exportDetails.netexCount !== exportDetails.matchingDataCount)
        : false;

    const [showPopup, setShowPopup] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const exportDisabled = !operatorHasProducts || anExportIsInProgress || buttonClicked || !exports;

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
                                <button
                                    type="submit"
                                    className="govuk-button"
                                    onClick={() => {
                                        setShowPopup(true);
                                        setButtonClicked(true);
                                    }}
                                    disabled={exportDisabled}
                                >
                                    Export all fares
                                </button>
                            </CsrfForm>
                        </div>
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                {!operatorHasProducts ? (
                                    <div className="govuk-inset-text govuk-!-margin-top-0">
                                        Export is disabled as you have no products.
                                    </div>
                                ) : null}
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

                        <h2 className="govuk-heading-m govuk-!-margin-bottom-6">Previously exported fares</h2>

                        {!exports ? (
                            <LoadingSpinner />
                        ) : exports.length === 0 ? (
                            <p className="govuk-body-m">
                                <em>You currently have no exports</em>
                            </p>
                        ) : (
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
                                                ) : exportDetails.netexCount === 0 ? (
                                                    <strong className="govuk-tag govuk-tag--blue">{'LOADING'}</strong>
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
                        )}

                        {showPopup && (
                            <InfoPopup
                                title="We are preparing your export"
                                text="Your export will take a few seconds to show in the table below."
                                okActionHandler={() => setShowPopup(false)}
                            />
                        )}
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
