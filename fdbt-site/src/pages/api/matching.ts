import { NextApiResponse } from 'next';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError, getSelectedStages } from './apiUtils';
import { BasicService, NextApiRequestWithSession, UserFareStages } from '../../interfaces';
import { MATCHING_ATTRIBUTE, FARE_TYPE_ATTRIBUTE } from '../../constants/attributes';
import { getMatchingFareZonesFromForm, isFareStageUnassigned } from './apiUtils/matching';
import { MatchingWithErrors, MatchingInfo } from '../../interfaces/matchingInterface';
import { isFareType } from '../../interfaces/typeGuards';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!req.body.service || !req.body.userfarestages) {
            throw new Error('No service or userfarestages info found');
        }

        const fareTypeInfo = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (!fareTypeInfo || !isFareType(fareTypeInfo)) {
            throw new Error('Could not extract a fare type from the session');
        }

        const service: BasicService = JSON.parse(req.body.service);
        const userFareStages: UserFareStages = JSON.parse(req.body.userfarestages);
        const matchingFareZones = getMatchingFareZonesFromForm(req);

        // Deleting these keys from the object in order to facilitate looping through the fare stage values in the body
        delete req.body.service;
        delete req.body.userfarestages;

        if (isFareStageUnassigned(userFareStages, matchingFareZones) && matchingFareZones !== {}) {
            const selectedStagesList: string[][] = getSelectedStages(req);
            const matchingAttributeError: MatchingWithErrors = { error: true, selectedFareStages: selectedStagesList };
            updateSessionAttribute(req, MATCHING_ATTRIBUTE, matchingAttributeError);

            redirectTo(res, '/matching');

            return;
        }
        const matchingAttributeValue: MatchingInfo = { service, userFareStages, matchingFareZones };
        updateSessionAttribute(req, MATCHING_ATTRIBUTE, matchingAttributeValue);

        if (fareTypeInfo.fareType === 'return') {
            redirectTo(res, '/returnValidity');
            return;
        }

        redirectTo(res, '/ticketConfirmation');
    } catch (error) {
        const message = 'There was a problem generating the matching JSON:';
        redirectToError(res, message, 'api.matching', error);
    }
};
