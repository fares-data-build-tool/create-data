import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import csvParse from 'csv-parse/lib/sync';
import fs from 'fs';
import { getDomain, getUuidFromCookie, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { putDataInS3, UserFareZone } from '../../data/s3';
import { getAtcoCodesByNaptanCodes } from '../../data/dynamodb';
import { CSV_ZONE_UPLOAD_COOKIE, ALLOWED_CSV_FILE_TYPES } from '../../constants';

const MAX_FILE_SIZE = 5242880;

export type File = FileData;

interface FileData {
    Files: formidable.Files;
    FileContent: string;
}

// The below 'config' needs to be exported for the formidable library to work.
export const config = {
    api: {
        bodyParser: false,
    },
};

export const formParse = async (req: NextApiRequest): Promise<Files> => {
    return new Promise<Files>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, _fields, file) => {
            if (err) {
                return reject(err);
            }
            return resolve(file);
        });
    });
};

export const fileIsValid = (res: NextApiResponse, formData: formidable.Files, fileContent: string): boolean => {
    const fileSize = formData['csv-upload'].size;
    const fileType = formData['csv-upload'].type;

    if (!fileContent) {
        redirectTo(res, '/csvZoneUpload');
        console.warn('No file attached.');

        return false;
    }

    if (fileSize > MAX_FILE_SIZE) {
        redirectToError(res);
        console.warn(`File is too large. Uploaded file is ${fileSize} Bytes, max size is ${MAX_FILE_SIZE} Bytes`);

        return false;
    }

    if (!ALLOWED_CSV_FILE_TYPES.includes(fileType)) {
        redirectToError(res);
        console.warn(`File not of allowed type, uploaded file is ${fileType}`);

        return false;
    }

    return true;
};

export const csvParser = (stringifiedCsvData: string): UserFareZone[] => {
    const parsedFileContent: UserFareZone[] = csvParse(stringifiedCsvData, {
        columns: true,
        skip_empty_lines: false, // eslint-disable-line @typescript-eslint/camelcase
        delimiter: ',',
    });
    return parsedFileContent;
};

export const getFormData = async (req: NextApiRequest): Promise<File> => {
    const files = await formParse(req);
    const stringifiedFileContent = await fs.promises.readFile(files['csv-upload'].path, 'utf-8');
    return {
        Files: files,
        FileContent: stringifiedFileContent,
    };
};

export const formatDynamoResponse = async (
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
        throw new Error(
            `Could not fetch data from Dynamo (Naptan Table) for naptanCodes: ${naptanCodesToQuery}. Error: ${error.stack}`,
        );
    }
};

export const processCsvUpload = async (fileContent: string): Promise<UserFareZone[]> => {
    const parsedFileContent = csvParser(fileContent);
    const { FareZoneName } = parsedFileContent[0];
    const rawUserFareZones = parsedFileContent
        .map(parsedItem => ({
            FareZoneName,
            NaptanCodes: parsedItem.NaptanCodes,
            AtcoCodes: parsedItem.AtcoCodes,
        }))
        .filter(parsedItem => parsedItem.NaptanCodes !== '' || parsedItem.AtcoCodes !== '');
    let userFareZones = rawUserFareZones;
    const naptanCodesToQuery = rawUserFareZones
        .filter(rawUserFareZone => rawUserFareZone.AtcoCodes === '')
        .map(rawUserFareZone => rawUserFareZone.NaptanCodes);
    if (naptanCodesToQuery.length !== 0) {
        userFareZones = await formatDynamoResponse(rawUserFareZones, naptanCodesToQuery);
    }
    return userFareZones;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const formData = await getFormData(req);
        if (!fileIsValid(res, formData.Files, formData.FileContent)) {
            return;
        }

        if (formData.FileContent) {
            const uuid = getUuidFromCookie(req, res);
            await putDataInS3(formData.FileContent, `${uuid}.csv`, false);
            const userFareZones = await processCsvUpload(formData.FileContent);
            const fareZoneName = userFareZones[0].FareZoneName;
            await putDataInS3(userFareZones, `${uuid}.json`, true);
            const cookieValue = JSON.stringify({ fareZoneName, uuid });
            setCookieOnResponseObject(getDomain(req), CSV_ZONE_UPLOAD_COOKIE, cookieValue, req, res);

            redirectTo(res, '/periodProduct');
        }
    } catch (error) {
        redirectToError(res);
    }
};
