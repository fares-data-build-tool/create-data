export const ATTRIBUTE_MAP: { [key: string]: string } = {
    'custom:noc': 'NOC',
    'custom:schemeOperator': 'Scheme Name',
    'custom:schemeRegionCode': 'Scheme Region',
};

export const STATUS_MAP: { [key: string]: string } = {
    CONFIRMED: 'Registered',
    FORCE_CHANGE_PASSWORD: 'Awaiting Registration',
};

export const MAIN_USER_POOL_PREFIX = 'fdbt-user-pool';
export const NETEX_DATA_BUCKET_PREFIX = 'fdbt-netex-data';
export const PRODUCTS_DATA_BUCKET_PREFIX = 'fdbt-products-data';

export const AWS_REGION = 'eu-west-2';
