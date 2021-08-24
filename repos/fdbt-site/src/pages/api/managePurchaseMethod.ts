import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, getAndValidateNoc } from './apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession, SalesOfferPackage } from '../../interfaces';
import { GS_PURCHASE_METHOD_ATTRIBUTE } from '../../constants/attributes';
import { paymentMethodsList, purchaseLocationsList, ticketFormatsList } from '../managePurchaseMethod';
import { toArray } from '../../utils';
import { FromDb } from '../../../shared/matchingJsonTypes';
import { removeExcessWhiteSpace } from './apiUtils/validator';
import { insertSalesOfferPackage } from '../../data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const errors: ErrorInfo[] = [];
    const id: any = undefined; // Temporary until edit

    try {
        const {
            purchaseLocations,
            paymentMethods,
            ticketFormats,
            name,
        }: {
            purchaseLocations?: string | string[];
            paymentMethods?: string | string[];
            ticketFormats?: string | string[];
            name?: string;
        } = req.body;

        if (!purchaseLocations) {
            errors.push({
                errorMessage: 'Select at least one option for where the ticket can be sold',
                id: purchaseLocationsList.id,
            });
        }

        if (!paymentMethods) {
            errors.push({
                errorMessage: 'Select at least one option for how tickets can be paid for',
                id: paymentMethodsList.id,
            });
        }

        if (!ticketFormats) {
            errors.push({
                errorMessage: 'Select at least one option for the ticket format',
                id: ticketFormatsList.id,
            });
        }

        const trimmedName = removeExcessWhiteSpace(name);

        if (trimmedName.length < 1) {
            errors.push({ id: 'purchase-method-name', errorMessage: 'Name must be provided' });
        }

        if (trimmedName.length >= 50) {
            errors.push({ id: 'purchase-method-name', errorMessage: 'Name must be 50 characters or fewer' });
        }

        const salesOfferPackage: FromDb<SalesOfferPackage> = {
            id,
            name: trimmedName,
            purchaseLocations: toArray(purchaseLocations),
            paymentMethods: toArray(paymentMethods),
            ticketFormats: toArray(ticketFormats),
        };

        if (errors.length > 0) {
            updateSessionAttribute(req, GS_PURCHASE_METHOD_ATTRIBUTE, { inputs: salesOfferPackage, errors });

            redirectTo(res, '/managePurchaseMethod');
            return;
        }

        await insertSalesOfferPackage(getAndValidateNoc(req, res), salesOfferPackage);
        updateSessionAttribute(req, GS_PURCHASE_METHOD_ATTRIBUTE, undefined);
        redirectTo(res, '/viewPurchaseMethods');
    } catch (err) {
        const message = 'There was a problem in the sales offer package API.';
        redirectToError(res, message, 'api.salesOfferPackages', err);
    }
};
