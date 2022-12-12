import { NextApiResponse } from 'next';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../../src/constants/attributes';
import { redirectTo } from '../../../src/utils/apiUtils';
import { updateSessionAttribute } from '../../../src/utils/sessions';
import { CapPricePerDistances, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export const isValidNumber = (n: number | string): boolean => {
    return (Number(n) === n && n % 1 === 0) || (Number(n) === n && n % 1 !== 0);
};

export const validateInput = (capPricePerDistances: CapPricePerDistances[], lastIndex: number): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    capPricePerDistances.forEach((cap, index: number) => {
        const { distanceFrom, minimumPrice, maximumPrice, distanceTo, pricePerKm } = cap;
        if (lastIndex !== index) {
            if (!distanceTo || !isValidNumber(Number(distanceTo))) {
                errors.push({
                    id: `distance-to-${index}`,
                    errorMessage: 'Distance to must be defined and a number',
                });
            }
        }
        if (index === 0) {
            if (!minimumPrice || !isValidNumber(Number(minimumPrice))) {
                errors.push({
                    id: `minimum-price-${index}`,
                    errorMessage: 'Minimum price to must be defined and a number',
                });
            }
            if (!maximumPrice || !isValidNumber(Number(maximumPrice))) {
                errors.push({
                    id: `maximum-price-${index}`,
                    errorMessage: 'Maximum price to must be defined and a number',
                });
            }
        } else {
            if (!pricePerKm || !isValidNumber(Number(pricePerKm))) {
                errors.push({
                    id: `price-per-km-${index}`,
                    errorMessage: 'Price per km price to must be defined and a number',
                });
            }
            if (!distanceFrom || !isValidNumber(Number(distanceFrom))) {
                errors.push({
                    id: `distance-from-${index}`,
                    errorMessage: 'Distance from must be defined and a number',
                });
            }
        }
    });

    return errors;
};

export const roundAllDistances = (capPricePerDistances: CapPricePerDistances[]): CapPricePerDistances[] => {
    let roundedDistances: CapPricePerDistances[] = [];
    roundedDistances = capPricePerDistances.map((cap) => {
        const { distanceFrom, minimumPrice, maximumPrice, distanceTo, pricePerKm } = cap;
        return {
            distanceFrom: distanceFrom === '0' ? '0' : parseFloat(distanceFrom).toFixed(2).toString(),
            distanceTo: distanceTo === 'Max' ? 'Max' : parseFloat(distanceTo).toFixed(2).toString(),
            minimumPrice: minimumPrice ? parseFloat(minimumPrice).toFixed(2).toString() : undefined,
            maximumPrice: maximumPrice ? parseFloat(maximumPrice).toFixed(2).toString() : undefined,
            pricePerKm: pricePerKm ? parseFloat(pricePerKm).toFixed(2).toString() : undefined,
        };
    });
    return roundedDistances;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    let capPricePerDistances: CapPricePerDistances[] = [];
    let i = 0;
    let errors: ErrorInfo[] = [];

    while (req.body[`pricePerKm${i}`] !== undefined || req.body[`minimumPrice${i}`] !== undefined) {
        const distanceFrom = req.body[`distanceFrom${i}`];
        const distanceTo = req.body[`distanceTo${i}`];
        const minimumPrice = req.body[`minimumPrice${i}`];
        const maximumPrice = req.body[`maximumPrice${i}`];
        const pricePerKm = req.body[`pricePerKm${i}`];
        const capPricingPerDistance = {
            distanceFrom,
            distanceTo,
            minimumPrice,
            maximumPrice,
            pricePerKm,
        };
        capPricePerDistances.push(capPricingPerDistance);
        i += 1;
    }
    capPricePerDistances[0] = { ...capPricePerDistances[0], distanceFrom: '0' };
    capPricePerDistances[i - 1] = { ...capPricePerDistances[i - 1], distanceTo: 'Max' };
    errors = validateInput(capPricePerDistances, i - 1);
    if (errors.length > 0) {
        updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, { errors, capPricePerDistances });
        redirectTo(res, '/defineCapPricingPerDistance');
        return;
    }
    capPricePerDistances = roundAllDistances(capPricePerDistances);
    updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, { capPricePerDistances, errors: [] });

    updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
        errors: [{ id: '', errorMessage: 'Next page to be made soon!' }],
        capPricePerDistances,
    });
    redirectTo(res, '/defineCapPricingPerDistance');
    return;
};
