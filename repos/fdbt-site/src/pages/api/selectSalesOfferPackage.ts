import { NextApiResponse } from 'next';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../../constants/attributes';
import {
    ErrorInfo,
    NextApiRequestWithSession,
    ProductWithSalesOfferPackages,
    SalesOfferPackage,
    SelectSalesOfferPackageWithError,
    Ticket,
} from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { checkPriceIsValid, removeAllWhiteSpace, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { toArray } from '../../utils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { WithIds } from 'fdbt-types/matchingJsonTypes';

interface SanitisedBodyAndErrors {
    sanitisedBody: { [key: string]: SalesOfferPackage[] };
    errors: ErrorInfo[];
}

const productPrefix = 'product-';
const pricePrefix = 'price-';

export const sanitiseReqBody = (
    req: NextApiRequestWithSession,
    products: { productName: string }[],
): SanitisedBodyAndErrors => {
    const errors: ErrorInfo[] = [];

    const sanitisedBody = products.reduce((sanitisedBody, product) => {
        const sopInput = req.body[`${productPrefix}${product.productName}`];

        if (!sopInput) {
            errors.push({
                errorMessage: 'Choose at least one sales offer package from the options',
                id: `${productPrefix}${removeAllWhiteSpace(product.productName)}-checkbox-0`,
            });
            return sanitisedBody;
        }

        const sops = toArray(sopInput).map((sop) => JSON.parse(sop) as SalesOfferPackage);

        const sopsWithPrices = sops.map((sop) => {
            const priceInput = req.body[`${pricePrefix}${product.productName}-${sop.id}`];
            if (priceInput === undefined) {
                return sop;
            }
            const price = removeExcessWhiteSpace(priceInput);
            const priceError = checkPriceIsValid(price);
            if (priceError) {
                errors.push({
                    errorMessage: priceError,
                    id: `price-${removeAllWhiteSpace(product.productName)}-${sop.id}`,
                });
            }
            return {
                ...sop,
                price,
            };
        });

        sanitisedBody[product.productName] = sopsWithPrices;
        return sanitisedBody;
    }, {} as { [key: string]: SalesOfferPackage[] });

    return {
        sanitisedBody,
        errors,
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        const products = multipleProductAttribute
            ? multipleProductAttribute.products
            : ticket && 'productName' in ticket.products[0]
            ? [{ productName: ticket.products[0].productName, productPrice: ticket.products[0].productPrice }]
            : [{ productName: 'product', productPrice: '' }];

        const { sanitisedBody, errors } = sanitiseReqBody(req, products);

        if (errors.length > 0) {
            const salesOfferPackagesAttributeError: SelectSalesOfferPackageWithError = {
                errors,
                selected: sanitisedBody,
            };
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackagesAttributeError);
            redirectTo(res, '/selectPurchaseMethods');
            return;
        }

        // redirected from the product details page
        if (ticket && matchingJsonMetaData) {
            const product = ticket.products[0];

            const productName = 'productName' in product ? product.productName : 'product';
            // edit mode
            const salesOfferPackages: SalesOfferPackage[] = sanitisedBody[productName];

            const updatedTicket: WithIds<Ticket> = {
                ...ticket,
                products: [
                    {
                        ...ticket.products[0],
                        salesOfferPackages: salesOfferPackages.map((sop) => {
                            return { id: sop.id, price: sop.price };
                        }),
                    },
                ],
            };

            // put the now updated matching json into s3
            // eslint-disable-next-line
            putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, undefined);
            redirectTo(
                res,
                `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                    matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                }`,
            );
            return;
        }

        if (!multipleProductAttribute) {
            const salesOfferPackages: SalesOfferPackage[] = sanitisedBody['product'];

            updateSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE, salesOfferPackages);
        } else {
            const productNameKeys: string[] = Object.keys(sanitisedBody);
            const productsAndSalesOfferPackages: ProductWithSalesOfferPackages[] = productNameKeys.map(
                (productNameKey) => {
                    return {
                        productName: productNameKey,
                        salesOfferPackages: sanitisedBody[productNameKey],
                    };
                },
            );
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
