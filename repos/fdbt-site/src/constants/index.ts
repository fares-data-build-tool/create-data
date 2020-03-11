export const OPERATOR_COOKIE = 'fdbt-operator';

export const FARETYPE_COOKIE = 'fdbt-faretype';

export const SERVICE_COOKIE = 'fdbt-service';

export const JOURNEY_COOKIE = 'fdbt-journey';

export const FARE_STAGES_COOKIE = 'fdbt-fare-stages';

export const STAGE_NAME_VALIDATION_COOKIE = 'fdbt-stage-names-validation';

export const FEEDBACK_LINK = 'mailto:fdbt@transportforthenorth.com';

export const GOVUK_LINK = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';

export const STAGE_NAMES_COOKIE = 'fdbt-stage-names';

export const PRICEENTRY_COOKIE = 'fdbt-price-entry';

export const ALLOWED_CSV_FILE_TYPES = [
    'text/plain',
    'text/x-csv',
    'application/vnd.ms-excel',
    'application/csv',
    'application/x-csv',
    'text/csv',
    'text/comma-separated-values',
    'text/x-comma-separated-values',
    'text/tab-separated-values',
];

export const STAGE = process.env.STAGE || 'dev';

export const NAPTAN_TABLE_NAME = `${STAGE}-Stops`;
export const NOC_TABLE_NAME = `${STAGE}-Operators`;
export const SERVICES_TABLE_NAME = `${STAGE}-Services`;
export const TNDS_TABLE_NAME = `${STAGE}-TNDS`;
export const RAW_USER_DATA_BUCKET_NAME = `fdbt-raw-user-data-${STAGE}`;
export const USER_DATA_BUCKET_NAME = `fdbt-user-data-${STAGE}`;
export const MATCHING_DATA_BUCKET_NAME = `fdbt-matching-data-${STAGE}`;
