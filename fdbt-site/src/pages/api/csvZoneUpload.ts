import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import csvParse from 'csv-parse/lib/sync';
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
    FareZoneName: string;
    AtcoCodes: string[];
}

export interface RawUserFareZone {
    FareZoneName: string;
    AtcoCodes: string;
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
    try {
        await putStringInS3(bucketName, key, JSON.stringify(data), contentType);
    } catch (error) {
        throw new Error(
            `Could not put ${processed ? 'processed json' : 'raw csv'} in ${bucketName}. Error: ${error.stack}`,
        );
    }
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

export const csvParser = (stringifiedCsvData: string): RawUserFareZone[] => {
    const parsedFileContent: RawUserFareZone[] = csvParse(stringifiedCsvData, {
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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const formData = await getFormData(req);
        if (!fileIsValid(res, formData.Files, formData.FileContent)) {
            return;
        }

        if (formData.FileContent) {
            console.log(formData.FileContent);
            const uuid = getUuidFromCookie(req, res);
            await putDataInS3(formData.FileContent, `${uuid}.csv`, false);
            const parsedFileContent = csvParser(formData.FileContent);
            const { FareZoneName } = parsedFileContent[0];
            const atcoCodes = parsedFileContent.map(item => item.AtcoCodes);
            const userFareZone: UserFareZone = {
                FareZoneName,
                AtcoCodes: atcoCodes,
            };
            await putDataInS3(userFareZone, `${uuid}.json`, true);
            const cookieValue = JSON.stringify({ FareZoneName, uuid });
            setCookieOnResponseObject(getDomain(req), CSV_ZONE_UPLOAD_COOKIE, cookieValue, req, res);

            redirectTo(res, '/periodProduct');
        }
    } catch (error) {
        redirectToError(res);
    }
};
