import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, getSelectedStages } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { MATCHING_ATTRIBUTE } from '../../constants';
import { MatchingFareZones, MatchingInfo } from '../../interfaces/matchingInterface';
import { getFareZones, getMatchingFareZonesFromForm, isFareStageUnassigned } from './apiUtils/matching';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession, BasicService, UserFareStages } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (!req.body.service || !req.body.userfarestages) {
            throw new Error('No service or userfarestages info found');
        }

        const service: BasicService = JSON.parse(req.body.service);
        const userFareStages: UserFareStages = JSON.parse(req.body.userfarestages);
        const matchingFareZones = getMatchingFareZonesFromForm(req);

        // Deleting these keys from the object in order to faciliate looping through the fare stage values in the body
        delete req.body.service;
        delete req.body.userfarestages;

        if (isFareStageUnassigned(userFareStages, matchingFareZones) && matchingFareZones !== {}) {
            const selectedStagesList: string[][] = getSelectedStages(req);
            updateSessionAttribute(req, MATCHING_ATTRIBUTE, { error: true, selectedFareStages: selectedStagesList });
            redirectTo(res, '/outboundMatching');
            return;
        }
        const formatMatchingFareZones = getFareZones(userFareStages, matchingFareZones);

        const matchedFareZones: MatchingFareZones = {};
        formatMatchingFareZones.forEach(fareStage => {
            matchedFareZones[fareStage.name] = fareStage;
        });

        const matchingValues: MatchingInfo = {
            service,
            userFareStages,
            matchingFareZones: matchedFareZones,
        };

        updateSessionAttribute(req, MATCHING_ATTRIBUTE, matchingValues);
        redirectTo(res, '/inboundMatching');
    } catch (error) {
        const message = 'There was a problem generating the matching JSON:';
        redirectToError(res, message, 'api.outboundMatching', error);
    }
};
