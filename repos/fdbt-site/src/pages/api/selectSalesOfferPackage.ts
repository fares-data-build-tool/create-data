import { NextApiResponse } from 'next';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    CAPS_ATTRIBUTE,
    CAP_PRICING_PER_DISTANCE_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    TYPE_OF_CAP_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import {
    CapDetails,
    DistanceCap,
    ErrorInfo,
    FareType,
    NextApiRequestWithSession,
    ProductWithSalesOfferPackages,
    SchoolFareTypeAttribute,
    SelectSalesOfferPackageWithError,
    TypeOfCap,
} from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { checkPriceIsValid, removeAllWhiteSpace, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { toArray } from '../../utils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { SalesOfferPackage, Ticket, WithIds } from '../../interfaces/matchingJsonTypes';

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
            const priceError = checkPriceIsValid(price, 'product');
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

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;
        const schoolFareTypeAttribute = getSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;

        const fareType =
            fareTypeAttribute.fareType === 'schoolService' && !!schoolFareTypeAttribute
                ? schoolFareTypeAttribute.schoolFareType
                : fareTypeAttribute.fareType;

        let cappedProductName = '';

        if (fareType === 'capped') {
            const { typeOfCap } = getSessionAttribute(req, TYPE_OF_CAP_ATTRIBUTE) as TypeOfCap;

            if (typeOfCap === 'byDistance') {
                const distanceCap = getSessionAttribute(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE) as DistanceCap;
                cappedProductName = distanceCap.productName;
            } else {
                const capDetails = getSessionAttribute(req, CAPS_ATTRIBUTE) as CapDetails;
                cappedProductName = capDetails.productName;
            }
        }

        const products = multipleProductAttribute
            ? multipleProductAttribute.products
            : ticket &&
              'products' in ticket &&
              'productName' in ticket.products[0] &&
              'productPrice' in ticket.products[0]
            ? [{ productName: ticket.products[0].productName, productPrice: ticket.products[0].productPrice }]
            : !!cappedProductName
            ? [{ productName: cappedProductName, productPrice: '' }]
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
            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
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
            const key = !!cappedProductName ? cappedProductName : 'product';
            const salesOfferPackages: SalesOfferPackage[] = sanitisedBody[key];

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
