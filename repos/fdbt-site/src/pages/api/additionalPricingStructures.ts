import { NextApiResponse } from 'next';
import { ADDITIONAL_PRICING_ATTRIBUTE } from '../../../src/constants/attributes';
import { redirectTo } from '../../../src/utils/apiUtils';
import { isCurrency } from '../../../src/utils/apiUtils/validator';
import { updateSessionAttribute } from '../../../src/utils/sessions';
import { AdditionalPricing, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export const checkInputIsValid = (inputtedValue: string | undefined, inputType: string): string => {
    let error = '';

    if (!inputtedValue) {
        error = `Enter a value for the ${inputType}`;
    } else if (Math.sign(Number(inputtedValue)) === -1) {
        error = `${inputType} cannot be a negative number`;
    } else if (!isCurrency(inputtedValue) && inputType === 'Percentage discount') {
        error = 'This must be a valid Percentage discount number to 2 decimal places';
    } else if (!Number.isInteger(Number(inputtedValue)) && inputType === 'Time allowance after first journey') {
        error = 'Time allowance after first journey must be a whole number';
    }

    return error;
};

export const validateAdditionalStructuresInput = (
    pricingStructureStart: string,
    structureDiscount: string,
): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    const pricingStructureStartError = checkInputIsValid(pricingStructureStart, 'Time allowance after first journey');
    if (pricingStructureStartError) {
        errors.push({ id: 'pricing-structure-start', errorMessage: pricingStructureStartError });
    }
    const structureDiscountError = checkInputIsValid(structureDiscount, 'Percentage discount');
    if (structureDiscountError) {
        errors.push({ id: 'structure-discount', errorMessage: structureDiscountError });
    }

    return errors;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    let errors: ErrorInfo[] = [];

    const { additionalDiscounts, pricingStructureStart, structureDiscount } = req.body;

    const additionalPricingStructures: AdditionalPricing = {
        pricingStructureStart,
        structureDiscount,
    };
    if (!additionalDiscounts) {
        updateSessionAttribute(req, ADDITIONAL_PRICING_ATTRIBUTE, {
            clickedYes: additionalDiscounts === 'yes',
            additionalPricingStructures: {
                errors: [{ id: 'additional-discounts', errorMessage: 'Select an option' }],
                ...additionalPricingStructures,
            },
        });
        redirectTo(res, '/additionalPricingStructures');
        return;
    }

    if (additionalDiscounts === 'no') {
        redirectTo(res, '/capConfirmation');
        return;
    }

    errors = validateAdditionalStructuresInput(pricingStructureStart, structureDiscount);

    if (errors.length > 0) {
        updateSessionAttribute(req, ADDITIONAL_PRICING_ATTRIBUTE, {
            clickedYes: additionalDiscounts === 'yes',
            additionalPricingStructures: {
                errors,
                ...additionalPricingStructures,
            },
        });
        redirectTo(res, '/additionalPricingStructures');
        return;
    }

    updateSessionAttribute(req, ADDITIONAL_PRICING_ATTRIBUTE, additionalPricingStructures);

    redirectTo(res, '/capConfirmation');
    return;
};
