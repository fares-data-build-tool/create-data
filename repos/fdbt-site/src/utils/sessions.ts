import * as attributes from '../constants/attributes';
import {
    POINT_TO_POINT_PRODUCT_ATTRIBUTE,
    CARNET_FARE_TYPE_ATTRIBUTE,
    CSV_UPLOAD_ATTRIBUTE,
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    DURATION_VALID_ATTRIBUTE,
    FARE_STAGES_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    FORGOT_PASSWORD_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    INPUT_METHOD_ATTRIBUTE,
    JOURNEY_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    NUMBER_OF_STAGES_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    PRICE_ENTRY_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    REUSE_OPERATOR_GROUP_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    SAVE_OPERATOR_GROUP_ATTRIBUTE,
    SAVED_PASSENGER_GROUPS_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    SOP_ATTRIBUTE,
    SOP_INFO_ATTRIBUTE,
    STAGE_NAMES_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
    USER_ATTRIBUTE,
} from '../constants/attributes';
import {
    CompanionInfo,
    CsvUploadAttributeWithErrors,
    DefinePassengerTypeWithErrors,
    DurationValidInfo,
    ErrorInfo,
    FaresInformation,
    FareStagesAttribute,
    FareStagesAttributeWithErrors,
    FareType,
    FareTypeWithErrors,
    FareZoneWithErrors,
    ForgotPasswordAttribute,
    FullTimeRestrictionAttribute,
    GroupPassengerType,
    GroupPassengerTypesCollection,
    GroupPassengerTypesCollectionWithErrors,
    GroupTicketAttribute,
    GroupTicketAttributeWithErrors,
    IncomingMessageWithSession,
    InputCheck,
    InputMethodInfo,
    Journey,
    JourneyWithErrors,
    MultiOperatorInfo,
    MultiOperatorInfoWithErrors,
    MultipleOperatorsAttribute,
    MultipleOperatorsAttributeWithErrors,
    MultipleProductAttribute,
    MultipleProductAttributeWithErrors,
    NumberOfStagesAttributeWithError,
    OperatorAttribute,
    PassengerType,
    PassengerTypeWithErrors,
    PeriodExpiry,
    PointToPointPeriodProduct,
    PointToPointProductInfo,
    ProductData,
    ProductInfo,
    ProductWithSalesOfferPackages,
    ReturnPeriodValidity,
    ReturnPeriodValidityWithErrors,
    SalesOfferPackage,
    SalesOfferPackageInfo,
    SalesOfferPackageInfoWithErrors,
    SalesOfferPackageWithErrors,
    SchoolFareTypeAttribute,
    SelectSalesOfferPackageWithError,
    Service,
    ServiceListAttribute,
    ServiceListAttributeWithErrors,
    ServiceWithErrors,
    TermTimeAttribute,
    TicketPeriodWithErrors,
    TicketPeriodWithInput,
    TicketRepresentationAttribute,
    TicketRepresentationAttributeWithErrors,
    TimeRestriction,
    TimeRestrictionsDefinitionWithErrors,
    TxcSourceAttribute,
    UserAttribute,
    WithErrors,
} from '../interfaces';

import { InboundMatchingInfo, MatchingInfo, MatchingWithErrors } from '../interfaces/matchingInterface';

