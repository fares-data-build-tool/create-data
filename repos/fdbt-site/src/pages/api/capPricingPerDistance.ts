import { NextApiResponse } from 'next';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from 'src/constants/attributes';
import { redirectTo } from 'src/utils/apiUtils';
import { isValidNumber } from 'src/utils/apiUtils/validator';
import { updateSessionAttribute } from 'src/utils/sessions';
import { CapPricePerDistances, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export const validateInput = (capPricePerDistances: CapPricePerDistances[], lastIndex: number): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    capPricePerDistances.forEach((cap, index: number) => {
        const { distanceFrom, minimumPrice, maximumPrice, distanceTo, pricePerKm } = cap;
        if (lastIndex !== index) {
            if (!distanceTo || !isValidNumber(Number(distanceTo))) {
                errors.push({ id: '', errorMessage: 'Distance to must be defined and a number' });
            }
        }
        if (index === 0) {
            if (!minimumPrice || !isValidNumber(Number(minimumPrice))) {
                errors.push({ id: '', errorMessage: 'Minimum price to must be defined and a number' });
            }
            if (!maximumPrice || !isValidNumber(Number(maximumPrice))) {
                errors.push({ id: '', errorMessage: 'Maximum price to must be defined and a number' });
            }
        } else {
            if (!pricePerKm || !isValidNumber(Number(pricePerKm))) {
                errors.push({ id: '', errorMessage: 'Price per km price to must be defined and a number' });
            }
            if (!distanceFrom || !isValidNumber(Number(distanceFrom))) {
                errors.push({ id: '', errorMessage: 'Distance from must be defined and a number' });
            }
        }
    });

    return errors;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const capPricePerDistances: CapPricePerDistances[] = [];
    let i = 0;
    let errors: ErrorInfo[] = [];

    while (req.body[`pricePerKm${i}`] !== undefined || req.body[`minimumPrice${i}`] !== undefined) {
        const distanceFrom = req.body[`distanceFrom${i}`];
        const distanceTo = req.body[`distanceTo${i}`];
        const minimumPrice = req.body[`minimumPrice${i}`];
        const maximumPrice = req.body[`maximumPrice${i}`];
        const pricePerKm = req.body[`pricePerKm${i}`];
        const capPricingPerDistance = {
            distanceFrom: distanceFrom,
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

    if (errors.length > 1) {
        updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, { errors, capPricePerDistances });
        redirectTo(res, '/defineCapPricingPerDistance');
        return;
    }

    updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, { capPricePerDistances, errors: [] });

    updateSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
        errors: [{ id: '', errorMessage: 'Next page to be made soon!' }],
        capPricePerDistances,
    });
    redirectTo(res, '/defineCapPricingPerDistance');
    return;
};
