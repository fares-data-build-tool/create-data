import { PassengerAttributes } from '../interfaces/index';

export const OPERATOR_COOKIE = 'fdbt-operator';

export const FARE_TYPE_COOKIE = 'fdbt-fare-type';

export const PASSENGER_TYPE_COOKIE = 'fdbt-passenger-type';

export const SERVICE_COOKIE = 'fdbt-service';

export const JOURNEY_COOKIE = 'fdbt-journey';

export const GOVUK_LINK = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';

export const FARE_STAGES_COOKIE = 'fdbt-fare-stages';

export const STAGE_NAME_VALIDATION_COOKIE = 'fdbt-stage-names-validation';

export const FEEDBACK_LINK = 'mailto:fdbt@transportforthenorth.com?bcc=tfn-feedback@infinityworks.com';

export const STAGE_NAMES_COOKIE = 'fdbt-stage-names';

export const DAYS_VALID_COOKIE = 'fdbt-days-valid';

export const PRODUCT_DETAILS_ATTRIBUTE = 'fdbt-product-details';

export const PERIOD_TYPE_COOKIE = 'fdbt-period-type';

export const CSV_UPLOAD_COOKIE = 'fdbt-csv-upload';

export const CSV_ZONE_UPLOAD_COOKIE = 'fdbt-csv-zone-upload';

export const PERIOD_EXPIRY_ATTRIBUTE = 'fdbt-period-expiry';

export const SERVICE_LIST_COOKIE = 'fdbt-services';

export const INPUT_METHOD_COOKIE = 'fdbt-input-method';

export const NUMBER_OF_STAGES_COOKIE = 'fdbt-number-stages';

export const MATCHING_ATTRIBUTE = 'fdbt-matching';

export const INBOUND_MATCHING_ATTRIBUTE = 'fdbt-inbound-matching';

export const MULTIPLE_SERVICE_COOKIE = 'fdbt-multiple-service';

export const NUMBER_OF_PRODUCTS_COOKIE = 'fdbt-number-of-products';

export const MULTIPLE_PRODUCT_COOKIE = 'fdbt-multiple-product';

export const USER_COOKIE = 'fdbt-user';

export const FORGOT_PASSWORD_COOKIE = 'fdbt-reset-password';

export const ID_TOKEN_COOKIE = 'fdbt-id-token';

export const REFRESH_TOKEN_COOKIE = 'fdbt-refresh-token';

export const DISABLE_AUTH_COOKIE = 'fdbt-disable-auth';

export const PRICE_ENTRY_INPUTS_COOKIE = 'fdbt-price-entry-inputs';

export const PRICE_ENTRY_ERRORS_COOKIE = 'fdbt-price-entry-errors';

export const SOP_ATTRIBUTE = 'fdbt-sales-offer-package';

export const SOP_INFO_ATTRIBUTE = 'fdbt-sales-offer-package-info';

export const SALES_OFFER_PACKAGES_ATTRIBUTE = 'fdbt-select-sales-offer-packages';

export const GROUP_SIZE_ATTRIBUTE = 'fdbt-group-size';

export const GROUP_PASSENGER_TYPES_ATTRIBUTE = 'fdbt-group-passenger-types';

export const GROUP_PASSENGER_INFO_ATTRIBUTE = 'fdbt-group-passenger-info';

export const GROUP_DEFINITION_ATTRIBUTE = 'fdbt-group-definition';

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