interface SessionAttributeTypes {
    [STAGE_NAMES_ATTRIBUTE]: string[] | InputCheck[];
    [DURATION_VALID_ATTRIBUTE]: DurationValidInfo;
    [INPUT_METHOD_ATTRIBUTE]: InputMethodInfo | ErrorInfo;
    [SOP_ATTRIBUTE]: SalesOfferPackageWithErrors;
    [SOP_INFO_ATTRIBUTE]: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors;
    [MATCHING_ATTRIBUTE]: MatchingWithErrors | MatchingInfo;
    [INBOUND_MATCHING_ATTRIBUTE]: MatchingWithErrors | InboundMatchingInfo;
    [PERIOD_EXPIRY_ATTRIBUTE]: PeriodExpiry | ErrorInfo[];
    [PRODUCT_DETAILS_ATTRIBUTE]:
        | ProductInfo
        | PointToPointProductInfo
        | ProductData
        | WithErrors<ProductInfo>
        | WithErrors<PointToPointProductInfo>;
    [PRICE_ENTRY_ATTRIBUTE]: FaresInformation;
    [SALES_OFFER_PACKAGES_ATTRIBUTE]:
        | SelectSalesOfferPackageWithError
        | SalesOfferPackage[]
        | ProductWithSalesOfferPackages[]
        | undefined;
    [GROUP_SIZE_ATTRIBUTE]: GroupTicketAttribute | GroupTicketAttributeWithErrors;
    [GROUP_PASSENGER_TYPES_ATTRIBUTE]: GroupPassengerTypesCollection | GroupPassengerTypesCollectionWithErrors;
    [GROUP_PASSENGER_INFO_ATTRIBUTE]: CompanionInfo[];
    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: TimeRestriction | TimeRestrictionsDefinitionWithErrors;
    [FARE_ZONE_ATTRIBUTE]: string | FareZoneWithErrors;
    [CSV_UPLOAD_ATTRIBUTE]: CsvUploadAttributeWithErrors;
    [SERVICE_LIST_ATTRIBUTE]: ServiceListAttribute | ServiceListAttributeWithErrors;
    [NUMBER_OF_STAGES_ATTRIBUTE]: NumberOfStagesAttributeWithError;
    [MULTIPLE_PRODUCT_ATTRIBUTE]: MultipleProductAttribute | MultipleProductAttributeWithErrors;
    [NUMBER_OF_PRODUCTS_ATTRIBUTE]: number;
    [FARE_TYPE_ATTRIBUTE]: FareType | FareTypeWithErrors;
    [PASSENGER_TYPE_ATTRIBUTE]: PassengerType | PassengerTypeWithErrors;
    [DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE]: PassengerType | DefinePassengerTypeWithErrors;
    [SERVICE_ATTRIBUTE]: Service | ServiceWithErrors;
    [JOURNEY_ATTRIBUTE]: Journey | JourneyWithErrors;
    [TICKET_REPRESENTATION_ATTRIBUTE]: TicketRepresentationAttribute | TicketRepresentationAttributeWithErrors;
    [FARE_STAGES_ATTRIBUTE]: FareStagesAttribute | FareStagesAttributeWithErrors;
    [RETURN_VALIDITY_ATTRIBUTE]: ReturnPeriodValidity | ReturnPeriodValidityWithErrors;
    [PRODUCT_DATE_ATTRIBUTE]: TicketPeriodWithInput | TicketPeriodWithErrors;
    [MULTIPLE_OPERATOR_ATTRIBUTE]: MultipleOperatorsAttribute | MultipleOperatorsAttributeWithErrors;
    [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: MultiOperatorInfo[] | MultiOperatorInfoWithErrors;
    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: FullTimeRestrictionAttribute;
    [TERM_TIME_ATTRIBUTE]: TermTimeAttribute | WithErrors<TermTimeAttribute>;
    [SCHOOL_FARE_TYPE_ATTRIBUTE]: SchoolFareTypeAttribute | WithErrors<SchoolFareTypeAttribute>;
    [FORGOT_PASSWORD_ATTRIBUTE]: ForgotPasswordAttribute | WithErrors<ForgotPasswordAttribute>;
    [USER_ATTRIBUTE]: UserAttribute | WithErrors<UserAttribute>;
    [OPERATOR_ATTRIBUTE]: OperatorAttribute | WithErrors<OperatorAttribute>;
    [TXC_SOURCE_ATTRIBUTE]: TxcSourceAttribute;
    [MULTI_OP_TXC_SOURCE_ATTRIBUTE]: TxcSourceAttribute;
    [REUSE_OPERATOR_GROUP_ATTRIBUTE]: ErrorInfo[];
    [SAVE_OPERATOR_GROUP_ATTRIBUTE]: ErrorInfo[];
    [CARNET_FARE_TYPE_ATTRIBUTE]: boolean;
    [SAVED_PASSENGER_GROUPS_ATTRIBUTE]: GroupPassengerType[];
    [POINT_TO_POINT_PRODUCT_ATTRIBUTE]: PointToPointPeriodProduct | WithErrors<PointToPointPeriodProduct>;
}

export type SessionAttribute<T extends string> = T extends keyof SessionAttributeTypes
    ? SessionAttributeTypes[T]
    : string;

export const getSessionAttribute = <T extends keyof SessionAttributeTypes>(
    req: IncomingMessageWithSession,
    attributeName: T,
): SessionAttributeTypes[T] | undefined => req?.session?.[attributeName];

export const updateSessionAttribute = <T extends string>(
    req: IncomingMessageWithSession,
    attributeName: T,
    attributeValue: SessionAttribute<T> | undefined,
): void => {
    req.session[attributeName] = attributeValue;
};

export const regenerateSession = (req: IncomingMessageWithSession): void => {
    const attributesList = Object.values(attributes) as string[];

    Object.keys(req.session).forEach(attribute => {
        if (attributesList.includes(attribute) && attribute !== OPERATOR_ATTRIBUTE) {
            updateSessionAttribute(req, attribute, undefined);
        }
    });
};

export const destroySession = (req: IncomingMessageWithSession): void => {
    req.session.destroy((err: Error) => {
        if (err) {
            throw new Error('Could not destroy session');
        }
    });
};
