import { NextApiResponse } from 'next';
import { insertCaps } from '../../data/auroradb';
import { CREATE_CAPS_ATTRIBUTE } from '../../constants/attributes';
import { CapInfo, ErrorInfo, NextApiRequestWithSession } from '../../interfaces/index';
import { CapStart, DayOfTheWeek, ExpiryUnit } from '../../interfaces/matchingJsonTypes';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils';
import {
    checkDurationIsValid,
    checkPriceIsValid,
    checkProductOrCapNameIsValid,
    isValidInputDuration,
    removeExcessWhiteSpace,
} from '../../utils/apiUtils/validator';
import { updateSessionAttribute } from '../../utils/sessions';
import { isADayDuration } from '../createCaps';

export interface InputtedCap {
    name: string | undefined;
    price: string | undefined;
    durationAmount: string | undefined;
    durationUnits: string | undefined;
    type: string | undefined;
    startDay: string | undefined;
}

export const isADayOfTheWeek = (input: string | undefined): boolean => {
    const daysOfWeek: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return !!input && daysOfWeek.includes(input);
};

export const validateAndFormatCapInputs = (inputtedCap: InputtedCap): { errors: ErrorInfo[]; createCaps: CapInfo } => {
    const errors: ErrorInfo[] = [];

    const trimmedCapName = removeExcessWhiteSpace(inputtedCap.name);
    const capNameError = checkProductOrCapNameIsValid(trimmedCapName, 'cap');

    if (capNameError) {
        errors.push({ errorMessage: capNameError, id: 'cap-name' });
    }

    const trimmedCapPrice = removeExcessWhiteSpace(inputtedCap.price);
    const capPriceError = checkPriceIsValid(trimmedCapPrice, 'cap');

    if (capPriceError) {
        errors.push({ errorMessage: capPriceError, id: 'cap-price' });
    }

    const trimmedCapDurationAmount = removeExcessWhiteSpace(inputtedCap.durationAmount);
    const capDurationAmountError = checkDurationIsValid(trimmedCapDurationAmount, 'cap');

    if (capDurationAmountError) {
        errors.push({ errorMessage: capDurationAmountError, id: 'cap-period-duration-quantity' });
    }

    const capDurationUnitsError = !isValidInputDuration(inputtedCap.durationUnits as string, false)
        ? 'Choose an option from the dropdown'
        : '';

    if (capDurationUnitsError) {
        errors.push({ errorMessage: capDurationUnitsError, id: 'cap-duration-unit' });
    }

    let capStart = undefined;

    if (isADayDuration(inputtedCap.durationAmount, inputtedCap.durationUnits)) {
        const capType = inputtedCap.type;

        if (!(capType === 'fixedWeekdays' || capType === 'rollingDays')) {
            errors.push({
                id: 'fixed-weekdays',
                errorMessage: 'Choose an option regarding your cap ticket start',
            });
        }

        if (capType === 'fixedWeekdays') {
            if (!isADayOfTheWeek(inputtedCap.startDay)) {
                errors.push({
                    id: 'start',
                    errorMessage: 'Select a start day',
                });
            }
        }

        capStart = {
            type: capType ? (capType as CapStart) : 'fixedWeekdays',
            startDay: capType === 'rollingDays' ? undefined : (inputtedCap.startDay as DayOfTheWeek),
        };
    }

    const cap = {
        name: trimmedCapName,
        price: trimmedCapPrice,
        durationAmount: trimmedCapDurationAmount,
        durationUnits: (inputtedCap.durationUnits as ExpiryUnit) || '',
    };

    const createCaps: CapInfo = {
        cap,
        capStart,
    };

    return {
        errors,
        createCaps,
    };
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const noc = getAndValidateNoc(req, res);
        const { capName, capPrice, capDuration, capDurationUnits, capStart, startDay } = req.body;

        const inputtedCap: InputtedCap = {
            name: capName,
            price: capPrice,
            durationAmount: capDuration,
            durationUnits: capDurationUnits,
            type: capStart,
            startDay: startDay,
        };

        const { createCaps, errors } = validateAndFormatCapInputs(inputtedCap);

        if (errors.length > 0) {
            updateSessionAttribute(req, CREATE_CAPS_ATTRIBUTE, { errors, ...createCaps });
            redirectTo(res, '/createCaps');
            return;
        }

        updateSessionAttribute(req, CREATE_CAPS_ATTRIBUTE, undefined);

        await insertCaps(noc, createCaps);

        redirectTo(res, '/viewCaps');
        return;
    } catch (error) {
        const message = 'There was a problem in the create caps API:';
        redirectToError(res, message, 'api.createCaps', error);
    }
};
