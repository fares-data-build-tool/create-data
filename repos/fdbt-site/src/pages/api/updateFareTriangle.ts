import { NextApiResponse } from 'next';
import { NextApiRequestWithSession, ErrorInfo, UserFareStages } from '../../interfaces';
import { redirectToError, redirectTo } from '../../utils/apiUtils';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    CSV_UPLOAD_ATTRIBUTE,
} from '../../constants/attributes';
import { getFormData, processFileUpload } from '../../utils/apiUtils/fileUpload';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { WithIds, ReturnTicket, SingleTicket } from '../../../shared/matchingJsonTypes';
import { faresTriangleDataMapper, setCsvUploadAttributeAndRedirect } from './csvUpload';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { getFareZones } from '../../utils/apiUtils/matching';
import { MatchingFareZones } from '../../interfaces/matchingInterface';

export const config = {
    api: {
        bodyParser: false,
    },
};

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

        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        if (ticket === undefined || matchingJsonMetaData === undefined) {
            throw new Error('Could not find the matching json or its meta data in the session');
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

            // clear the errors from the session
            updateSessionAttribute(req, CSV_UPLOAD_ATTRIBUTE, { errors: [] });

            // update the fare zones on the matching json
            if ('fareZones' in ticket) {
                ticket.fareZones = getFareZones(
                    fareTriangleData,
                    ticket.fareZones.reduce<MatchingFareZones>((matchingFareZones, currentFareZone) => {
                        matchingFareZones[currentFareZone.name] = currentFareZone;
                        return matchingFareZones;
                    }, {}),
                );
            } else {
                ticket.inboundFareZones = getFareZones(
                    fareTriangleData,
                    ticket.inboundFareZones.reduce<MatchingFareZones>((matchingFareZones, currentFareZone) => {
                        matchingFareZones[currentFareZone.name] = currentFareZone;
                        return matchingFareZones;
                    }, {}),
                );

                ticket.outboundFareZones = getFareZones(
                    fareTriangleData,
                    ticket.outboundFareZones.reduce<MatchingFareZones>((matchingFareZones, currentFareZone) => {
                        matchingFareZones[currentFareZone.name] = currentFareZone;
                        return matchingFareZones;
                    }, {}),
                );
            }

            // put the now updated matching json into s3
            // overriding the existing object
            await putUserDataInProductsBucketWithFilePath(ticket, matchingJsonMetaData.matchingJsonLink);

            redirectTo(
                res,
                `/products/productDetails?productId=${matchingJsonMetaData?.productId}&serviceId=${matchingJsonMetaData?.serviceId}`,
            );
        }
    } catch (error) {
        const message = 'There was a problem uploading the CSV:';

        redirectToError(res, message, 'api.csvUpload', error);
    }
};
