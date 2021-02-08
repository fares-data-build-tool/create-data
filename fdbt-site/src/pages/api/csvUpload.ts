import { NextApiResponse } from 'next';
import uniq from 'lodash/uniq';
import Papa from 'papaparse';
import { NextApiRequestWithSession, ErrorInfo, UserFareStages } from '../../interfaces';
import { getUuidFromCookie, redirectToError, redirectTo } from './apiUtils';
import { putDataInS3 } from '../../data/s3';
import { JOURNEY_ATTRIBUTE, INPUT_METHOD_ATTRIBUTE, CSV_UPLOAD_ATTRIBUTE } from '../../constants';
import { isSessionValid } from './apiUtils/validator';
import { getFormData, processFileUpload } from './apiUtils/fileUpload';
import logger from '../../utils/logger';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { isJourney } from '../../interfaces/typeGuards';

const errorId = 'csv-upload';

interface FareTriangleData {
    fareStages: {
        stageName: string;
        prices: {
            [key: string]: {
                price: string;
                fareZones: string[];
            };
        };
    }[];
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export const setCsvUploadAttributeAndRedirect = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    errors: ErrorInfo[],
    poundsOrPence?: string,
): void => {
    updateSessionAttribute(req, CSV_UPLOAD_ATTRIBUTE, { errors, poundsOrPence });
    redirectTo(res, '/csvUpload');
};

export const containsDuplicateFareStages = (fareStageNames: string[]): boolean =>
    uniq(fareStageNames).length !== fareStageNames.length;

export const isNotTicketerFormat = (fareStageLines: string[][]): boolean => {
    const items = fareStageLines[0];
    const trimmedItems = items.map(item => item.trim());

    return !trimmedItems[0] || trimmedItems[0] === '';
};

