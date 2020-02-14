import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';
import { getCookies } from './apiUtils/index';
import { OPERATOR_COOKIE } from '../../constants';

export type FareTriangle = FareTriangleData;
export type File = FileData;

interface FareTriangleData {
    fareStages: [
        {
            stageName: string;
            prices: string[];
        },
    ];
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

export const putDataInS3 = async (data: FareTriangleData | string, key: string, processed: boolean): Promise<void> => {
    const s3 = new AWS.S3();

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

    const request: AWS.S3.Types.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
    };

    await s3.putObject(request).promise();
};

export const faresTriangleDataMapper = (dataToMap: string): FareTriangleData => {
    const fareTriangle: FareTriangleData = {
        fareStages: [
            {
                stageName: '',
                prices: [],
            },
        ],
    };

    const dataAsLines: string[] = dataToMap.split('\n');

    let expectedNumberOfPrices = 0;

    for (let t = 0; t < dataAsLines.length; t += 1) {
        expectedNumberOfPrices += t;
        if (fareTriangle.fareStages[t]) {
            fareTriangle.fareStages[t].stageName = dataAsLines[t].split(',')[t + 1];
        } else {
            fareTriangle.fareStages[t] = {
                stageName: dataAsLines[t].split(',')[t + 1],
                prices: [],
            };
        }
    }

    for (let i = 1; i < dataAsLines.length; i += 1) {
        const items = dataAsLines[i].split(',');
        for (let j = 0; j < i + 1; j += 1) {
            if (fareTriangle.fareStages[j] && items[j + 1] && j !== i) {
                if (items[j + 1] !== '' && !Number.isNaN(Number(items[j + 1]))) {
                    fareTriangle.fareStages[j].prices.push(items[j + 1]);
                }
            }
        }
    }

    const numberOfPrices = fareTriangle.fareStages.flatMap(stage => stage.prices).length;

    if (numberOfPrices !== expectedNumberOfPrices) {
        throw new Error('Data conversion has not worked properly.');
    }

    return fareTriangle;
};

export const getUuidFromCookie = (req: NextApiRequest): string => {
    const cookies = getCookies(req);

    const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));

    return JSON.parse(operatorCookie).uuid;
};

export const fileChecks = (res: NextApiResponse, formData: formidable.Files, fileContent: string): boolean => {
    const fileSize = formData['file-upload-1'].size;

    const fileType = formData['file-upload-1'].type;

    if (!fileContent) {
        console.log('No file attached.'); // eslint-disable-line no-console
        res.writeHead(302, {
            Location: '/csvUpload',
        });
        res.end();
        return false;
    }

    if (fileSize > 5242880) {
        console.log('File is too large.'); // eslint-disable-line no-console
        res.writeHead(302, {
            Location: '/_error',
        });
        res.end();
        return false;
    }

    if (fileType !== 'text/csv') {
        console.log('File is not a csv.'); // eslint-disable-line no-console
        res.writeHead(302, {
            Location: '/_error',
        });
        res.end();
        return false;
    }

    return true;
};

export const fileParse = async (req: NextApiRequest): Promise<File> => {
    const files = await new Promise<Files>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, _fields, file) => {
            if (err) {
                return reject(err);
            }
            return resolve(file);
        });
    });

    const fileContent = await fs.promises.readFile(files['file-upload-1'].path, 'utf-8');

    return {
        Files: files,
        FileContent: fileContent,
    };
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const formData = await fileParse(req);
        const isValid = fileChecks(res, formData.Files, formData.FileContent);
        if (!isValid) {
            return;
        }
        if (formData.FileContent) {
            try {
                const uuid = getUuidFromCookie(req);
                await putDataInS3(formData.FileContent, uuid, false);
                const fareTriangleData = faresTriangleDataMapper(formData.FileContent);
                await putDataInS3(fareTriangleData, uuid, true);
                res.writeHead(302, {
                    Location: '/matching',
                });

                res.end();
            } catch (error) {
                console.log(error); // eslint-disable-line no-console

                res.writeHead(302, {
                    Location: '/_error',
                });
                res.end();
                return;
            }
        }
    } catch (error) {
        res.writeHead(302, {
            Location: '/_error',
        });
    }
};
