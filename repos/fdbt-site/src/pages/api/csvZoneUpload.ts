import { NextApiResponse } from 'next';
import csvParse from 'csv-parse/lib/sync';
import {
    CSV_ZONE_FILE_NAME,
    FARE_TYPE_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    SERVICE_LIST_EXEMPTION_ATTRIBUTE,
} from '../../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    getUuidFromSession,
    redirectToError,
    redirectTo,
    getAndValidateNoc,
    isSchemeOperator,
} from '../../utils/apiUtils';
import { putDataInS3 } from '../../data/s3';
import { getAtcoCodesByNaptanCodes, batchGetStopsByAtcoCode } from '../../data/auroradb';
import { FileData, getFormData, processFileUpload } from '../../utils/apiUtils/fileUpload';
import logger from '../../utils/logger';
import { ErrorInfo, NextApiRequestWithSession, UserFareZone, FareType } from '../../interfaces';
import uniq from 'lodash/uniq';
import { isArray } from 'lodash';
import { SelectedService } from 'src/interfaces/matchingJsonTypes';

export interface FareZoneWithErrors {
    errors: ErrorInfo[];
}

// The below 'config' needs to be exported for the formidable library to work.
export const config = {
    api: {
        bodyParser: false,
    },
};

export const setFareZoneAttributeAndRedirect = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    errors: ErrorInfo[],
): void => {
    updateSessionAttribute(req, FARE_ZONE_ATTRIBUTE, { errors });
    redirectTo(res, '/csvZoneUpload');
};

export const csvParser = (stringifiedCsvData: string): UserFareZone[] => {
    const parsedFileContent: UserFareZone[] = csvParse(stringifiedCsvData, {
        columns: true,
        skip_empty_lines: false,
        delimiter: ',',
    });
    return parsedFileContent;
};

