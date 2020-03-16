import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import flatMap from 'array.prototype.flatmap';
import { getUuidFromCookie, redirectToError, redirectTo, setCookieOnResponseObject, getDomain } from './apiUtils';
import { putDataInS3, UserFareStages } from '../../data/s3';
import { ALLOWED_CSV_FILE_TYPES, CSV_UPLOAD_COOKIE } from '../../constants';

const MAX_FILE_SIZE = 5242880;

export type File = FileData;

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

export const faresTriangleDataMapper = (dataToMap: string): UserFareStages => {
    const fareTriangle: FareTriangleData = {
        fareStages: [],
    };

    const dataAsLines: string[] = dataToMap.split(/\r?\n/);

    const fareStageCount = dataAsLines.length;

    if (fareStageCount < 2) {
        throw new Error(`At least 2 fare stages are needed, only ${fareStageCount} found`);
    }

    let expectedNumberOfPrices = 0;

    for (let rowNum = 0; rowNum < dataAsLines.length; rowNum += 1) {
        const items = dataAsLines[rowNum].split(',');
        const trimmedItems = items.map(item => item.trim());
        const stageName = trimmedItems[rowNum + 1];

        if (trimmedItems.every(item => item === '' || item === null)) {
            break;
        } else {
            expectedNumberOfPrices += rowNum;
        }

        fareTriangle.fareStages[rowNum] = {
            stageName,
            prices: {},
        };

        for (let colNum = 0; colNum < rowNum; colNum += 1) {
            const price = trimmedItems[colNum + 1];

            // Check explicitly for number to account for invalid fare data
            if (price && !Number.isNaN(Number(price)) && stageName) {
                if (fareTriangle.fareStages?.[colNum].prices?.[price]?.fareZones) {
                    fareTriangle.fareStages[colNum].prices[price].fareZones.push(stageName);
                } else {
                    fareTriangle.fareStages[colNum].prices[price] = {
                        price: (parseFloat(price) / 100).toFixed(2),
                        fareZones: [stageName],
                    };
                }
            }
        }
    }

    const mappedFareTriangle: UserFareStages = {
        fareStages: fareTriangle.fareStages.map(item => ({
            ...item,
            prices: Object.values(item.prices),
        })),
    };

    const numberOfPrices = flatMap(mappedFareTriangle.fareStages, stage =>
        flatMap(stage.prices, price => price.fareZones),
    ).length;

    if (numberOfPrices !== expectedNumberOfPrices) {
        throw new Error(
            `Data conversion has not worked properly. Expected ${expectedNumberOfPrices}, got ${numberOfPrices}`,
        );
    }

    return mappedFareTriangle;
};

export const setUploadCookieAndRedirect = (req: NextApiRequest, res: NextApiResponse, error = ''): void => {
    const cookieValue = JSON.stringify({ error });
    setCookieOnResponseObject(getDomain(req), CSV_UPLOAD_COOKIE, cookieValue, req, res);

    if (error) {
        redirectTo(res, '/csvUpload');
    }
};

export const fileIsValid = (
    req: NextApiRequest,
    res: NextApiResponse,
    formData: formidable.Files,
    fileContent: string,
): boolean => {
    const fileSize = formData['csv-upload'].size;
    const fileType = formData['csv-upload'].type;

    if (!fileContent) {
        setUploadCookieAndRedirect(req, res, 'Select a CSV file to upload');
        console.warn('No file attached.');
        return false;
    }

    if (fileSize > MAX_FILE_SIZE) {
        setUploadCookieAndRedirect(req, res, 'The selected file must be smaller than 5MB');
        console.warn(`File is too large. Uploaded file is ${fileSize} Bytes, max size is ${MAX_FILE_SIZE} Bytes`);
        return false;
    }

    if (!ALLOWED_CSV_FILE_TYPES.includes(fileType)) {
        setUploadCookieAndRedirect(req, res, 'The selected file must be a CSV');
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
        if (!fileIsValid(req, res, formData.Files, formData.FileContent)) {
            return;
        }

        if (formData.FileContent) {
            const uuid = getUuidFromCookie(req, res);
            await putDataInS3(formData.FileContent, `${uuid}.csv`, false);
            const fareTriangleData = faresTriangleDataMapper(formData.FileContent);
            await putDataInS3(fareTriangleData, `${uuid}.json`, true);

            setUploadCookieAndRedirect(req, res);
            redirectTo(res, '/matching');
        }
    } catch (error) {
        redirectToError(res);
    }
};
