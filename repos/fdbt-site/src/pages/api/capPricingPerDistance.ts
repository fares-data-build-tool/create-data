import { NextApiResponse } from 'next';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../../src/constants/attributes';
import { redirectTo } from '../../../src/utils/apiUtils';
import { isCurrency, isValidNumber } from '../../../src/utils/apiUtils/validator';
import { updateSessionAttribute } from '../../../src/utils/sessions';
import { CapDistancePricing, DistanceCap, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export const checkInputIsValid = (inputtedValue: string | undefined): string => {
    let error;

    if (!inputtedValue) {
        error = `Enter a price for the distance`;
    } else if (Math.sign(Number(inputtedValue)) === -1) {
        error = 'Prices cannot be negative numbers';
    } else if (!isCurrency(inputtedValue)) {
        error = 'This must be a valid price in pounds and pence';
    }

    if (error) {
        return error;
    }

    return '';
};

export const validateInput = (
    capPricePerDistances: CapDistancePricing[],
    lastIndex: number,
    minimumPrice: string,
    maximumPrice: string,
): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    const minimumPriceError = checkInputIsValid(minimumPrice);
    if (minimumPriceError) {
        errors.push({
            id: `minimum-price`,
            errorMessage: minimumPriceError,
        });
    }
    const maximumPriceError = checkInputIsValid(maximumPrice);
    if (maximumPriceError) {
        errors.push({
            id: `maximum-price`,
            errorMessage: maximumPriceError,
        });
    }
    capPricePerDistances.forEach((cap, index: number) => {
        const { distanceFrom, distanceTo, pricePerKm } = cap;

        if (lastIndex !== index) {
            if (!distanceTo || !isValidNumber(Number(distanceTo))) {
                errors.push({
                    id: `distance-to-${index}`,
                    errorMessage: 'Distance to is required and needs to be number',
                });
            }
        }

        const pricePerKmError = checkInputIsValid(pricePerKm);
        if (pricePerKmError) {
            errors.push({
                id: `price-per-km-${index}`,
                errorMessage: pricePerKmError,
            });
        }
        if (index !== 0) {
            if (!distanceFrom || !isValidNumber(Number(distanceFrom))) {
                errors.push({
                    id: `distance-from-${index}`,
                    errorMessage: 'Distance from is required and needs to be number',
                });
            }
        }
    });

    return errors;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const capPricePerDistances: CapDistancePricing[] = [];
    let i = 0;
    let errors: ErrorInfo[] = [];
    const minimumPrice = req.body[`minimumPrice`];
    const maximumPrice = req.body[`maximumPrice`];

    while (req.body[`pricePerKm${i}`] !== undefined) {
        const distanceFrom = req.body[`distanceFrom${i}`];
        const distanceTo = req.body[`distanceTo${i}`];
        const pricePerKm = req.body[`pricePerKm${i}`];
        const capPricingPerDistance = {
            distanceFrom,
            distanceTo,
            pricePerKm,
        };
        capPricePerDistances.push(capPricingPerDistance);
        i += 1;
    }
    capPricePerDistances[0] = { ...capPricePerDistances[0], distanceFrom: '0' };
    capPricePerDistances[i - 1] = { ...capPricePerDistances[i - 1], distanceTo: 'Max' };
    errors = validateInput(capPricePerDistances, i - 1, minimumPrice, maximumPrice);
    const distanceCap: DistanceCap = { maximumPrice, minimumPrice, capPricing: capPricePerDistances };
    if (errors.length > 0) {
        updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            errors,
            ...distanceCap,
        });
        redirectTo(res, '/defineCapPricingPerDistance');
        return;
    }

    updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, distanceCap);

    updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
        errors: [{ id: '', errorMessage: 'Next page to be made soon!' }],
        ...distanceCap,
    });
    redirectTo(res, '/defineCapPricingPerDistance');
    return;
};
