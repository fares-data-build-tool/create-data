import { startCase } from 'lodash';
import { NextApiResponse } from 'next';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../../src/constants/attributes';
import { redirectTo } from '../../../src/utils/apiUtils';
import { isCurrency } from '../../../src/utils/apiUtils/validator';
import { updateSessionAttribute } from '../../../src/utils/sessions';
import { CapDistancePricing, DistanceCap, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export const checkInputIsValid = (inputtedValue: string | undefined, inputType: string): string => {
    let error;

    if (!inputtedValue) {
        error = inputType === 'price' ? 'Enter a price for the distance' : 'Enter a value for the distance';
    } else if (Math.sign(Number(inputtedValue)) === -1) {
        error = `${startCase(inputType)}s cannot be negative numbers`;
    } else if (!isCurrency(inputtedValue)) {
        error =
            inputType === 'price'
                ? 'This must be a valid price in pounds and pence'
                : inputtedValue !== 'Max'
                ? 'Distances must be numbers to 2 decimal places'
                : '';
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
    const minimumPriceError = checkInputIsValid(minimumPrice, 'price');
    if (minimumPriceError) {
        errors.push({
            id: `minimum-price`,
            errorMessage: minimumPriceError,
        });
    }
    const maximumPriceError = checkInputIsValid(maximumPrice, 'price');
    if (maximumPriceError) {
        errors.push({
            id: `maximum-price`,
            errorMessage: maximumPriceError,
        });
    }
    capPricePerDistances.forEach((cap, index: number) => {
        const { distanceFrom, distanceTo, pricePerKm } = cap;

        if (lastIndex !== index) {
            const distanceToError = checkInputIsValid(distanceTo, 'distance');
            if (distanceToError) {
                errors.push({
                    id: `distance-to-${index}`,
                    errorMessage: distanceToError,
                });
            }
        }

        const pricePerKmError = checkInputIsValid(pricePerKm, 'price');
        if (pricePerKmError) {
            errors.push({
                id: `price-per-km-${index}`,
                errorMessage: pricePerKmError,
            });
        }
        if (index !== 0) {
            const distanceFromError = checkInputIsValid(distanceFrom, 'distance');
            if (distanceFromError) {
                errors.push({
                    id: `distance-from-${index}`,
                    errorMessage: distanceFromError,
                });
            }
        }
    });

    for (let i = capPricePerDistances.length - 1; i >= 1; i--) {
        if (Number(capPricePerDistances[i].distanceFrom) !== Number(capPricePerDistances[i - 1].distanceTo)) {
            errors.push({
                id: `distance-from-${i}`,
                errorMessage: 'Distance from must be the same as distance to in the previous row',
            });
        }
        if (capPricePerDistances[i].distanceTo !== 'Max') {
            if (Number(capPricePerDistances[i].distanceFrom) >= Number(capPricePerDistances[i].distanceTo)) {
                errors.push({
                    id: `distance-from-${i}`,
                    errorMessage: 'Distance from must be less than distance to in the same row',
                });
            }
        }
    }

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

    redirectTo(res, '/capConfirmation');
    return;
};
