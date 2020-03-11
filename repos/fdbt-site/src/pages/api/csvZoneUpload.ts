import { NextApiRequest, NextApiResponse } from 'next';
import csvParse from 'csv-parse/lib/sync';
import {
    getDomain,
    getUuidFromCookie,
    setCookieOnResponseObject,
    redirectToError,
    redirectTo,
    csvFileIsValid,
    getFormData,
} from './apiUtils';
import { putDataInS3 } from '../../data/s3';
import { CSV_ZONE_UPLOAD_COOKIE } from '../../constants';

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

export const csvParser = (stringifiedCsvData: string): RawUserFareZone[] => {
    const parsedFileContent: RawUserFareZone[] = csvParse(stringifiedCsvData, {
        columns: true,
        skip_empty_lines: false, // eslint-disable-line @typescript-eslint/camelcase
        delimiter: ',',
    });
    return parsedFileContent;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const formData = await getFormData(req);
        if (!csvFileIsValid(res, formData.Files, formData.FileContent)) {
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
