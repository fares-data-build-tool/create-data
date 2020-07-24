import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { redirectTo, redirectToError } from './apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { SOP_INFO_ATTRIBUTE } from '../../constants';
import { purchaseLocationsList, paymentMethodsList, ticketFormatsList } from '../salesOfferPackages';

export interface SalesOfferPackageInfo {
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
}

export interface SalesOfferPackageInfoWithErrors extends SalesOfferPackageInfo {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const errors: ErrorInfo[] = [];

    try {
        let { purchaseLocations, paymentMethods, ticketFormats } = req.body;

        if (!purchaseLocations) {
            errors.push({
                errorMessage: 'Select at least one ticket purchase location',
                id: purchaseLocationsList.id,
            });
        }

        if (!paymentMethods) {
            errors.push({
                errorMessage: 'Select at least one ticket payment method',
                id: paymentMethodsList.id,
            });
        }

        if (!ticketFormats) {
            errors.push({
                errorMessage: 'Select at least one ticket media format',
                id: ticketFormatsList.id,
            });
        }

        if (purchaseLocations && !isArray(purchaseLocations)) {
            purchaseLocations = purchaseLocations.split();
        }

        if (paymentMethods && !isArray(paymentMethods)) {
            paymentMethods = paymentMethods.split();
        }

        if (ticketFormats && !isArray(ticketFormats)) {
            ticketFormats = ticketFormats.split();
        }

        const salesOfferPackageInfo: SalesOfferPackageInfo = {
            purchaseLocations: purchaseLocations || [],
            paymentMethods: paymentMethods || [],
            ticketFormats: ticketFormats || [],
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
        redirectToError(res, message, err);
    }
};
