import { NextApiRequest, NextApiResponse } from 'next';
import csvParse from 'csv-parse/lib/sync';
import { getDomain, getUuidFromCookie, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { putDataInS3, UserFareZone } from '../../data/s3';
import { getAtcoCodesByNaptanCodes } from '../../data/auroradb';
import { CSV_ZONE_UPLOAD_COOKIE } from '../../constants';
import { isSessionValid } from './service/validator';
import { processFileUpload } from './apiUtils/fileUpload';

// The below 'config' needs to be exported for the formidable library to work.
export const config = {
    api: {
        bodyParser: false,
    },
};

export const setUploadCookieAndRedirect = (req: NextApiRequest, res: NextApiResponse, error = ''): void => {
    const cookieValue = JSON.stringify({ error });
    setCookieOnResponseObject(getDomain(req), CSV_ZONE_UPLOAD_COOKIE, cookieValue, req, res);
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
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<UserFareZone[] | null> => {
    let parsedFileContent: UserFareZone[];

    try {
        parsedFileContent = csvParser(fileContent);
    } catch (error) {
        console.warn('Failed to parse fare zone CSV, error: ', error.stack());
        setUploadCookieAndRedirect(req, res, 'The selected file must use the template');

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
                    console.warn(
                        'The uploaded CSV was not of the correct format. One of the required columns of information is missing or misnamed.',
                    );
                    csvValid = false;
                }

                return item;
            })
            .filter(parsedItem => parsedItem.NaptanCodes !== '' || parsedItem.AtcoCodes !== '');

        if (rawUserFareZones.length === 0) {
            console.warn('The uploaded CSV contained no Naptan Codes or Atco Codes');
            csvValid = false;
        }

        if (!csvValid) {
            setUploadCookieAndRedirect(req, res, 'The selected file must use the template');

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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const { fileContents, fileError } = await processFileUpload(req, 'csv-upload');

        if (fileError) {
            setUploadCookieAndRedirect(req, res, fileError);
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
            const cookieValue = JSON.stringify({ fareZoneName, uuid });
            setCookieOnResponseObject(getDomain(req), CSV_ZONE_UPLOAD_COOKIE, cookieValue, req, res);

            redirectTo(res, '/howManyProducts');
        }
    } catch (error) {
        const message = 'There was a problem uploading the csv:';
        redirectToError(res, message, error);
    }
};
