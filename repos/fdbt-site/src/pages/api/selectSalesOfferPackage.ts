import { NextApiResponse } from 'next';
import { globalSettingsEnabled } from '../../constants/featureFlag';
import { MULTIPLE_PRODUCT_ATTRIBUTE, SALES_OFFER_PACKAGES_ATTRIBUTE } from '../../constants/attributes';
import {
    ErrorInfo,
    NextApiRequestWithSession,
    ProductWithSalesOfferPackages,
    SalesOfferPackage,
    SelectSalesOfferPackageWithError,
} from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { checkPriceIsValid, removeAllWhiteSpace, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';

interface SanitisedBodyAndErrors {
    sanitisedBody: { [key: string]: SalesOfferPackage[] };
    errors: ErrorInfo[];
}

const productPrefix = 'product-';
const pricePrefix = 'price-';

export const sanitiseReqBody = (req: NextApiRequestWithSession): SanitisedBodyAndErrors => {
    const sanitisedBody: { [key: string]: SalesOfferPackage[] } = {};

    const errors: ErrorInfo[] = [];
    Object.entries(req.body).forEach((item) => {
        const [key, value]: [string, unknown] = item;

        if (key.startsWith(productPrefix)) {
            if (value && Array.isArray(value)) {
                sanitisedBody[key.substring(productPrefix.length)] = value
                    .filter((a) => a)
                    .map((it) => JSON.parse(it) as SalesOfferPackage);
            } else {
                errors.push({
                    errorMessage: 'Choose at least one sales offer package from the options',
                    id: `${removeAllWhiteSpace(key)}-checkbox-0`,
                });
            }
        } else if (key.startsWith(pricePrefix) && typeof value === 'string') {
            const price = removeExcessWhiteSpace(value);

            const productName = Object.keys(sanitisedBody).find((productName) =>
                key.startsWith(pricePrefix + productName),
            );
            if (!productName) {
                throw new Error(`Unknown product name passed for sop price ${key}:${value}`);
            }
            const sopName = key.substring(`${pricePrefix}${productName}-`.length);

            const sop = sanitisedBody[productName].find((sop) => sop.name === sopName);
            if (!sop) {
                throw new Error(`Unknown sop passed for sop price ${key}:${value}`);
            }

            const priceError = checkPriceIsValid(price);
            if (priceError) {
                errors.push({
                    errorMessage: priceError,
                    id: `price-${removeAllWhiteSpace(productName)}-${removeAllWhiteSpace(sopName)}`,
                });
            }

            sop.price = price;
        } else {
            throw new Error(`Unknown property passed for sop ${key}:${value}`);
        }
    });

    return {
        sanitisedBody,
        errors,
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { sanitisedBody, errors } = sanitiseReqBody(req);

        if (errors.length > 0) {
            const salesOfferPackagesAttributeError: SelectSalesOfferPackageWithError = {
                errors,
                selected: sanitisedBody,
            };
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackagesAttributeError);
            if (globalSettingsEnabled) {
                redirectTo(res, '/selectPurchaseMethods');
                return;
            }
            redirectTo(res, `/selectSalesOfferPackage`);
            return;
        }

        const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
        const products = multipleProductAttribute ? multipleProductAttribute.products : [];

        if (products.length === 0) {
            const salesOfferPackages: SalesOfferPackage[] = Object.entries(sanitisedBody)[0][1];

            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackages);
        } else {
            const keys: string[] = Object.keys(sanitisedBody);
            const productsAndSalesOfferPackages: ProductWithSalesOfferPackages[] = keys.map((objectKey) => {
                return {
                    productName: objectKey,
                    salesOfferPackages: sanitisedBody[objectKey],
                };
            });
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, productsAndSalesOfferPackages);
        }
        redirectTo(res, '/productDateInformation');
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected sales offer packages from the salesOfferPackage page:';
        redirectToError(res, message, 'api.selectSalesOfferPackage', error);
    }
};
