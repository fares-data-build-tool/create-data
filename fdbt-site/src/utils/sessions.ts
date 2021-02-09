import {
    MultiOperatorInfoWithErrors,
    InputMethodInfo,
    ErrorInfo,
    IncomingMessageWithSession,
    ProductInfo,
    ProductData,
    ProductInfoWithErrors,
    GroupDefinition,
    GroupDefinitionWithErrors,
    TimeRestriction,
    CompanionInfo,
    DurationValidInfo,
    Journey,
    JourneyWithErrors,
    TicketRepresentationAttribute,
    TicketRepresentationAttributeWithErrors,
    SalesOfferPackage,
    ProductWithSalesOfferPackages,
    ReturnPeriodValidity,
    MultiOperatorInfo,
    TicketPeriod,
    FullTimeRestrictionAttribute,
    TermTimeAttribute,
    WithErrors,
    NumberOfStagesAttributeWithError,
    ReturnPeriodValidityWithErrors,
    InputCheck,
    FareStagesAttribute,
    FareStagesAttributeWithErrors,
    CsvUploadAttributeWithErrors,
    DefinePassengerTypeWithErrors,
    TimeRestrictionsDefinitionWithErrors,
    FareType,
    FareTypeWithErrors,
    FareZoneWithErrors,
    GroupPassengerTypesCollection,
    GroupPassengerTypesCollectionWithErrors,
    GroupTicketAttribute,
    GroupTicketAttributeWithErrors,
    NumberOfProductsAttributeWithErrors,
    NumberOfProductsAttribute,
    MultipleProductAttribute,
    MultipleProductAttributeWithErrors,
    PassengerTypeWithErrors,
    PassengerType,
    FaresInformation,
    TicketPeriodWithErrors,
    SchoolFareTypeAttribute,
    MultipleOperatorsAttribute,
    MultipleOperatorsAttributeWithErrors,
    SelectSalesOfferPackageWithError,
    ServiceWithErrors,
    Service,
    ServiceListAttribute,
    ServiceListAttributeWithErrors,
    SalesOfferPackageInfo,
    SalesOfferPackageInfoWithErrors,
    SalesOfferPackageWithErrors,
} from '../interfaces';
import {
    DURATION_VALID_ATTRIBUTE,
    PRICE_ENTRY_ATTRIBUTE,
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
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    INPUT_METHOD_ATTRIBUTE,
    STAGE_NAMES_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    CSV_UPLOAD_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    NUMBER_OF_STAGES_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    JOURNEY_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    FARE_STAGES_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
} from '../constants/index';
import { MatchingInfo, MatchingWithErrors, InboundMatchingInfo } from '../interfaces/matchingInterface';

interface SessionAttributeTypes {
    [STAGE_NAMES_ATTRIBUTE]: string[] | InputCheck[];
    [DURATION_VALID_ATTRIBUTE]: DurationValidInfo;
    [INPUT_METHOD_ATTRIBUTE]: InputMethodInfo | ErrorInfo;
    [SOP_ATTRIBUTE]: SalesOfferPackageWithErrors;
    [SOP_INFO_ATTRIBUTE]: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors;
    [MATCHING_ATTRIBUTE]: MatchingWithErrors | MatchingInfo;
    [INBOUND_MATCHING_ATTRIBUTE]: MatchingWithErrors | InboundMatchingInfo;
    [PERIOD_EXPIRY_ATTRIBUTE]: ProductData | WithErrors<ProductData>;
    [PRODUCT_DETAILS_ATTRIBUTE]: ProductInfo | ProductData | ProductInfoWithErrors;
    [PRICE_ENTRY_ATTRIBUTE]: FaresInformation;
    [SALES_OFFER_PACKAGES_ATTRIBUTE]:
        | SelectSalesOfferPackageWithError
        | SalesOfferPackage[]
        | ProductWithSalesOfferPackages[]
        | undefined;
    [GROUP_SIZE_ATTRIBUTE]: GroupTicketAttribute | GroupTicketAttributeWithErrors;
    [GROUP_PASSENGER_TYPES_ATTRIBUTE]: GroupPassengerTypesCollection | GroupPassengerTypesCollectionWithErrors;
    [GROUP_PASSENGER_INFO_ATTRIBUTE]: CompanionInfo[];
    [GROUP_DEFINITION_ATTRIBUTE]: GroupDefinition | GroupDefinitionWithErrors;
    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: TimeRestriction | TimeRestrictionsDefinitionWithErrors;
    [FARE_ZONE_ATTRIBUTE]: string | FareZoneWithErrors;
    [CSV_UPLOAD_ATTRIBUTE]: CsvUploadAttributeWithErrors;
    [SERVICE_LIST_ATTRIBUTE]: ServiceListAttribute | ServiceListAttributeWithErrors;
    [NUMBER_OF_STAGES_ATTRIBUTE]: NumberOfStagesAttributeWithError;
    [MULTIPLE_PRODUCT_ATTRIBUTE]: MultipleProductAttribute | MultipleProductAttributeWithErrors;
    [NUMBER_OF_PRODUCTS_ATTRIBUTE]: NumberOfProductsAttribute | NumberOfProductsAttributeWithErrors;
    [FARE_TYPE_ATTRIBUTE]: FareType | FareTypeWithErrors;
    [PASSENGER_TYPE_ATTRIBUTE]: PassengerType | PassengerTypeWithErrors;
    [DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE]: PassengerType | DefinePassengerTypeWithErrors;
    [SERVICE_ATTRIBUTE]: Service | ServiceWithErrors;
    [JOURNEY_ATTRIBUTE]: Journey | JourneyWithErrors;
    [TICKET_REPRESENTATION_ATTRIBUTE]: TicketRepresentationAttribute | TicketRepresentationAttributeWithErrors;
    [FARE_STAGES_ATTRIBUTE]: FareStagesAttribute | FareStagesAttributeWithErrors;
    [RETURN_VALIDITY_ATTRIBUTE]: ReturnPeriodValidity | ReturnPeriodValidityWithErrors;
    [PRODUCT_DATE_ATTRIBUTE]: TicketPeriod | TicketPeriodWithErrors;
    [MULTIPLE_OPERATOR_ATTRIBUTE]: MultipleOperatorsAttribute | MultipleOperatorsAttributeWithErrors;
    [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: MultiOperatorInfo[] | MultiOperatorInfoWithErrors;
    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: FullTimeRestrictionAttribute;
    [TERM_TIME_ATTRIBUTE]: TermTimeAttribute | WithErrors<TermTimeAttribute>;
    [SCHOOL_FARE_TYPE_ATTRIBUTE]: SchoolFareTypeAttribute | WithErrors<SchoolFareTypeAttribute>;
}

export type SessionAttribute<T extends string> = T extends keyof SessionAttributeTypes
    ? SessionAttributeTypes[T]
    : string;

export const getSessionAttribute = <T extends string>(
    req: IncomingMessageWithSession,
    attributeName: T,
): SessionAttribute<T> | undefined => req?.session?.[attributeName];

export const updateSessionAttribute = <T extends string>(
    req: IncomingMessageWithSession,
    attributeName: T,
    attributeValue: SessionAttribute<T> | undefined,
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
