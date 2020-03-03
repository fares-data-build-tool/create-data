import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import flatMap from 'array.prototype.flatmap';
import { getUuidFromCookie, redirectToError, redirectTo } from './apiUtils';
import { putStringInS3 } from '../../data/s3';

const MAX_FILE_SIZE = 5242880;

export type File = FileData;

export interface UserFareStages {
    fareStages: {
        stageName: string;
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

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

export const putDataInS3 = async (data: UserFareStages | string, key: string, processed: boolean): Promise<void> => {
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

export const faresTriangleDataMapper = (dataToMap: string): UserFareStages => {
    const fareTriangle: FareTriangleData = {
        fareStages: [],
    };

    const dataAsLines: string[] = dataToMap.split('\n');

    const fareStageCount = dataAsLines.length;

    if (fareStageCount < 2) {
        throw new Error(`At least 2 fare stages are needed, only ${fareStageCount} found`);
    }

    let expectedNumberOfPrices = 0;

    for (let rowNum = 0; rowNum < dataAsLines.length; rowNum += 1) {
        expectedNumberOfPrices += rowNum;
        const items = dataAsLines[rowNum].split(',');
        const stageName = items[rowNum + 1];

        fareTriangle.fareStages[rowNum] = {
            stageName,
            prices: {},
        };

        for (let colNum = 0; colNum < rowNum; colNum += 1) {
            const price = items[colNum + 1];
            const priceZoneName = items[rowNum + 1];

            if (price) {
                // Check explicitly for number to account for invalid fare data
                if (!Number.isNaN(Number(price))) {
                    if (fareTriangle.fareStages?.[colNum].prices?.[price]?.fareZones) {
                        fareTriangle.fareStages[colNum].prices[price].fareZones.push(priceZoneName);
                    } else {
                        fareTriangle.fareStages[colNum].prices[price] = {
                            price: (parseFloat(price) / 100).toFixed(2),
                            fareZones: [priceZoneName],
                        };
                    }
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

export const fileIsValid = (res: NextApiResponse, formData: formidable.Files, fileContent: string): boolean => {
    const fileSize = formData['file-upload-1'].size;
    const fileType = formData['file-upload-1'].type;

    if (!fileContent) {
        redirectTo(res, '/csvUpload');
        console.warn('No file attached.');

        return false;
    }

    if (fileSize > MAX_FILE_SIZE) {
        redirectToError(res);
        console.warn(`File is too large. Uploaded file is ${fileSize} Bytes, max size is ${MAX_FILE_SIZE} Bytes`);

        return false;
    }

    if (fileType !== 'text/csv') {
        redirectToError(res);
        console.warn(`File must be of type text/csv, uploaded file is ${fileType}`);

        return false;
    }

    return true;
};

export const getFormData = async (req: NextApiRequest): Promise<File> => {
    const files = await formParse(req);
    const fileContent = await fs.promises.readFile(files['file-upload-1'].path, 'utf-8');

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
            const fareTriangleData = faresTriangleDataMapper(formData.FileContent);
            await putDataInS3(fareTriangleData, `${uuid}.json`, true);

            redirectTo(res, '/matching');
        }
    } catch (error) {
        redirectToError(res);
        throw error;
    }
};
