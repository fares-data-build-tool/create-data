import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import startCase from 'lodash/startCase';
import TwoThirdsLayout from '../layout/Layout';
import { getNocFromIdToken } from '../utils';
import { retrieveNetexForNocs, getMatchingDataObject, getNetexSignedUrl } from '../data/s3';
import { S3NetexFile, PeriodTicket, PointToPointTicket, BaseProduct } from '../interfaces';
import {
    isPointToPointTicket,
    isGeoZoneTicket,
    isPeriodTicket,
    isMultipleServicesTicket,
    isNotEmpty,
} from '../interfaces/typeGuards';
import Pagination from '../components/Pagination';
import { CREATED_FILES_NUM_PER_PAGE } from '../constants';

const title = 'Created Files - Create Fares Data Service';
const description = 'Created Files page for the Create Fares Data Service';

interface CreateFilesProps {
    files: S3NetexFile[];
    numberOfResults: number;
    currentPage: number;
    numberPerPage: number;
}

const buildName = (file: PointToPointTicket | PeriodTicket): string => {
    let name = `${file.nocCode} - ${startCase(file.type)} - ${startCase(file.passengerType)}`;

    if (isPointToPointTicket(file)) {
        name += ` - Line ${file.lineName}`;
    } else if (isGeoZoneTicket(file)) {
        name += ` - ${file.zoneName}`;
    }

    return name;
};

const dateDiffInDays = (a: Date, b: Date): number => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

const enrichNetexFileData = async (
    files: AWS.S3.Object[],
    pageNumber: number,
    numberPerPage: number,
): Promise<S3NetexFile[]> => {
    const start = (pageNumber - 1) * numberPerPage;
    const slicedFiles = files.slice(start, start + numberPerPage);

    const requestPromises = slicedFiles.map(async file => {
        if (!file.Key) {
            return null;
        }

        const signedUrl = await getNetexSignedUrl(file.Key);

        return {
            matchingData: await getMatchingDataObject(file.Key.replace('.xml', '.json')),
            signedUrl,
            fileSize: file.Size,
        };
    });

    const response = await Promise.all(requestPromises);

    return response
        .map(item => {
            if (!item?.matchingData?.Body) {
                return null;
            }

            const matchingData: PointToPointTicket | PeriodTicket = JSON.parse(item.matchingData.Body.toString());

            return {
                name: buildName(matchingData),
                noc: matchingData.nocCode,
                reference: matchingData.uuid,
                fareType: matchingData.type,
                passengerType: matchingData.passengerType,
                date: item.matchingData.LastModified?.toUTCString() ?? '',
                productNames: isPeriodTicket(matchingData)
                    ? matchingData.products.map(product => product.productName).join(', ')
                    : '',
                serviceNames: isMultipleServicesTicket(matchingData)
                    ? matchingData.selectedServices.map(service => service.lineName).join(', ')
                    : '',
                lineName: isPointToPointTicket(matchingData) ? matchingData.lineName : '',
                zoneName: isGeoZoneTicket(matchingData) ? matchingData.zoneName : '',
                sopNames: matchingData.products
                    ? (matchingData.products as BaseProduct[])
                          .map(product => product.salesOfferPackages?.map(sop => sop.name) ?? null)
                          .join(', ')
                    : '',
                signedUrl: item.signedUrl,
                fileSize: item.fileSize || 0,
            };
        })
        .filter(isNotEmpty);
};

const getCleanFileSize = (fileSize: number): string => {
    if (fileSize < 1024) {
        return `${fileSize}B`;
    }

    const sizeInKb = fileSize / 1024;

    if (sizeInKb < 1024) {
        return `${sizeInKb.toFixed(0)}KB`;
    }

    const sizeInMb = sizeInKb / 1024;

    return `${sizeInMb.toFixed(1)}MB`;
};

