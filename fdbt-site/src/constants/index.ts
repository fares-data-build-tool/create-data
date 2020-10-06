import { PassengerAttributes } from '../interfaces/index';

// Cookies

export const OPERATOR_COOKIE = 'fdbt-operator';

export const USER_COOKIE = 'fdbt-user';

export const FORGOT_PASSWORD_COOKIE = 'fdbt-reset-password';

export const ID_TOKEN_COOKIE = 'fdbt-id-token';

export const REFRESH_TOKEN_COOKIE = 'fdbt-refresh-token';

export const DISABLE_AUTH_COOKIE = 'fdbt-disable-auth';

export const COOKIES_POLICY_COOKIE = 'fdbt-cookies-policy';

export const COOKIE_PREFERENCES_COOKIE = 'fdbt-cookie-preferences-set';

export const COOKIE_SETTINGS_SAVED_COOKIE = 'fdbt-cookie-settings-saved';

// Links

export const GOVUK_LINK = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';

export const FEEDBACK_LINK = 'mailto:fdbt@transportforthenorth.com?bcc=tfn-feedback@infinityworks.com';

// Session Attributes

export const FARE_TYPE_ATTRIBUTE = 'fdbt-fare-type';

export const PASSENGER_TYPE_ATTRIBUTE = 'fdbt-passenger-type';

export const DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE = 'fdbt-passenger-type-errors';

export const SERVICE_ATTRIBUTE = 'fdbt-service';

export const JOURNEY_ATTRIBUTE = 'fdbt-journey';

export const FARE_STAGES_ATTRIBUTE = 'fdbt-fare-stages';

export const STAGE_NAMES_ATTRIBUTE = 'fdbt-stage-names';

export const DAYS_VALID_ATTRIBUTE = 'fdbt-days-valid';

export const PRODUCT_DETAILS_ATTRIBUTE = 'fdbt-product-details';

export const TICKET_REPRESENTATION_ATTRIBUTE = 'fdbt-ticket-representation';

export const CSV_UPLOAD_ATTRIBUTE = 'fdbt-csv-upload';

export const FARE_ZONE_ATTRIBUTE = 'fdbt-csv-zone-upload';

export const PERIOD_EXPIRY_ATTRIBUTE = 'fdbt-period-expiry';

export const SERVICE_LIST_ATTRIBUTE = 'fdbt-services';

export const INPUT_METHOD_ATTRIBUTE = 'fdbt-input-method';

export const NUMBER_OF_STAGES_ATTRIBUTE = 'fdbt-number-stages';

export const MATCHING_ATTRIBUTE = 'fdbt-matching';

export const INBOUND_MATCHING_ATTRIBUTE = 'fdbt-inbound-matching';

export const NUMBER_OF_PRODUCTS_ATTRIBUTE = 'fdbt-number-of-products';

export const MULTIPLE_PRODUCT_ATTRIBUTE = 'fdbt-multiple-product';

export const PRICE_ENTRY_ATTRIBUTE = 'fdbt-price-entry';

export const SOP_ATTRIBUTE = 'fdbt-sales-offer-package';

export const SOP_INFO_ATTRIBUTE = 'fdbt-sales-offer-package-info';

export const SALES_OFFER_PACKAGES_ATTRIBUTE = 'fdbt-select-sales-offer-packages';

export const GROUP_SIZE_ATTRIBUTE = 'fdbt-group-size';

export const GROUP_PASSENGER_TYPES_ATTRIBUTE = 'fdbt-group-passenger-types';

export const GROUP_PASSENGER_INFO_ATTRIBUTE = 'fdbt-group-passenger-info';

export const GROUP_DEFINITION_ATTRIBUTE = 'fdbt-group-definition';

export const TIME_RESTRICTIONS_ATTRIBUTE = 'fdbt-time-restrictions';

export const TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE = 'fdbt-time-restrictions-definition';

export const RETURN_VALIDITY_ATTRIBUTE = 'fdbt-return-validity';

export const PRODUCT_DATE_ATTRIBUTE = 'fdbt-product-date-attribute';

export const SEARCH_OPERATOR_ATTRIBUTE = 'fdbt-search-operator-attribute';

// Other

export const oneYearInMilliseconds = 31556952000;

export const ALLOWED_CSV_FILE_TYPES = [
    'text/plain',
    'text/x-csv',
    'application/vnd.ms-excel',
    'application/csv',
    'application/x-csv',
    'application/octet-stream',
    'text/csv',
    'text/comma-separated-values',
    'text/x-comma-separated-values',
    'text/tab-separated-values',
];

export const STAGE = process.env.STAGE || 'dev';

export const RAW_USER_DATA_BUCKET_NAME = `fdbt-raw-user-data-${STAGE}`;
export const USER_DATA_BUCKET_NAME = `fdbt-user-data-${STAGE}`;
export const MATCHING_DATA_BUCKET_NAME = `fdbt-matching-data-${STAGE}`;
export const NETEX_BUCKET_NAME = `fdbt-netex-data-${STAGE}`;

export const PASSENGER_TYPES_LIST: PassengerAttributes[] = [
    { passengerTypeDisplay: 'Adult', passengerTypeValue: 'adult' },
    { passengerTypeDisplay: 'Child', passengerTypeValue: 'child' },
    { passengerTypeDisplay: 'Infant', passengerTypeValue: 'infant' },
    { passengerTypeDisplay: 'Senior', passengerTypeValue: 'senior' },
    { passengerTypeDisplay: 'Student', passengerTypeValue: 'student' },
    { passengerTypeDisplay: 'Young Person', passengerTypeValue: 'youngPerson' },
    { passengerTypeDisplay: 'Anyone', passengerTypeValue: 'anyone' },
];

export const PASSENGER_TYPES_WITH_GROUP: PassengerAttributes[] = [
    { passengerTypeDisplay: 'Group (more than one passenger)', passengerTypeValue: 'group' },
    ...PASSENGER_TYPES_LIST,
];

export const INTERNAL_NOC = 'IWBusCo';

export const CREATED_FILES_NUM_PER_PAGE = 10;
