import { NextApiRequest, NextApiResponse } from 'next';
import csvParse from 'csv-parse/lib/sync';
import { getAtcoCodesByNaptanCodes } from '../../data/dynamodb';
import {
    getDomain,
    getUuidFromCookie,
    setCookieOnResponseObject,
    redirectToError,
    redirectTo,
    csvFileIsValid,
    getFormData,
} from './apiUtils';
import { putDataInS3, UserFareZone } from '../../data/s3';
import { CSV_ZONE_UPLOAD_COOKIE } from '../../constants';

// The below 'config' needs to be exported for the formidable library to work.
export const config = {
    api: {
        bodyParser: false,
    },
};

export const csvParser = (stringifiedCsvData: string): UserFareZone[] => {
    const parsedFileContent: UserFareZone[] = csvParse(stringifiedCsvData, {
        columns: true,
        skip_empty_lines: false, // eslint-disable-line @typescript-eslint/camelcase
        delimiter: ',',
    });
    return parsedFileContent;
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
    const naptanCodesToQuery = rawUserFareZones
        .filter(rawUserFareZone => rawUserFareZone.AtcoCodes === '')
        .map(rawUserFareZone => rawUserFareZone.NaptanCodes);
    console.log({ naptanCodesToQuery });
    const atcoItems = await getAtcoCodesByNaptanCodes(naptanCodesToQuery);
    console.log({ atcoItems });
    const userFareZones = rawUserFareZones.map(rawUserFareZone => {
        const atcoItem = atcoItems.find(item => rawUserFareZone.NaptanCodes === item.naptanCode);
        if (atcoItem) {
            return {
                ...rawUserFareZone,
                AtcoCodes: atcoItem.atcoCode,
            };
        }
        console.log(rawUserFareZone);
        return rawUserFareZone;
    });
    console.log(userFareZones);
    return userFareZones;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const formData = await getFormData(req);
        if (!csvFileIsValid(res, formData.Files, formData.FileContent)) {
            return;
        }

        if (formData.FileContent) {
            const uuid = getUuidFromCookie(req, res);
            console.log(`File content received is: ${formData.FileContent}`);
            await putDataInS3(formData.FileContent, `${uuid}.csv`, false);
            const userFareZones = await processCsvUpload(formData.FileContent);
            const fareZoneName = userFareZones[0].FareZoneName;
            console.log(`FareZoneName is ${fareZoneName} and userFareZones are ${userFareZones}`);
            await putDataInS3(userFareZones, `${uuid}.json`, true);
            const cookieValue = JSON.stringify({ fareZoneName, uuid });
            setCookieOnResponseObject(getDomain(req), CSV_ZONE_UPLOAD_COOKIE, cookieValue, req, res);

            redirectTo(res, '/periodProduct');
        }
    } catch (error) {
        console.log(error.stack);
        redirectToError(res);
    }
};
