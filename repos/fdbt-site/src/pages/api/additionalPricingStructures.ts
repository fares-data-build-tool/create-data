import { NextApiResponse } from 'next';
import { ADDITIONAL_PRICING_ATTRIBUTE } from '../../../src/constants/attributes';
import { redirectTo } from '../../../src/utils/apiUtils';
import { isCurrency } from '../../../src/utils/apiUtils/validator';
import { updateSessionAttribute } from '../../../src/utils/sessions';
import { AdditionalPricing, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export const checkInputIsValid = (inputtedValue: string | undefined, inputType: string): string => {
    let error;

    if (!inputtedValue) {
        error = `Enter a value for the ${inputType}`;
    } else if (Math.sign(Number(inputtedValue)) === -1) {
        error =
            inputType === 'structure discount'
                ? 'Percentage discount cannot be a negative number'
                : 'Time allowance after first journey cannot be a negative number';
    } else if (!isCurrency(inputtedValue) && inputType === 'structure discount') {
        error = 'This must be a valid structure discount number to 2 decimal places';
    } else if (!Number.isInteger(Number(inputtedValue)) && inputType === 'pricing structure') {
        error = 'Pricing structure must be a whole number';
    }

    if (error) {
        return error;
    }
    return '';
};

export const validateAdditionalStructuresInput = (
    additionalDiscounts: string,
    pricingStructureStart: string,
    structureDiscount: string,
): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    if (additionalDiscounts !== 'yes' && additionalDiscounts !== 'no') {
        errors.push({ id: 'additional-discounts', errorMessage: 'Select an option' });
    }
    if (additionalDiscounts === 'yes') {
        const pricingStructureStartError = checkInputIsValid(pricingStructureStart, 'pricing structure');
        if (pricingStructureStartError) {
            errors.push({ id: 'pricing-structure-start', errorMessage: pricingStructureStartError });
        }
        const structureDiscountError = checkInputIsValid(structureDiscount, 'structure discount');
        if (structureDiscountError) {
            errors.push({ id: 'structure-discount', errorMessage: structureDiscountError });
        }
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

    errors = validateAdditionalStructuresInput(additionalDiscounts, pricingStructureStart, structureDiscount);
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