const CreatedFiles = ({ files, numberOfResults, currentPage, numberPerPage }: CreateFilesProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <h1 className="govuk-heading-l">Previously created files</h1>
        <span className="govuk-hint" id="fare-type-operator-hint">
            This page will show any NeTEx files created in the last 60 days
        </span>

        {files && files.length > 0 ? (
            <div className="govuk-accordion" data-module="govuk-accordion" id="accordion-default">
                {files.map((file, index) => (
                    <div className="govuk-accordion__section" key={file.reference + file.name}>
                        <div className="govuk-accordion__section-header">
                            <h2 className="govuk-accordion__section-heading">
                                <span
                                    className="govuk-accordion__section-button"
                                    id={`accordion-default-heading-${index}`}
                                >
                                    {file.name}
                                </span>
                            </h2>
                        </div>
                        <div
                            id={`accordion-default-content-${index}`}
                            className="govuk-accordion__section-content"
                            aria-labelledby={`accordion-default-heading-${index}`}
                        >
                            <div className="govuk-body">
                                <span className="govuk-body govuk-!-font-weight-bold">Reference: </span>{' '}
                                {file.reference}
                                <br />
                                <span className="govuk-body govuk-!-font-weight-bold">National Operator Code: </span>
                                {file.noc}
                                <br />
                                <span className="govuk-body govuk-!-font-weight-bold">Fare Type: </span>{' '}
                                {startCase(file.fareType)}
                                <br />
                                <span className="govuk-body govuk-!-font-weight-bold">Passenger Type: </span>{' '}
                                {startCase(file.passengerType)}
                                <br />
                                <span className="govuk-body govuk-!-font-weight-bold">Sales Offer Package(s): </span>
                                {file.sopNames}
                                <br />
                                {file.serviceNames && (
                                    <>
                                        <span className="govuk-body govuk-!-font-weight-bold">Service(s): </span>{' '}
                                        {file.serviceNames}
                                        <br />
                                    </>
                                )}
                                {file.productNames && (
                                    <>
                                        <span className="govuk-body govuk-!-font-weight-bold">Product(s): </span>{' '}
                                        {file.productNames}
                                        <br />
                                    </>
                                )}
                                {file.lineName && (
                                    <>
                                        <span className="govuk-body govuk-!-font-weight-bold">Line Name: </span>{' '}
                                        {file.lineName}
                                        <br />
                                    </>
                                )}
                                {file.zoneName && (
                                    <>
                                        <span className="govuk-body govuk-!-font-weight-bold">Zone Name: </span>{' '}
                                        {file.zoneName}
                                        <br />
                                    </>
                                )}
                                <span className="govuk-body govuk-!-font-weight-bold">Date of Creation: </span>{' '}
                                {file.date}
                                <br />
                                <br />
                                <a href={file.signedUrl} className="govuk-button" download>
                                    Download - File Type XML - File Size {getCleanFileSize(file.fileSize)}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="govuk-body">No NeTEx found</div>
        )}

        {numberOfResults > numberPerPage && (
            <Pagination
                numberPerPage={numberPerPage}
                numberOfResults={numberOfResults}
                currentPage={currentPage}
                link="/createdFiles"
            />
        )}
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContext): Promise<{ props: CreateFilesProps } | null> => {
    const nocList = getNocFromIdToken(ctx)?.split('|');

    let page = 1;
    const currentDate = new Date();

    page = Number.parseInt((ctx.query.page as string) || '1', 10);

    if (Number.isNaN(page)) {
        page = 1;
    }

    if (!nocList) {
        throw new Error('no NOCs found in ID token');
    }

    const files = await retrieveNetexForNocs(nocList);
    const filesToEnrich = files
        .filter(file => {
            const diff = file.LastModified ? dateDiffInDays(file.LastModified, currentDate) : 100;

            return diff < 60;
        })
        .sort((a, b) => {
            if (!a.LastModified || !b.LastModified) {
                return 0;
            }

            if (a.LastModified < b.LastModified) {
                return 1;
            }

            if (a.LastModified > b.LastModified) {
                return -1;
            }

            return 0;
        });

    return {
        props: {
            files: await enrichNetexFileData(filesToEnrich, page, CREATED_FILES_NUM_PER_PAGE),
            numberOfResults: filesToEnrich.length,
            currentPage: page,
            numberPerPage: CREATED_FILES_NUM_PER_PAGE,
        },
    };
};

export default CreatedFiles;