export const getAtcoCodesForStops = async (
    rawUserFareZones: UserFareZone[],
    naptanCodesToQuery: string[],
): Promise<UserFareZone[]> => {
    try {
        const atcoItems = await getAtcoCodesByNaptanCodes(naptanCodesToQuery);
        const userFareZones = rawUserFareZones.map((rawUserFareZone) => {
            const atcoItem = atcoItems.find((item) => rawUserFareZone.NaptanCodes === item.naptanCode);
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
        throw new Error(`Could not fetch data for naptanCodes: ${naptanCodesToQuery}. Error: ${error.stack}`);
    }
};

export const processCsv = async (
    fileContent: string,
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<UserFareZone[] | null> => {
    let parsedFileContent: UserFareZone[];
    const errors: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: 'The selected file must use the template' }];

    try {
        parsedFileContent = csvParser(fileContent);
    } catch (error) {
        logger.warn(error, {
            context: 'api.csvZoneUpload',
            message: 'failed to parse fare zone CSV',
        });
        setFareZoneAttributeAndRedirect(req, res, errors);

        return null;
    }

    try {
        let csvValid = true;
        const rawUserFareZones = parsedFileContent
            .map((parsedItem) => {
                const item = {
                    FareZoneName: parsedFileContent?.[0]?.FareZoneName,
                    NaptanCodes: parsedItem.NaptanCodes,
                    AtcoCodes: parsedItem.AtcoCodes,
                };

                if (!item.FareZoneName || item.NaptanCodes === undefined || item.AtcoCodes === undefined) {
                    logger.warn('', {
                        context: 'api.csvZoneUpload',
                        message:
                            'the uploaded fare zone was not of the correct format, one of the required columns of information is missing or misnamed',
                    });
                    csvValid = false;
                }

                return item;
            })
            .filter((parsedItem) => parsedItem.NaptanCodes !== '' || parsedItem.AtcoCodes !== '');

        if (rawUserFareZones.length === 0) {
            logger.warn('', {
                context: 'api.csvZoneUpload',
                message: 'the uploaded fare zone contained no Naptan Codes or Atco Codes',
            });
            csvValid = false;
        }

        if (!csvValid) {
            setFareZoneAttributeAndRedirect(req, res, errors);
            return null;
        }

        let userFareZones = rawUserFareZones;
        const naptanCodesToQuery = rawUserFareZones
            .filter((rawUserFareZone) => rawUserFareZone.AtcoCodes === '')
            .map((rawUserFareZone) => rawUserFareZone.NaptanCodes);

        if (naptanCodesToQuery.length !== 0) {
            userFareZones = await getAtcoCodesForStops(rawUserFareZones, naptanCodesToQuery);
        }

        return userFareZones;
    } catch (error) {
        throw new Error(error.stack);
    }
};

export const processServices = (
    formData: FileData,
): { serviceErrors: ErrorInfo[]; selectedServices: SelectedService[] } => {
    const fields = formData.fields;
    if (!fields) {
        return { serviceErrors: [], selectedServices: [] };
    }
    const isYesSelected = fields['exempt'] === 'yes';

    const errors: ErrorInfo[] = [];

    if (isYesSelected) {
        errors.push({ id: '', errorMessage: 'Choose at least one service from the options' });
    }

    const requestBody: { [key: string]: string | string[] } = fields;
    const selectedServices: SelectedService[] = [];

    Object.entries(requestBody).forEach((entry) => {
        const lineNameLineIdServiceCodeStartDate = entry[0];
        const description = entry[1];
        let serviceDescription: string;
        if (isArray(description)) {
            [serviceDescription] = description;
        } else {
            serviceDescription = description;
        }
        const splitData = lineNameLineIdServiceCodeStartDate.split('#');
        selectedServices.push({
            lineName: splitData[0],
            lineId: splitData[1],
            serviceCode: splitData[2],
            startDate: splitData[3],
            serviceDescription,
        });
    });
    //console.log(selectedServices);

    return { serviceErrors: errors, selectedServices };
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const formData = await getFormData(req);

        const { serviceErrors, selectedServices } = processServices(formData);
        const { fileContents, fileError } = await processFileUpload(formData, 'csv-upload');
        const fileName = formData.name;

        if (fileError) {
            const errors: ErrorInfo[] = [{ id: 'csv-upload', errorMessage: fileError }];
            setFareZoneAttributeAndRedirect(req, res, errors);
            return;
        }

        if (serviceErrors) {
            updateSessionAttribute(req, SERVICE_LIST_EXEMPTION_ATTRIBUTE, { selectedServices });
            redirectTo(res, '/csvZoneUpload');
            return;
        }

        if (fileContents) {
            const uuid = getUuidFromSession(req);
            await putDataInS3(fileContents, `${uuid}.csv`, false);
            const userFareZones = await processCsv(fileContents, req, res);
            updateSessionAttribute(req, CSV_ZONE_FILE_NAME, fileName);

            if (!userFareZones) {
                const errors: ErrorInfo[] = [
                    { id: 'csv-upload', errorMessage: 'Unable to find any user fare zones for uploaded CSV zone.' },
                ];
                setFareZoneAttributeAndRedirect(req, res, errors);
                return;
            }

            const atcoCodes: string[] = userFareZones.map((fareZone) => fareZone.AtcoCodes);
            const deduplicatedAtcoCodes = uniq(atcoCodes);

            try {
                await batchGetStopsByAtcoCode(deduplicatedAtcoCodes);
            } catch (error) {
                const errors: ErrorInfo[] = [
                    {
                        id: 'csv-upload',
                        errorMessage: 'Incorrect ATCO/NaPTAN codes detected in file. All codes must be correct.',
                    },
                ];
                setFareZoneAttributeAndRedirect(req, res, errors);
                return;
            }

            const fareZoneName = userFareZones[0].FareZoneName;
            const nocCode = getAndValidateNoc(req, res);

            if (!nocCode) {
                throw new Error('Could not retrieve nocCode from ID_TOKEN_COOKIE');
            }

            await putDataInS3(userFareZones, `fare-zone/${nocCode}/${uuid}.json`, true);
            updateSessionAttribute(req, FARE_ZONE_ATTRIBUTE, fareZoneName);
            const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;

            if (fareType === 'multiOperator' || isSchemeOperator(req, res)) {
                redirectTo(res, '/reuseOperatorGroup');
                return;
            }

            if (fareType === 'period') {
                const ticketType = getSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE);
                if (!ticketType || !('name' in ticketType)) {
                    throw new Error('No ticket type set for period ticket');
                }

                if (ticketType.name === 'hybrid') {
                    redirectTo(res, '/serviceList?selectAll=false');
                    return;
                }
            }

            if (fareType === 'capped') {
                redirectTo(res, '/typeOfCap');
                return;
            }

            redirectTo(res, '/multipleProducts');
            return;
        }
    } catch (error) {
        const message = 'There was a problem uploading the CSV:';
        redirectToError(res, message, 'api.csvZoneUpload', error);
    }
};
