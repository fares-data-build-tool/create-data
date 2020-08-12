import {
    IncomingMessageWithSession,
    ProductInfo,
    ProductData,
    ProductInfoWithErrors,
    GroupDefinition,
    GroupPassengerInfo,
} from '../interfaces';
import { SalesOfferPackageInfo, SalesOfferPackageInfoWithErrors } from '../pages/api/salesOfferPackages';
import { SalesOfferPackage, SalesOfferPackageWithErrors } from '../pages/api/describeSalesOfferPackage';
import { MatchingInfo, MatchingWithErrors, InboundMatchingInfo } from '../interfaces/matchingInterface';
import {
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    SOP_ATTRIBUTE,
    SOP_INFO_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    GROUP_DEFINITION_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
} from '../constants';
import { PeriodExpiryWithErrors } from '../pages/api/periodValidity';
import { SelectSalesOfferPackageWithError } from '../pages/api/selectSalesOfferPackage';
import { MatchingValues } from '../pages/api/outboundMatching';
import { GroupTicketAttribute, GroupTicketAttributeWithErrors } from '../pages/api/groupSize';
import {
    GroupPassengerTypesCollection,
    GroupPassengerTypesCollectionWithErrors,
} from '../pages/api/groupPassengerTypes';
import { GroupDefinitionWithErrors } from '../pages/definePassengerType';

type GetSessionAttributeTypes = {
    [SOP_ATTRIBUTE]: undefined | SalesOfferPackageWithErrors;
    [SOP_INFO_ATTRIBUTE]: undefined | SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors;
    [MATCHING_ATTRIBUTE]: undefined | MatchingWithErrors | MatchingInfo;
    [INBOUND_MATCHING_ATTRIBUTE]: undefined | MatchingWithErrors | InboundMatchingInfo;
    [PERIOD_EXPIRY_ATTRIBUTE]: undefined | PeriodExpiryWithErrors | ProductData;
    [PRODUCT_DETAILS_ATTRIBUTE]: undefined | ProductInfo | ProductData | ProductInfoWithErrors;
    [SALES_OFFER_PACKAGES_ATTRIBUTE]: undefined | SelectSalesOfferPackageWithError;
    [GROUP_SIZE_ATTRIBUTE]: undefined | GroupTicketAttribute | GroupTicketAttributeWithErrors;
    [GROUP_PASSENGER_TYPES_ATTRIBUTE]:
        | undefined
        | GroupPassengerTypesCollection
        | GroupPassengerTypesCollectionWithErrors;
    [GROUP_PASSENGER_INFO_ATTRIBUTE]: undefined | GroupPassengerInfo;
    [GROUP_DEFINITION_ATTRIBUTE]: undefined | GroupDefinition | GroupDefinitionWithErrors;
};

type GetSessionAttribute = <Key extends keyof GetSessionAttributeTypes>(
    req: IncomingMessageWithSession,
    attributeName: Key,
) => GetSessionAttributeTypes[Key];

export const getSessionAttribute: GetSessionAttribute = (req: IncomingMessageWithSession, attributeName) =>
    req?.session?.[attributeName];

type UpdateSessionAttributeTypes = {
    [SOP_ATTRIBUTE]: SalesOfferPackage | SalesOfferPackageWithErrors | undefined;
    [SOP_INFO_ATTRIBUTE]: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors | undefined;
    [INBOUND_MATCHING_ATTRIBUTE]: InboundMatchingInfo | MatchingWithErrors;
    [MATCHING_ATTRIBUTE]: MatchingInfo | MatchingWithErrors | MatchingValues;
    [PERIOD_EXPIRY_ATTRIBUTE]: ProductData | PeriodExpiryWithErrors;
    [PRODUCT_DETAILS_ATTRIBUTE]: ProductInfo | ProductData;
    [SALES_OFFER_PACKAGES_ATTRIBUTE]: SelectSalesOfferPackageWithError;
    [GROUP_SIZE_ATTRIBUTE]: GroupTicketAttribute | GroupTicketAttributeWithErrors;
    [GROUP_PASSENGER_TYPES_ATTRIBUTE]: GroupPassengerTypesCollection | GroupPassengerTypesCollectionWithErrors;
    [GROUP_PASSENGER_INFO_ATTRIBUTE]: undefined | GroupPassengerInfo;
    [GROUP_DEFINITION_ATTRIBUTE]: GroupDefinition | GroupDefinitionWithErrors;
};

type UpdateSessionAttribute = <Key extends keyof UpdateSessionAttributeTypes>(
    req: IncomingMessageWithSession,
    attributeName: Key,
    attributeValue: UpdateSessionAttributeTypes[Key],
) => void;

export const updateSessionAttribute: UpdateSessionAttribute = (
    req: IncomingMessageWithSession,
    attributeName,
    attributeValue,
): void => {
    req.session[attributeName] = attributeValue;
};

export const destroySession = (req: IncomingMessageWithSession): void => {
    req.session.destroy(err => {
        if (err) {
            throw new Error('Could not destroy session');
        }
    });
};
