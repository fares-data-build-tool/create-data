import { NextApiResponse } from 'next';
import { putDataInS3 } from '../../data/s3';
import { NextApiRequestWithSession, ErrorInfo, UserFareStages } from '../../interfaces';
import { redirectToError, redirectTo } from '../../utils/apiUtils';
import {
    INPUT_METHOD_ATTRIBUTE,
    CSV_UPLOAD_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    PRODUCT_AND_SERVICE_ID_ATTRIBUTE,
} from '../../constants/attributes';
import { getFormData, processFileUpload } from '../../utils/apiUtils/fileUpload';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { WithIds, ReturnTicket, SingleTicket } from '../../../shared/matchingJsonTypes';
import { faresTriangleDataMapper, setCsvUploadAttributeAndRedirect } from './csvUpload';

const errorId = 'csv-upload';

export const getNamesOfFareZones = (ticket: WithIds<SingleTicket> | WithIds<ReturnTicket>) => {
    let fareZoneNames;

    if ('fareZones' in ticket) {
        fareZoneNames = ticket.fareZones.map((fz) => fz.name);
    } else if ('inboundFareZones' in ticket && 'outboundFareZones' in ticket) {
        const combinedFareZones = ticket.outboundFareZones.concat(ticket.inboundFareZones);

        const combinedNamesOnly = combinedFareZones.map((x) => x.name);

        // get rid of duplicates
        fareZoneNames = [...new Set(combinedNamesOnly)];
    }

    return fareZoneNames;
};

export const thereIsAFareStageNameMismatch = (fareTriangleData: UserFareStages, fareZoneNames: string[]): boolean => {
    const thereIsANameMismatch = fareTriangleData.fareStages.some((fs) => {
        return !fareZoneNames.includes(fs.stageName);
    });

    return thereIsANameMismatch;
};

const stageCountMismatchError: ErrorInfo = {
    id: errorId,
    errorMessage:
        'The number of fare stages of your updated fares triangle do not match the one you have previously uploaded. Update your triangle, ensuring the number of fare stages match before trying to upload again',
};

const nameMismatchError: ErrorInfo = {
    id: errorId,
    errorMessage:
        'The name of one or more fare stages of your updated fares triangle does not match what you had have previously uploaded. Update your triangle, ensuring the names of fare stages match before trying to upload again',
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE) as
            | WithIds<SingleTicket>
            | WithIds<ReturnTicket>;

        const productAndServiceId = getSessionAttribute(req, PRODUCT_AND_SERVICE_ID_ATTRIBUTE);

        if (ticket === undefined) {
            throw new Error('Could not find the matching json in the session');
        }

        const formData = await getFormData(req);
        const { fields } = formData;

        if (!fields?.poundsOrPence) {
            const errors: ErrorInfo[] = [
                { id: 'pounds', errorMessage: 'You must select whether the prices are in pounds or pence' },
            ];

            setCsvUploadAttributeAndRedirect(req, res, errors);

            return;
        }

        const { poundsOrPence } = fields;

        const { fileContents, fileError } = await processFileUpload(formData, 'csv-upload');

        if (fileError) {
            const errors: ErrorInfo[] = [{ id: errorId, errorMessage: fileError }];

            setCsvUploadAttributeAndRedirect(req, res, errors, fields.poundsOrPence as string);

            return;
        }

        if (fileContents) {
            const uuid = ticket.uuid;

            const fareZoneNames = getNamesOfFareZones(ticket);

            const fareTriangleData = faresTriangleDataMapper(fileContents, req, res, poundsOrPence as string);

            if (!fareTriangleData || !fareZoneNames) {
                return;
            }

            const errors: ErrorInfo[] = [];

            const thereIsANameMismatch = thereIsAFareStageNameMismatch(fareTriangleData, fareZoneNames);

            // check to see if the the number of fare stages does not match
            if (fareTriangleData.fareStages.length !== fareZoneNames.length) {
                errors.push(stageCountMismatchError);
            } else if (thereIsANameMismatch) {
                errors.push(nameMismatchError);
            }

            // check to see if we had errors
            if (errors.length > 0) {
                setCsvUploadAttributeAndRedirect(req, res, errors, fields.poundsOrPence as string);

                return;
            }

            await putDataInS3(fileContents, `${uuid}.csv`, false);

            await putDataInS3(fareTriangleData, `${uuid}.json`, true);

            updateSessionAttribute(req, INPUT_METHOD_ATTRIBUTE, { inputMethod: 'csv' });
            updateSessionAttribute(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });

            redirectTo(
                res,
                `/products/productDetails?productId=${productAndServiceId?.productId}&serviceId=${productAndServiceId?.serviceId}`,
            );
        }
    } catch (error) {
        const message = 'There was a problem uploading the CSV:';

        redirectToError(res, message, 'api.csvUpload', error);
    }
};