export const faresTriangleDataMapper = (
    dataToMap: string,
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    poundsOrPence: string,
): UserFareStages | null => {
    const fareTriangle: FareTriangleData = {
        fareStages: [],
    };

    const fareStageLines = Papa.parse(dataToMap, { skipEmptyLines: 'greedy' }).data as string[][];
    const fareStageCount = fareStageLines.length;
    const isPence = poundsOrPence === 'pence';

    if (fareStageCount < 2) {
        logger.warn('', {
            context: 'api.csvUpload',
            message: `At least 2 fare stages are needed, only ${fareStageCount} found`,
        });
        const errors: ErrorInfo[] = [{ id: errorId, errorMessage: 'At least 2 fare stages are needed' }];
        setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);

        return null;
    }

    if (fareStageCount !== fareStageLines[0].length) {
        if (!(isNotTicketerFormat(fareStageLines) && fareStageCount === fareStageLines[0].length - 1)) {
            logger.warn('', {
                context: 'api.csvUpload',
                message: `Uploaded CSV does not follow correct template`,
            });
            const errors: ErrorInfo[] = [{ id: errorId, errorMessage: 'The selected file must use the template' }];
            setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);

            return null;
        }
    }

    const notTicketerFormat = isNotTicketerFormat(fareStageLines);
    let pricesSet = false;

    for (let rowNum = 0; rowNum < fareStageLines.length; rowNum += 1) {
        const items = fareStageLines[rowNum] || [];
        const trimmedItems = items.map(item => item.trim().replace(/^"(.*)"$/, '$1'));
        const stageName = notTicketerFormat ? trimmedItems[rowNum + 1] : trimmedItems[rowNum];

        if (!stageName) {
            logger.warn('', {
                context: 'api.csvUpload',
                message: `Empty fare stage name found in uploaded file`,
            });
            const errors: ErrorInfo[] = [{ id: errorId, errorMessage: 'Fare stage names must not be empty' }];
            setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);

            return null;
        }

        if (trimmedItems.every(item => item === '' || item === null)) {
            break;
        }

        fareTriangle.fareStages[rowNum] = {
            stageName,
            prices: {},
        };

        for (let colNum = 0; colNum < rowNum; colNum += 1) {
            const price = notTicketerFormat ? trimmedItems[colNum + 1] : trimmedItems[colNum];

            // Check explicitly for number to account for invalid fare data
            if (price && stageName) {
                pricesSet = true;

                if (Number.isNaN(Number(price))) {
                    logger.warn('', {
                        context: 'api.csvUpload',
                        message: `invalid price in CSV upload`,
                    });
                    const errors: ErrorInfo[] = [
                        { id: errorId, errorMessage: 'The selected file contains an invalid price' },
                    ];
                    setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);
                    return null;
                }

                if (isPence && Number(price) % 1 !== 0) {
                    logger.warn('', {
                        context: 'api.csvUpload',
                        message: `decimal price in CSV upload`,
                    });
                    const errors: ErrorInfo[] = [
                        {
                            id: errorId,
                            errorMessage: 'The selected file contains a decimal price, all prices must be in pence',
                        },
                    ];
                    setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);
                    return null;
                }

                const formattedPrice = isPence ? (parseFloat(price) / 100).toFixed(2) : parseFloat(price).toFixed(2);

                if (fareTriangle.fareStages?.[colNum].prices?.[formattedPrice]?.fareZones) {
                    fareTriangle.fareStages[colNum].prices[formattedPrice].fareZones.push(stageName);
                } else {
                    fareTriangle.fareStages[colNum].prices[formattedPrice] = {
                        price: formattedPrice,
                        fareZones: [stageName],
                    };
                }
            }
        }
    }

    if (!pricesSet) {
        logger.warn('', {
            context: 'api.csvUpload',
            message: 'No prices set in uploaded fares triangle',
        });
        const errors: ErrorInfo[] = [
            { id: errorId, errorMessage: 'At least one price must be set in the uploaded fares triangle' },
        ];
        setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);

        return null;
    }

    const mappedFareTriangle: UserFareStages = {
        fareStages: fareTriangle.fareStages.map(item => ({
            ...item,
            prices: Object.values(item.prices),
        })),
    };

    const fareStageNames: string[] = mappedFareTriangle.fareStages.map(fareStage => fareStage.stageName);

    if (containsDuplicateFareStages(fareStageNames)) {
        logger.warn('', {
            context: 'api.csvUpload',
            message: `Duplicate fare stage names found, fare stage names: ${fareStageNames}`,
        });
        const errors: ErrorInfo[] = [{ id: errorId, errorMessage: 'Fare stage names cannot be the same' }];
        setCsvUploadAttributeAndRedirect(req, res, errors, poundsOrPence);
        return null;
    }

    return mappedFareTriangle;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const formData = await getFormData(req);
        const { fields } = formData;

        if (!fields?.['poundsOrPence']) {
            const errors: ErrorInfo[] = [
                { id: 'pounds', errorMessage: 'You must select whether the prices are in pounds or pence' },
            ];
            setCsvUploadAttributeAndRedirect(req, res, errors);

            return;
        }

        const { poundsOrPence } = fields;

        const { fileContents, fileError } = await processFileUpload(formData, 'csv-upload');

        if (fileError) {
            const errors: ErrorInfo[] = [{ id: errorId, errorMessage: fileError }];
            setCsvUploadAttributeAndRedirect(req, res, errors, fields.poundsOrPence as string);
            return;
        }

        if (fileContents) {
            const uuid = getUuidFromCookie(req, res);
            await putDataInS3(fileContents, `${uuid}.csv`, false);
            const fareTriangleData = faresTriangleDataMapper(fileContents, req, res, poundsOrPence as string);
            if (!fareTriangleData) {
                return;
            }
            await putDataInS3(fareTriangleData, `${uuid}.json`, true);

            updateSessionAttribute(req, INPUT_METHOD_ATTRIBUTE, { inputMethod: 'csv' });
            updateSessionAttribute(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });

            const journeyAttribute = getSessionAttribute(req, JOURNEY_ATTRIBUTE);

            if (isJourney(journeyAttribute) && journeyAttribute?.outboundJourney) {
                redirectTo(res, '/outboundMatching');
                return;
            }
            redirectTo(res, '/matching');
        }
    } catch (error) {
        const message = 'There was a problem uploading the CSV:';
        redirectToError(res, message, 'api.csvUpload', error);
    }
};
