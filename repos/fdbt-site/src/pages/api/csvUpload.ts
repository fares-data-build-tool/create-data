import util from 'util';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, function(_err, _fields, file) {
            fs.readFile(file['file-upload-1'].path, 'utf-8', (_error, data) => {
                if (!data) {
                    res.writeHead(302, {
                        Location: '/csvUpload',
                    });
                    res.end();
                    return;
                }

                const fareTriangle: FareTriangleData = {
                    fareStages: [
                        {
                            stageName: '',
                            prices: [],
                        },
                    ],
                };

                const dataAsLines: string[] = data.split('\n');

                dataAsLines.map((item, index) => {
                    if (fareTriangle.fareStages[index]) {
                        fareTriangle.fareStages[index].stageName = item.split(',')[index + 1];
                    } else {
                        fareTriangle.fareStages[index] = {
                            stageName: item.split(',')[index + 1],
                            prices: [],
                        };
                    }
                });

                for (let i = 1; i < dataAsLines.length; i += 1) {
                    const items = dataAsLines[i].split(',');
                    for (let j = 0; j < i + 1; j += 1) {
                        if (fareTriangle.fareStages[j] && items[j + 1] && j != i) {
                            if (items[j + 1] !== '') {
                                fareTriangle.fareStages[j].prices.push(items[j + 1]);
                            }
                        }
                    }
                }
                console.log(util.inspect(fareTriangle, false, null, true));

                const s3 = new AWS.S3();

                const fileName = `validated/${  []}`;

                s3.putObject({
                    Bucket: '',
                    Key: fileName,
                });
            });

            res.writeHead(302, {
                Location: '/matching',
            });

            res.end();
        });
    } catch (error) {
        res.writeHead(302, {
            Location: '/error',
        });
    }
};
