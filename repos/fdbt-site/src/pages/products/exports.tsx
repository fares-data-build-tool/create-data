import React, { ReactElement, useState } from 'react';
import { NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { formatFailedFileNames, getAndValidateNoc, getCsrfToken } from '../../utils';
import CsrfForm from '../../components/CsrfForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllProductsByNoc as getAllProductsByNoc } from '../../data/auroradb';
import useSWR from 'swr';
import { Export } from '../api/getExportProgress';
import InfoPopup from '../../components/InfoPopup';

const title = 'Exports';
const description = 'Export your products into NeTEx.';
const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

interface GlobalSettingsProps {
    csrf: string;
    operatorHasProducts: boolean;
}

const getTag = (exportDetails: Export): ReactElement => {
    if (exportDetails.netexCount === 0) {
        return (
            <strong className="govuk-tag govuk-tag--blue">
                {`LOADING PRODUCTS (${exportDetails.numberOfFilesExpected})`}
            </strong>
        );
    }

    if (exportDetails.netexCount === exportDetails.numberOfFilesExpected) {
        if (exportDetails.signedUrl) {
            return (
                <strong className="govuk-tag govuk-tag--green">{`EXPORT COMPLETE ${exportDetails.netexCount} / ${exportDetails.numberOfFilesExpected}`}</strong>
            );
        }
        return (
            <strong className="govuk-tag govuk-tag--blue">{`EXPORT ZIPPING ${exportDetails.netexCount} / ${exportDetails.numberOfFilesExpected}`}</strong>
        );
    }

    if (exportDetails.exportFailed) {
        const numberOfFilesMissing = exportDetails.numberOfFilesExpected - exportDetails.netexCount;
        return (
            <strong className="govuk-tag govuk-tag--red">{`EXPORT FAILED - ${numberOfFilesMissing} ${
                numberOfFilesMissing > 0 ? 'files' : 'file'
            } failed`}</strong>
        );
    }

    return (
        <strong className="govuk-tag govuk-tag--blue">{`IN PROGRESS ${exportDetails.netexCount} / ${exportDetails.numberOfFilesExpected}`}</strong>
    );
};

const Exports = ({ csrf, operatorHasProducts }: GlobalSettingsProps): ReactElement => {
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [showFailedFilesPopup, setShowFailedFilesPopup] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data } = useSWR('/api/getExportProgress', fetcher, { refreshInterval: 1500 });

    const exports: Export[] | undefined = data?.exports;

    const exportInProgress: Export | undefined = exports
        ? exports.find((exportDetails) => exportDetails.netexCount !== exportDetails.numberOfFilesExpected)
        : undefined;

    const anExportIsInProgress = !!exportInProgress;
    const exportAllowed: boolean = operatorHasProducts && !anExportIsInProgress && !!exports && !buttonClicked;
    const showCancelButton: boolean = anExportIsInProgress && !!exportInProgress?.exportFailed;
    const failedExport: Export | undefined =
        anExportIsInProgress && exportInProgress?.exportFailed ? exportInProgress : undefined;

    return (
        <>
            <BaseLayout title={title} description={description} showNavigation>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="dft-flex dft-flex-justify-space-between">
                            <h1 className="govuk-heading-xl">Export your data</h1>{' '}
                            <div>
                                {!anExportIsInProgress ? (
                                    <CsrfForm csrfToken={csrf} method={'post'} action={'/api/exports'}>
                                        <button
                                            type="submit"
                                            className={`govuk-button${!exportAllowed ? ' govuk-visually-hidden' : ''}`}
                                            disabled={isSubmitting}
                                            onClick={() => {
                                                setShowExportPopup(true);
                                                setButtonClicked(true);
                                                setIsSubmitting(true);
                                            }}
                                        >
                                            Export all fares
                                        </button>
                                    </CsrfForm>
                                ) : showCancelButton ? (
                                    <CsrfForm csrfToken={csrf} method={'post'} action={'/api/cancelExport'}>
                                        <input type="hidden" name="exportName" value={exportInProgress?.name} />
                                        <button type="submit" className="govuk-button govuk-button--warning">
                                            Cancel export in progress
                                        </button>
                                    </CsrfForm>
                                ) : null}
                                <a
                                    href="/products/selectExports"
                                    className={`govuk-button${!exportAllowed ? ' govuk-visually-hidden' : ''}`}
                                    data-module="govuk-button"
                                >
                                    Select products to export
                                </a>
                            </div>
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
                                    {exports?.map((exportDetails) => {
                                        return (
                                            <tr className="govuk-table__row" key={exportDetails.name}>
                                                <td className="govuk-table__cell">{exportDetails.name}</td>
                                                <td className="govuk-table__cell">{getTag(exportDetails)}</td>
                                                <td className="govuk-table__cell">
                                                    {exportDetails.signedUrl && !exportDetails.exportFailed ? (
                                                        <a href={exportDetails.signedUrl}>Download file</a>
                                                    ) : !!exportDetails.exportFailed &&
                                                      exportDetails.failedValidationFilenames.length > 0 ? (
                                                        <button
                                                            className="govuk-button margin-bottom-0"
                                                            onClick={() => {
                                                                setShowFailedFilesPopup(true);
                                                            }}
                                                        >
                                                            View failure details
                                                        </button>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {showExportPopup && (
                            <InfoPopup
                                title="We are preparing your export"
                                text="Your export will take a few seconds to show in the table below."
                                okActionHandler={() => setShowExportPopup(false)}
                            />
                        )}

                        {showFailedFilesPopup && !!failedExport && (
                            <div className="popup">
                                <div className="popup__content">
                                    <h1 className="govuk-heading-m govuk-!-margin-bottom-8">
                                        Product names of invalid NeTEx files
                                    </h1>

                                    <p className="govuk-body-m govuk-!-margin-bottom-8">
                                        {formatFailedFileNames(failedExport.failedValidationFilenames)}
                                    </p>

                                    <span className="govuk-hint" id="info-hint">
                                        Use the contact link at the bottom of the screen to let us know.
                                    </span>

                                    <span className="govuk-hint" id="info-hint">
                                        If you want to fix your export, use the &apos;Cancel&apos; button and then
                                        &apos;Select products to export&apos; button to exclude the failing products.
                                    </span>

                                    <button className="govuk-button" onClick={() => setShowFailedFilesPopup(false)}>
                                        Ok
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: GlobalSettingsProps }> => {
    const noc = getAndValidateNoc(ctx);

    const operatorHasProducts = (await getAllProductsByNoc(noc)).length > 0;

    return {
        props: {
            csrf: getCsrfToken(ctx),
            operatorHasProducts,
        },
    };
};

export default Exports;
