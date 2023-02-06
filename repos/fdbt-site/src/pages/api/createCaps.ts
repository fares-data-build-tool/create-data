import { NextApiResponse } from 'next';
import { CAPS_ATTRIBUTE } from '../../constants/attributes';
import { Cap, ErrorInfo, NextApiRequestWithSession } from '../../interfaces/index';
import { ExpiryUnit } from '../../interfaces/matchingJsonTypes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import {
    checkDurationIsValid,
    checkPriceIsValid,
    checkProductOrCapNameIsValid,
    isValidInputDuration,
    removeExcessWhiteSpace,
} from '../../utils/apiUtils/validator';
import { updateSessionAttribute } from '../../utils/sessions';

export interface InputtedCap {
    name: string | undefined;
    price: string | undefined;
    durationAmount: string | undefined;
    durationUnits: string | undefined;
}

export const validateAndFormatCapInputs = (
    inputtedCaps: InputtedCap[],
    cappedProductName: string | undefined,
): { errors: ErrorInfo[]; caps: Cap[] } => {
    const errors: ErrorInfo[] = [];
    const caps: Cap[] = [];
    const capNames = inputtedCaps.map((cap) => cap.name);

    const productNameError = checkProductOrCapNameIsValid(cappedProductName || '', 'product');

    if (productNameError) {
        errors.push({ errorMessage: productNameError, id: 'capped-product-name' });
    }

    inputtedCaps.forEach((cap, index) => {
        const trimmedCapName = removeExcessWhiteSpace(cap.name);
        const duplicateError =
            capNames.filter((item) => item === cap.name).length > 1 ? 'Cap names must be unique' : '';
        const capNameError = checkProductOrCapNameIsValid(trimmedCapName, 'cap') || duplicateError;

        if (capNameError) {
            errors.push({ errorMessage: capNameError, id: `cap-name-${index}` });
        }

        const trimmedCapPrice = removeExcessWhiteSpace(cap.price);
        const capPriceError = checkPriceIsValid(trimmedCapPrice, 'cap');

        if (capPriceError) {
            errors.push({ errorMessage: capPriceError, id: `cap-price-${index}` });
        }

        const trimmedCapDurationAmount = removeExcessWhiteSpace(cap.durationAmount);
        const capDurationAmountError = checkDurationIsValid(trimmedCapDurationAmount, 'cap');

        if (capDurationAmountError) {
            errors.push({ errorMessage: capDurationAmountError, id: `cap-period-duration-quantity-${index}` });
        }

        const capDurationUnitsError = !isValidInputDuration(cap.durationUnits as string, false)
            ? 'Choose an option from the dropdown'
            : '';

        if (capDurationUnitsError) {
            errors.push({ errorMessage: capDurationUnitsError, id: `cap-duration-unit-${index}` });
        }

        caps.push({
            name: trimmedCapName,
            price: trimmedCapPrice,
            durationAmount: trimmedCapDurationAmount,
            durationUnits: cap.durationUnits as ExpiryUnit,
        });
    });

    return {
        errors,
        caps,
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const inputtedCaps: InputtedCap[] = [];
        let i = 0;
        const { cappedProductName } = req.body;
        while (req.body[`capNameInput${i}`] !== undefined) {
            const capName = req.body[`capNameInput${i}`] as string | undefined;
            const capPrice = req.body[`capPriceInput${i}`] as string | undefined;
            const capDurationAmount = req.body[`capDurationInput${i}`] as string | undefined;
            const capDurationUnits = req.body[`capDurationUnitsInput${i}`] as string | undefined;

            const inputtedCap: InputtedCap = {
                name: capName,
                price: capPrice,
                durationAmount: capDurationAmount,
                durationUnits: capDurationUnits,
            };
            inputtedCaps.push(inputtedCap);
            i += 1;
        }

        const { caps, errors } = validateAndFormatCapInputs(inputtedCaps, cappedProductName);

        if (errors.length > 0) {
            updateSessionAttribute(req, CAPS_ATTRIBUTE, { errors, caps, productName: cappedProductName });
            redirectTo(res, '/createCaps');
            return;
        }
        updateSessionAttribute(req, CAPS_ATTRIBUTE, { caps, productName: cappedProductName });

        redirectTo(res, '/selectCapExpiry');
        return;
    } catch (error) {
        const message = 'There was a problem in the create caps API:';
        redirectToError(res, message, 'api.createCaps', error);
    }
};
