import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import {
    ErrorInfo,
    NextApiRequestWithSession,
    SalesOfferPackageInfo,
    SalesOfferPackageInfoWithErrors,
} from '../../interfaces';
import { SOP_INFO_ATTRIBUTE } from '../../constants/attributes';
import { toArray } from '../../utils';
import { paymentMethodsList, purchaseLocationsList, ticketFormatsList } from '../managePurchaseMethod';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const errors: ErrorInfo[] = [];

    try {
        const {
            purchaseLocations,
            paymentMethods,
            ticketFormats,
        }: {
            purchaseLocations?: string | string[];
            paymentMethods?: string | string[];
            ticketFormats?: string | string[];
        } = req.body;

        if (!purchaseLocations) {
            errors.push({
                errorMessage: 'Select at least one ticket purchase location',
                id: purchaseLocationsList(false).id,
            });
        }

        if (!paymentMethods) {
            errors.push({
                errorMessage: 'Select at least one ticket payment method',
                id: paymentMethodsList(false).id,
            });
        }

        if (!ticketFormats) {
            errors.push({
                errorMessage: 'Select at least one ticket media format',
                id: ticketFormatsList(false).id,
            });
        }

        const salesOfferPackageInfo: SalesOfferPackageInfo = {
            purchaseLocations: toArray(purchaseLocations),
            paymentMethods: toArray(paymentMethods),
            ticketFormats: toArray(ticketFormats),
        };

        if (errors.length > 0) {
            (salesOfferPackageInfo as SalesOfferPackageInfoWithErrors).errors = errors;
            updateSessionAttribute(req, SOP_INFO_ATTRIBUTE, salesOfferPackageInfo);

            redirectTo(res, '/salesOfferPackages');
            return;
        }

        updateSessionAttribute(req, SOP_INFO_ATTRIBUTE, salesOfferPackageInfo);

        redirectTo(res, '/describeSalesOfferPackage');
    } catch (err) {
        const message = 'There was a problem in the sales offer package API.';
        redirectToError(res, message, 'api.salesOfferPackages', err);
    }
};
