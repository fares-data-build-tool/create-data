import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';
import { getCookies } from './apiUtils/index';
import { OPERATOR_COOKIE } from '../../constants';

export type FareTriangle = FareTriangleData;

interface FareTriangleData {
    fareStages: [
        {
            stageName: string;
            prices: string[];
        },
    ];
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export const formParse = async (req: NextApiRequest) => {
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


export const putDataInS3 = async (data: FareTriangleData | string, key: string, processed: boolean) => {
    const s3 = new AWS.S3();

    let bucketfolder = '';

    if (processed) {
        bucketfolder = '/processed';
    } else {
        bucketfolder = '/unprocessed';
    }

    const request: AWS.S3.Types.PutObjectRequest = {
        Bucket: `fdbt-user-data-${process.env.STAGE}${bucketfolder}`,
        Key: key,
        Body: data,
        ContentType: 'application/json; charset=utf-8',
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

    for(let t = 0; t < dataAsLines.length; t += 1){
        if(fareTriangle.fareStages[t]){
            fareTriangle.fareStages[t].stageName = dataAsLines[t].split(',')[t + 1];
        } else {
            fareTriangle.fareStages[t] = {
                stageName: dataAsLines[t].split(',')[t + 1],
                prices: []
            }
        }
    }

    for (let i = 1; i < dataAsLines.length; i += 1) {
        const items = dataAsLines[i].split(',');
        for (let j = 0; j < i + 1; j += 1) {
            if (fareTriangle.fareStages[j] && items[j + 1] && j !== i) {
                if (items[j + 1] !== '') {
                    fareTriangle.fareStages[j].prices.push(items[j + 1]);
                }
            }
        }
    }
    return fareTriangle;
};

export const getUuidFromCookie = (req: NextApiRequest) => {
    const cookies = getCookies(req);

    const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));

    return JSON.parse(operatorCookie).uuid;
};

export const fileChecks = (res: NextApiResponse, formData: formidable.Files, fileContent: string): boolean => {
    const fileSize = formData['file-upload-1'].size;

    const fileType = formData['file-upload-1'].type;

    if (!fileContent) {
        console.log('No file attached.');
        res.writeHead(302, {
            Location: '/csvUpload',
        });
        res.end();
        return false;
    }

    if (fileSize > 5242880) {
        console.log('File is too large.');
        res.writeHead(302, {
            Location: '/error',
        });
        res.end();
        return false;
    }

    if (fileType !== 'text/csv') {
        console.log('File is not a csv.');
        res.writeHead(302, {
            Location: '/error',
        });
        res.end();
        return false;
    }

    return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const formData = await formParse(req);

        const fileContent = await fs.promises.readFile(formData['file-upload-1'].path, 'utf-8');

        const isValid = fileChecks(res, formData, fileContent);

        if (!isValid) {
            return;
        }

        if (fileContent) {
            try {
                const uuid = getUuidFromCookie(req);

                await putDataInS3(fileContent, uuid, false);

                const fareTriangleData = faresTriangleDataMapper(fileContent);

                await putDataInS3(fareTriangleData, uuid, true);

                res.writeHead(302, {
                    Location: '/matching',
                });

                res.end();
                
            } catch (error) {
                console.log(error);

                res.writeHead(302, {
                    Location: '/error',
                });
                res.end();
                return;
            }
        }

        res.writeHead(302, {
            Location: '/csvUpload',
        });

        res.end();
    } catch (error) {
        res.writeHead(302, {
            Location: '/error',
        });
    }
};
