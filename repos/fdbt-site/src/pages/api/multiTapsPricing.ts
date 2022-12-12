import { NextApiResponse } from 'next';
import { MULTI_TAPS_PRICING_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, MultiTapPricing, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { checkPriceIsValid, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';

export const checkAllValidation = (taps: MultiTapPricing): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];

    Object.entries(taps).forEach((entry) => {
        const tapPrice = entry[1];
        const index = entry[0];
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
        const multiTaps: MultiTapPricing = {};
        let i = 0;
        while (req.body[`multiTapPriceInput${i}`] !== undefined) {
            const tapPrice = req.body[`multiTapPriceInput${i}`];

            multiTaps[i.toString()] = tapPrice;
            i += 1;
        }

        const errors = checkAllValidation(multiTaps);
        //console.log(multiTaps);

        //const attrib : WithErrors<MultiTapPricing> = {errors: errors, "2": "22" };
        // let attrib :WithErrors<MultiTapPricing> = {errors};
        // //attrib.errors = errors;
        // Object.entries(multiTaps).forEach((entry) => {
        //     attrib[entry[0]] = entry[1];
        // });

        if (errors.length > 0) {
            //updateSessionAttribute(req, MULTI_TAPS_PRICING_ATTRIBUTE, {errors, ...multiTaps});
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
