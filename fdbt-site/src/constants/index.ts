export const OPERATOR_COOKIE = 'fdbt-operator';

export const FARETYPE_COOKIE = 'fdbt-fareType';

export const SERVICE_COOKIE = 'fdbt-service';

export const JOURNEY_COOKIE = 'fdbt-journey';

export const GOVUK_LINK = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';

export const FARE_STAGES_COOKIE = 'fdbt-fare-stages';

export const STAGE_NAME_VALIDATION_COOKIE = 'fdbt-stage-names-validation';

export const FEEDBACK_LINK = 'mailto:fdbt@transportforthenorth.com';

export const STAGE_NAMES_COOKIE = 'fdbt-stage-names';

export const PRICEENTRY_COOKIE = 'fdbt-price-entry';

export const VALIDITY_COOKIE = 'fdbt-days-valid';

export const PERIOD_PRODUCT = 'fdbt-period-product';

export const PERIOD_TYPE = 'fdbt-period-type';

export const CSV_UPLOAD_COOKIE = 'fdbt-csv-upload';

export const CSV_ZONE_UPLOAD_COOKIE = 'fdbt-csv-zone-upload';

export const PERIOD_EXPIRY = 'fdbt-period-expiry';

export const PERIOD_SINGLE_OPERATOR_SERVICES = 'fdbt-period-single-services';

export const INPUT_METHOD_COOKIE = 'fdbt-input-method';

export const NUMBER_OF_STAGES_COOKIE = 'fdbt-number-stages';

export const MATCHING_COOKIE = 'fdbt-matching';

export const ALL_COOKIES: string[] = [
    'fdbt-operator',
    'fdbt-fareType',
    'fdbt-service',
    'fdbt-journey',
    'fdbt-fare-stages',
    'fdbt-stage-names-validation',
    'fdbt-stage-names',
    'fdbt-price-entry',
    'fdbt-days-valid',
    'fdbt-period-product',
    'fdbt-period-type',
    'fdbt-csv-upload',
    'fdbt-csv-zone-upload',
    'fdbt-period-expiry',
    'fdbt-period-single-services',
    'fdbt-input-method',
    'fdbt-matching',
    'fdbt-number-stages',
];

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
export const STATIC_FILES_PATH = process.env.STATIC_FILES_BUCKET_URL
    ? `https://${process.env.STATIC_FILES_BUCKET_URL}`
    : '';
