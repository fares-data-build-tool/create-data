import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, getAndValidateNoc } from '../../utils/apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { GS_PURCHASE_METHOD_ATTRIBUTE } from '../../constants/attributes';
import { paymentMethodsList, purchaseLocationsList, ticketFormatsList } from '../managePurchaseMethod';
import { toArray } from '../../utils';
import { invalidCharactersArePresent, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import {
    insertSalesOfferPackage,
    getSalesOfferPackagesByNocCode,
    updateSalesOfferPackage,
    getSalesOfferPackageByIdAndNoc,
} from '../../data/auroradb';
import { FromDb, SalesOfferPackage } from '../../interfaces/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const errors: ErrorInfo[] = [];

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

        const id = req.body.id && Number(req.body.id);
        const isCapped = req.body.isCapped === 'true';

        if (!purchaseLocations) {
            errors.push({
                errorMessage: 'Select at least one option for where the ticket can be sold',
                id: purchaseLocationsList(isCapped).id,
            });
        }

        if (!paymentMethods) {
            errors.push({
                errorMessage: 'Select at least one option for how tickets can be paid for',
                id: paymentMethodsList(isCapped).id,
            });
        }

        if (!ticketFormats) {
            errors.push({
                errorMessage: 'Select at least one option for the ticket format',
                id: ticketFormatsList(isCapped).id,
            });
        }

        const trimmedName = removeExcessWhiteSpace(name);

        const nameHasInvalidCharacters = invalidCharactersArePresent(trimmedName);

        if (nameHasInvalidCharacters) {
            errors.push({
                id: 'purchase-method-name',
                errorMessage: 'Purchase method name has an invalid character',
            });
        }

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
            isCapped,
        };

        const noc = getAndValidateNoc(req, res);

        if (errors.length === 0) {
            const results = await getSalesOfferPackagesByNocCode(noc);

            if (results.some((sop) => sop.id !== id && sop.name.toLowerCase() === trimmedName.toLowerCase())) {
                errors.push({
                    errorMessage: `You already have a purchase method named ${trimmedName}. Choose another name.`,
                    id: 'purchase-method-name',
                });
            }

            if (id) {
                const purchaseDetails = await getSalesOfferPackageByIdAndNoc(id, noc);
                if (purchaseDetails.isCapped) {
                    const validPurchaseLocations = purchaseLocationsList(true).method;
                    const isValidPurchaseLocation = toArray(purchaseLocations).every((purchaseLoc) =>
                        validPurchaseLocations.includes(purchaseLoc),
                    );

                    if (!isValidPurchaseLocation) {
                        errors.push({
                            errorMessage: `Select the valid option(s) for the purchase locations.`,
                            id: purchaseLocationsList(true).id,
                        });
                    }

                    const validPaymentMethods = paymentMethodsList(true).paymentMethods;
                    const isValidPaymentMethod = toArray(paymentMethods).every((paymentMethod) =>
                        validPaymentMethods.includes(paymentMethod),
                    );

                    if (!isValidPaymentMethod) {
                        errors.push({
                            errorMessage: `Select the valid option(s) for the payment method.`,
                            id: paymentMethodsList(true).id,
                        });
                    }

                    const ticketFormatsValue = ticketFormatsList(true).ticketFormats.map(
                        (ticketFormat) => ticketFormat.value,
                    );
                    const isValidTicketFormat = toArray(ticketFormats).every((ticketFormatValue) =>
                        ticketFormatsValue.includes(ticketFormatValue),
                    );

                    if (!isValidTicketFormat) {
                        errors.push({
                            errorMessage: `Select the valid option(s) for the ticket format.`,
                            id: ticketFormatsList(true).id,
                        });
                    }
                }
            }
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, GS_PURCHASE_METHOD_ATTRIBUTE, { inputs: salesOfferPackage, errors });
            const cappedPart = isCapped ? 'isCapped=true' : '';
            const idPart = id ? `id=${id}` : '';
            const andSymbol = !!cappedPart && !!idPart ? '&' : '';
            const querySymbol = cappedPart || idPart ? '?' : '';
            const queryString = `${querySymbol}${cappedPart}${andSymbol}${idPart}`;

            redirectTo(res, `/managePurchaseMethod${queryString}`);
            return;
        }

        await (id ? updateSalesOfferPackage : insertSalesOfferPackage)(noc, salesOfferPackage);

        updateSessionAttribute(req, GS_PURCHASE_METHOD_ATTRIBUTE, undefined);

        redirectTo(res, '/viewPurchaseMethods');
    } catch (err) {
        const message = 'There was a problem in the sales offer package API.';
        redirectToError(res, message, 'api.salesOfferPackages', err);
    }
};
