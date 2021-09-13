import { UNASSIGNED_INBOUND_STOPS_ATTRIBUTE } from './../../constants/attributes';
import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, getSelectedStages } from './apiUtils';
import { NextApiRequestWithSession, UserFareStages } from '../../interfaces';
import { getMatchingFareZonesAndUnassignedStopsFromForm, isFareStageUnassigned } from './apiUtils/matching';
import {
    CARNET_FARE_TYPE_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { MatchingWithErrors, InboundMatchingInfo } from '../../interfaces/matchingInterface';
import { isFareType } from '../../interfaces/typeGuards';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { overrideWarning } = req.body;
        if (!req.body.service || !req.body.userfarestages) {
            throw new Error('No service or userfarestages info found');
        }

        const inboundUserFareStages: UserFareStages = JSON.parse(req.body.userfarestages);

        const parsedInputs = getMatchingFareZonesAndUnassignedStopsFromForm(req);
        const { matchingFareZones, unassignedStops } = parsedInputs;

        // Deleting these keys from the object in order to facilitate looping through the fare stage values in the body
        delete req.body.service;
        delete req.body.userfarestages;

        if (!Object.keys(matchingFareZones).find((fareZone) => fareZone !== 'notApplicable')) {
            const selectedStagesList: string[][] = getSelectedStages(req);
            const matchingAttributeError: MatchingWithErrors = {
                error: 'No fare stages have been assigned, assign each fare stage to a stop',
                selectedFareStages: selectedStagesList,
            };
            updateSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE, matchingAttributeError);

            redirectTo(res, '/inboundMatching');
            return;
        } else if (
            isFareStageUnassigned(inboundUserFareStages, matchingFareZones) &&
            matchingFareZones !== {} &&
            !overrideWarning
        ) {
            const selectedStagesList: string[][] = getSelectedStages(req);
            const matchingAttributeError: MatchingWithErrors = {
                warning: true,
                selectedFareStages: selectedStagesList,
            };
            updateSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE, matchingAttributeError);

            redirectTo(res, '/inboundMatching');

            return;
        }

        updateSessionAttribute(req, UNASSIGNED_INBOUND_STOPS_ATTRIBUTE, unassignedStops);

        const matchingAttributeValue: InboundMatchingInfo = {
            inboundUserFareStages,
            inboundMatchingFareZones: matchingFareZones,
        };
        updateSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE, matchingAttributeValue);

        const carnetFareType = getSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE);

        if (carnetFareType) {
            redirectTo(res, '/carnetProductDetails');
            return;
        }

        const fareTypeInfo = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (isFareType(fareTypeInfo) && fareTypeInfo.fareType === 'period') {
            redirectTo(res, '/pointToPointPeriodProduct');
            return;
        }

        redirectTo(res, '/returnValidity');
    } catch (error) {
        const message = 'There was a problem generating the matching JSON.';
        redirectToError(res, message, 'api.inboundMatching', error);
    }
};
