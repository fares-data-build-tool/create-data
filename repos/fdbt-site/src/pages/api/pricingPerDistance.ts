import { startCase } from 'lodash';
import { NextApiResponse } from 'next';
import { PRICING_PER_DISTANCE_ATTRIBUTE } from '../../constants/attributes';
import { getFareTypeFromFromAttributes, redirectTo } from '../../utils/apiUtils';
import { checkProductOrCapNameIsValid, isCurrency } from '../../utils/apiUtils/validator';
import { updateSessionAttribute } from '../../utils/sessions';
import { DistancePricing, DistancePricingData, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

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
    capPricePerDistances: DistancePricing[],
    lastIndex: number,
    minimumPrice: string,
    maximumPrice: string,
    productName: string,
): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];

    const cappedProductNameError = checkProductOrCapNameIsValid(productName, 'product');
    if (cappedProductNameError) {
        errors.push({
            id: 'capped-product-name',
            errorMessage: cappedProductNameError,
        });
    }
    const minimumPriceError = checkInputIsValid(minimumPrice, 'price');
    if (minimumPriceError) {
        errors.push({
            id: 'minimum-price',
            errorMessage: minimumPriceError,
        });
    }
    const maximumPriceError = checkInputIsValid(maximumPrice, 'price');
    if (maximumPriceError) {
        errors.push({
            id: 'maximum-price',
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
    const capPricePerDistances: DistancePricing[] = [];
    let i = 0;
    let errors: ErrorInfo[] = [];
    const { productName, minimumPrice, maximumPrice } = req.body;

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
    errors = validateInput(capPricePerDistances, i - 1, minimumPrice, maximumPrice, productName);
    const distanceCap: DistancePricingData = {
        maximumPrice,
        minimumPrice,
        capPricing: capPricePerDistances,
        productName: productName,
    };
    if (errors.length > 0) {
        updateSessionAttribute(req, PRICING_PER_DISTANCE_ATTRIBUTE, {
            errors,
            ...distanceCap,
        });
        redirectTo(res, '/definePricingPerDistance');
        return;
    }

    updateSessionAttribute(req, PRICING_PER_DISTANCE_ATTRIBUTE, distanceCap);
    const fareType = getFareTypeFromFromAttributes(req);
    if (fareType === 'flatFare') {
        redirectTo(res, '/ticketConfirmation');
    }
    redirectTo(res, '/additionalPricingStructures');
    return;
};
