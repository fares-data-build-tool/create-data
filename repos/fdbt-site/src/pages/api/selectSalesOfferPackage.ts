import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import {
    SalesOfferPackage,
    NextApiRequestWithSession,
    ErrorInfo,
    ProductWithSalesOfferPackages,
} from '../../interfaces';
import { redirectTo, redirectToError } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, FARE_TYPE_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export interface SelectSalesOfferPackageWithError {
    errors: ErrorInfo[];
    selected: { [key: string]: string[] };
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (!fareTypeAttribute) {
            throw new Error('No fare type session attribute found.');
        }

        const errors: ErrorInfo[] = [];

        const sanitisedBody: { [key: string]: string[] } = {};

        Object.entries(req.body).forEach(item => {
            if (item[1] && isArray(item[1])) {
                sanitisedBody[item[0]] = (item[1] as string[]).filter(a => a !== '');
            } else {
                errors.push({
                    errorMessage: 'Choose at least one sales offer package from the options',
                    id: `${item[0]}-checkbox-0`,
                });
            }
        });

        if (errors.length > 0) {
            const salesOfferPackagesAttributeError: SelectSalesOfferPackageWithError = {
                errors,
                selected: sanitisedBody,
            };
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackagesAttributeError);
            redirectTo(res, `/selectSalesOfferPackage`);
            return;
        }

        const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
        const products = multipleProductAttribute ? multipleProductAttribute.products : [];

        if (products.length === 0) {
            const salesOfferPackages: SalesOfferPackage[] = Object.entries(sanitisedBody)[0][1].map(sop => {
                const salesOfferPackage: SalesOfferPackage = JSON.parse(sop);
                return salesOfferPackage;
            });

            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackages);
        } else {
            const keys: string[] = Object.keys(sanitisedBody);
            const productsAndSalesOfferPackages: ProductWithSalesOfferPackages[] = keys.map(objectKey => {
                const content: string | string[] = sanitisedBody[objectKey];
                if (isArray(content)) {
                    const salesOfferPackages: SalesOfferPackage[] = content.map(sop => {
                        const salesOfferPackage: SalesOfferPackage = JSON.parse(sop);
                        return salesOfferPackage;
                    });
                    const product: ProductWithSalesOfferPackages = {
                        productName: objectKey,
                        salesOfferPackages,
                    };
                    return product;
                }
                const product: ProductWithSalesOfferPackages = {
                    productName: objectKey,
                    salesOfferPackages: [JSON.parse(content)],
                };
                return product;
            });
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, productsAndSalesOfferPackages);
        }
        redirectTo(res, '/confirmation');
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected sales offer packages from the salesOfferPackage page:';
        redirectToError(res, message, 'api.selectSalesOfferPackage', error);
    }
};
