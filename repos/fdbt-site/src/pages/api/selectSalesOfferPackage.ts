import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import { SalesOfferPackage, NextApiRequestWithSession, ProductWithSalesOfferPackages } from '../../interfaces/index';
import { redirectTo, redirectToError } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { SALES_OFFER_PACKAGES_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants';

import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export interface SelectSalesOfferPackageWithError {
    errorMessage: string;
    selected: { [key: string]: string };
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
        const products = multipleProductAttribute ? multipleProductAttribute.products : [];

        if (!req.body || Object.keys(req.body).length === 0) {
            const salesOfferPackagesAttributeError: SelectSalesOfferPackageWithError = {
                errorMessage: 'Choose at least one sales offer package from the options',
                selected: req.body,
            };
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackagesAttributeError);
            redirectTo(res, `/selectSalesOfferPackage`);
            return;
        }

        if (Object.keys(req.body).length < products.length) {
            const salesOfferPackagesAttributeError: SelectSalesOfferPackageWithError = {
                errorMessage: 'Choose at least one sales offer package for each product',
                selected: req.body,
            };
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackagesAttributeError);
            redirectTo(res, `/selectSalesOfferPackage`);
            return;
        }
        if (products.length === 0) {
            const salesOfferPackages: SalesOfferPackage[] = Object.entries(req.body).map(sop => {
                const salesOfferPackage: SalesOfferPackage = JSON.parse(sop[1] as string);
                return salesOfferPackage;
            });

            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackages);
        } else {
            const keys: string[] = Object.keys(req.body);
            const productsAndSalesOfferPackages: ProductWithSalesOfferPackages[] = keys.map(objectKey => {
                const content: string | string[] = req.body[objectKey];
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
