import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import { getDomain, getUuidFromCookie, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';
import { CSV_ZONE_UPLOAD_COOKIE, ALLOWED_CSV_FILE_TYPES } from '../../constants';

const MAX_FILE_SIZE = 5242880;

export type File = FileData;

interface FileData {
    Files: formidable.Files;
    FileContent: string;
}

export interface UserFareZone {
    zoneName: string;
    stopsNaptan: string[];
}

export interface RawFareZoneData {
    zoneName: string;
    stopsNaptan: string[];
    stopsAtco: string[];
}

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

export const putDataInS3 = async (data: UserFareZone | string, key: string, processed: boolean): Promise<void> => {
    let contentType = '';
    let bucketName = '';

    if (!process.env.USER_DATA_BUCKET_NAME || !process.env.RAW_USER_DATA_BUCKET_NAME) {
        throw new Error('Bucket name environment variables not set.');
    }

    if (processed) {
        bucketName = process.env.USER_DATA_BUCKET_NAME;
        contentType = 'application/json; charset=utf-8';
    } else {
        bucketName = process.env.RAW_USER_DATA_BUCKET_NAME;
        contentType = 'text/csv; charset=utf-8';
    }

    await putStringInS3(bucketName, key, JSON.stringify(data), contentType);
};

export const dataMapper = (dataToMap: string): UserFareZone => {
    const dataAsLines: string[] = dataToMap.split(/\n/);

    const stopCount = dataAsLines.length;

    if (stopCount < 1) {
        throw new Error(`At least 1 stop is needed, only ${stopCount} found`);
    }

    const mappedData: UserFareZone = { zoneName: '', stopsNaptan: [] };

    return mappedData;
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

export const getFormData = async (req: NextApiRequest): Promise<File> => {
    const files = await formParse(req);
    const fileContent = await fs.promises.readFile(files['csv-upload'].path, 'utf-8');

    return {
        Files: files,
        FileContent: fileContent,
    };
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
            const fareZoneData = dataMapper(formData.FileContent);
            await putDataInS3(fareZoneData, `${uuid}.json`, true);
            const cookieValue = JSON.stringify({ fareZoneData, uuid });
            setCookieOnResponseObject(getDomain(req), CSV_ZONE_UPLOAD_COOKIE, cookieValue, req, res);

            redirectTo(res, '/periodProduct');
        }
    } catch (error) {
        redirectToError(res);
    }
};
