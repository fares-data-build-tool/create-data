import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from './apiUtils/index';
import { sanitiseReqBody } from './selectSalesOfferPackage';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        

        const { sanitisedBody, errors } = sanitiseReqBody(req);

        console.log(sanitisedBody);
        console.log(errors);
        console.log(req.body);
        redirectTo(res, '/selectPurchaseMethods');


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
        const message = 'There was a problem in the selectPurchaseMethods API.';
        redirectToError(res, message, 'api.selectPurchaseMethods', error);
    }
};
