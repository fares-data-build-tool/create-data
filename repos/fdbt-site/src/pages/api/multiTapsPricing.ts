import { NextApiResponse } from 'next';
import { MULTI_TAPS_PRICING_ATTRIBUTE, NUMBER_OF_TAPS_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, MultiTapPricing, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { checkPriceIsValid, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';

export const checkAllValidation = (taps: MultiTapPricing[]): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];

    taps.forEach((tap, index) => {
        const { tapPrice } = tap;
        const trimmedPrice = removeExcessWhiteSpace(tapPrice);
        const tapPriceError = checkPriceIsValid(trimmedPrice, 'cap', true);

        if (tapPriceError) {
            errors.push({ errorMessage: tapPriceError, id: `multi-tap-price-${index}` });
        }
    });

    return errors;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const multiTaps: MultiTapPricing[] = [];
        let i = 0;
        while (req.body[`multiTapPriceInput${i}`] !== undefined) {
            const tapPrice = req.body[`multiTapPriceInput${i}`];
            const tapPriceId = `multi-tap-price-${i}`;

            const product: MultiTapPricing = {
                tapPrice,
                tapPriceId,
            };
            multiTaps.push(product);
            i += 1;
        }

        const errors = checkAllValidation(multiTaps);

        const numberOfTaps = multiTaps.length;
        if (numberOfTaps !== 0) {
            updateSessionAttribute(req, NUMBER_OF_TAPS_ATTRIBUTE, numberOfTaps);
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, MULTI_TAPS_PRICING_ATTRIBUTE, errors);
            redirectTo(res, '/multiTapsPricing');
            return;
        }

        updateSessionAttribute(req, MULTI_TAPS_PRICING_ATTRIBUTE, multiTaps);
        redirectTo(res, '/createCaps');
        return;
    } catch (error) {
        const message = 'There was a problem inputting the tap price:';
        redirectToError(res, message, 'api.multiTapsPricing', error);
    }
};
