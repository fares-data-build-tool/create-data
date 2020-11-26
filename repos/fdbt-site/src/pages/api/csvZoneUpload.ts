import { NextApiResponse } from 'next';
import csvParse from 'csv-parse/lib/sync';
import { FARE_TYPE_ATTRIBUTE, FARE_ZONE_ATTRIBUTE } from '../../constants/index';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { getUuidFromCookie, redirectToError, redirectTo } from './apiUtils';
import { putDataInS3, UserFareZone } from '../../data/s3';
import { getAtcoCodesByNaptanCodes } from '../../data/auroradb';
import { isSessionValid } from './apiUtils/validator';
import { processFileUpload } from './apiUtils/fileUpload';
import logger from '../../utils/logger';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

import { FareType } from './fareType';

export interface FareZone {
    fareZoneName: string;
}

export interface FareZoneWithErrors {
    errors: ErrorInfo[];
}

// The below 'config' needs to be exported for the formidable library to work.
export const config = {
    api: {
        bodyParser: false,
    },
};

export const setFareZoneAttributeAndRedirect = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    errors: ErrorInfo[],
): void => {
    updateSessionAttribute(req, FARE_ZONE_ATTRIBUTE, { errors });
    redirectTo(res, '/csvZoneUpload');
};

export const csvParser = (stringifiedCsvData: string): UserFareZone[] => {
    const parsedFileContent: UserFareZone[] = csvParse(stringifiedCsvData, {
        columns: true,
        skip_empty_lines: false, // eslint-disable-line @typescript-eslint/camelcase
        delimiter: ',',
    });
    return parsedFileContent;
};

export const getAtcoCodesForStops = async (
    rawUserFareZones: UserFareZone[],
    naptanCodesToQuery: string[],
): Promise<UserFareZone[]> => {
    try {
        const atcoItems = await getAtcoCodesByNaptanCodes(naptanCodesToQuery);
        const userFareZones = rawUserFareZones.map(rawUserFareZone => {
            const atcoItem = atcoItems.find(item => rawUserFareZone.NaptanCodes === item.naptanCode);
            if (atcoItem) {
                return {
                    ...rawUserFareZone,
                    AtcoCodes: atcoItem.atcoCode,
                };
            }
            return rawUserFareZone;
        });
        return userFareZones;
    } catch (error) {
        throw new Error(`Could not fetch data for naptanCodes: ${naptanCodesToQuery}. Error: ${error.stack}`);
    }
};

export const processCsv = async (
    fileContent: string,
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<UserFareZone[] | null> => {
    let parsedFileContent: UserFareZone[];
    const errors: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: 'The selected file must use the template' }];

    try {
        parsedFileContent = csvParser(fileContent);
    } catch (error) {
        logger.warn(error, {
            context: 'api.csvZoneUpload',
            message: 'failed to parse fare zone CSV',
        });
        setFareZoneAttributeAndRedirect(req, res, errors);

        return null;
    }

    try {
        let csvValid = true;
        const rawUserFareZones = parsedFileContent
            .map(parsedItem => {
                const item = {
                    FareZoneName: parsedFileContent?.[0]?.FareZoneName,
                    NaptanCodes: parsedItem.NaptanCodes,
                    AtcoCodes: parsedItem.AtcoCodes,
                };

                if (!item.FareZoneName || item.NaptanCodes === undefined || item.AtcoCodes === undefined) {
                    logger.warn('', {
                        context: 'api.csvZoneUpload',
                        message:
                            'the uploaded fare zone was not of the correct format, one of the required columns of information is missing or misnamed',
                    });
                    csvValid = false;
                }

                return item;
            })
            .filter(parsedItem => parsedItem.NaptanCodes !== '' || parsedItem.AtcoCodes !== '');

        if (rawUserFareZones.length === 0) {
            logger.warn('', {
                context: 'api.csvZoneUpload',
                message: 'the uploaded fare zone contained no Naptan Codes or Atco Codes',
            });
            csvValid = false;
        }

        if (!csvValid) {
            setFareZoneAttributeAndRedirect(req, res, errors);
            return null;
        }

        let userFareZones = rawUserFareZones;
        const naptanCodesToQuery = rawUserFareZones
            .filter(rawUserFareZone => rawUserFareZone.AtcoCodes === '')
            .map(rawUserFareZone => rawUserFareZone.NaptanCodes);

        if (naptanCodesToQuery.length !== 0) {
            userFareZones = await getAtcoCodesForStops(rawUserFareZones, naptanCodesToQuery);
        }

        return userFareZones;
    } catch (error) {
        throw new Error(error.stack);
    }
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const { fileContents, fileError } = await processFileUpload(req, 'csv-upload');

        if (fileError) {
            const errors: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: fileError }];
            setFareZoneAttributeAndRedirect(req, res, errors);
            return;
        }

        if (fileContents) {
            const uuid = getUuidFromCookie(req, res);
            await putDataInS3(fileContents, `${uuid}.csv`, false);
            const userFareZones = await processCsv(fileContents, req, res);

            if (!userFareZones) {
                return;
            }

            const fareZoneName = userFareZones[0].FareZoneName;
            await putDataInS3(userFareZones, `${uuid}.json`, true);
            updateSessionAttribute(req, FARE_ZONE_ATTRIBUTE, { fareZoneName });
            const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;
            if (fareType === 'multiOperator') {
                redirectTo(res, '/searchOperators');
                return;
            }
            redirectTo(res, '/howManyProducts');
            return;
        }
    } catch (error) {
        const message = 'There was a problem uploading the CSV:';
        redirectToError(res, message, 'api.csvZoneUpload', error);
    }
};
