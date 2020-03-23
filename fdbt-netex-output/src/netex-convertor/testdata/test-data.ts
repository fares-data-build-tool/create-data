import { S3Event } from 'aws-lambda';

export const mockS3Event = (bucketName: string, fileName: string): S3Event => ({
    Records: [
        {
            eventVersion: '',
            eventSource: '',
            awsRegion: '',
            eventTime: '',
            eventName: '',
            userIdentity: {
                principalId: '',
            },
            requestParameters: {
                sourceIPAddress: '',
            },
            responseElements: {
                'x-amz-request-id': '',
                'x-amz-id-2': '',
            },
            s3: {
                s3SchemaVersion: '',
                configurationId: '',
                bucket: {
                    name: bucketName,
                    ownerIdentity: {
                        principalId: '',
                    },
                    arn: '',
                },
                object: {
                    key: fileName,
                    size: 1,
                    eTag: '',
                    versionId: '',
                    sequencer: '',
                },
            },
            glacierEventData: {
                restoreEventData: {
                    lifecycleRestorationExpiryTime: '',
                    lifecycleRestoreStorageClass: '',
                },
            },
        },
    ],
});

export const mockS3ObjectDataAsString =
    '[\n' +
    '  {\n' +
    '    "stopName": "Piccadilly",\n' +
    '    "naptanCode": 32900103,\n' +
    '    "fareStage": "Piccadilly (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Low Ousegate",\n' +
    '    "naptanCode": 32900100,\n' +
    '    "fareStage": "Piccadilly (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Rougier Street",\n' +
    '    "naptanCode": 32900922,\n' +
    '    "fareStage": "Piccadilly (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Rail Station",\n' +
    '    "naptanCode": 32900136,\n' +
    '    "fareStage": "Rail Station (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Blossom Street",\n' +
    '    "naptanCode": 32900149,\n' +
    '    "fareStage": "Blossom Street"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Cambridge Street",\n' +
    '    "naptanCode": 32900193,\n' +
    '    "fareStage": "Cambridge Street (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Holgate Hill",\n' +
    '    "naptanCode": 32900192,\n' +
    '    "fareStage": "Cambridge Street (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Holly Bank Road",\n' +
    '    "naptanCode": 32901609,\n' +
    '    "fareStage": "Holl Bank/Beech Ave"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Hob Moor Drive",\n' +
    '    "naptanCode": 32901611,\n' +
    '    "fareStage": "Holl Bank/Beech Ave"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Collingwood Avenue",\n' +
    '    "naptanCode": 32901607,\n' +
    '    "fareStage": "Holl Bank/Beech Ave"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Campbell Avenue",\n' +
    '    "naptanCode": 32901666,\n' +
    '    "fareStage": "Nursery Drive"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Mattison Way",\n' +
    '    "naptanCode": 32900359,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Queenswood Grove",\n' +
    '    "naptanCode": 32903623,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Kingsthorpe",\n' +
    '    "naptanCode": 32900077,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Green Lane",\n' +
    '    "naptanCode": 32900928,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Green Lane",\n' +
    '    "naptanCode": 32900075,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Harold Court",\n' +
    '    "naptanCode": 32900076,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Kingsthorpe",\n' +
    '    "naptanCode": 32900809,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Queenswood Grove",\n' +
    '    "naptanCode": 32900870,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Mattison Way",\n' +
    '    "naptanCode": 32900358,\n' +
    '    "fareStage": "Acomb Green Lane"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Campbell Avenue",\n' +
    '    "naptanCode": 32900357,\n' +
    '    "fareStage": "Nursery Drive"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Collingwood Avenue",\n' +
    '    "naptanCode": 32901606,\n' +
    '    "fareStage": "Holl Bank/Beech Ave"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Hob Moor Drive",\n' +
    '    "naptanCode": 32901610,\n' +
    '    "fareStage": "Holl Bank/Beech Ave"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Holly Bank Road",\n' +
    '    "naptanCode": 32901608,\n' +
    '    "fareStage": "Holl Bank/Beech Ave"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Barbara Grove",\n' +
    '    "naptanCode": 32903583,\n' +
    '    "fareStage": "Cambridge Street (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Holgate Hill",\n' +
    '    "naptanCode": 32900195,\n' +
    '    "fareStage": "Cambridge Street (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Cambridge Street",\n' +
    '    "naptanCode": 32900194,\n' +
    '    "fareStage": "Blossom Street"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Blossom Street",\n' +
    '    "naptanCode": 32900152,\n' +
    '    "fareStage": "Blossom Street"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Rail Station",\n' +
    '    "naptanCode": 32900141,\n' +
    '    "fareStage": "Rail Station (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Rougier Street",\n' +
    '    "naptanCode": 32900924,\n' +
    '    "fareStage": "Piccadilly (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Micklegate",\n' +
    '    "naptanCode": 32900099,\n' +
    '    "fareStage": "Piccadilly (York)"\n' +
    '  },\n' +
    '  {\n' +
    '    "stopName": "Merchantgate",\n' +
    '    "naptanCode": 32900107,\n' +
    '    "fareStage": "Piccadilly (York)"\n' +
    '  }\n' +
    ']';

export const mockS3ObjectDataAsJson = [
    {
        stopName: 'Piccadilly',
        naptanCode: 32900103,
        fareStage: 'Piccadilly (York)',
    },
    {
        stopName: 'Low Ousegate',
        naptanCode: 32900100,
        fareStage: 'Piccadilly (York)',
    },
    {
        stopName: 'Rougier Street',
        naptanCode: 32900922,
        fareStage: 'Piccadilly (York)',
    },
    {
        stopName: 'Rail Station',
        naptanCode: 32900136,
        fareStage: 'Rail Station (York)',
    },
    {
        stopName: 'Blossom Street',
        naptanCode: 32900149,
        fareStage: 'Blossom Street',
    },
    {
        stopName: 'Cambridge Street',
        naptanCode: 32900193,
        fareStage: 'Cambridge Street (York)',
    },
    {
        stopName: 'Holgate Hill',
        naptanCode: 32900192,
        fareStage: 'Cambridge Street (York)',
    },
    {
        stopName: 'Holly Bank Road',
        naptanCode: 32901609,
        fareStage: 'Holl Bank/Beech Ave',
    },
    {
        stopName: 'Hob Moor Drive',
        naptanCode: 32901611,
        fareStage: 'Holl Bank/Beech Ave',
    },
    {
        stopName: 'Collingwood Avenue',
        naptanCode: 32901607,
        fareStage: 'Holl Bank/Beech Ave',
    },
    {
        stopName: 'Campbell Avenue',
        naptanCode: 32901666,
        fareStage: 'Nursery Drive',
    },
    {
        stopName: 'Mattison Way',
        naptanCode: 32900359,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Queenswood Grove',
        naptanCode: 32903623,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Kingsthorpe',
        naptanCode: 32900077,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Green Lane',
        naptanCode: 32900928,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Green Lane',
        naptanCode: 32900075,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Harold Court',
        naptanCode: 32900076,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Kingsthorpe',
        naptanCode: 32900809,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Queenswood Grove',
        naptanCode: 32900870,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Mattison Way',
        naptanCode: 32900358,
        fareStage: 'Acomb Green Lane',
    },
    {
        stopName: 'Campbell Avenue',
        naptanCode: 32900357,
        fareStage: 'Nursery Drive',
    },
    {
        stopName: 'Collingwood Avenue',
        naptanCode: 32901606,
        fareStage: 'Holl Bank/Beech Ave',
    },
    {
        stopName: 'Hob Moor Drive',
        naptanCode: 32901610,
        fareStage: 'Holl Bank/Beech Ave',
    },
    {
        stopName: 'Holly Bank Road',
        naptanCode: 32901608,
        fareStage: 'Holl Bank/Beech Ave',
    },
    {
        stopName: 'Barbara Grove',
        naptanCode: 32903583,
        fareStage: 'Cambridge Street (York)',
    },
    {
        stopName: 'Holgate Hill',
        naptanCode: 32900195,
        fareStage: 'Cambridge Street (York)',
    },
    {
        stopName: 'Cambridge Street',
        naptanCode: 32900194,
        fareStage: 'Blossom Street',
    },
    {
        stopName: 'Blossom Street',
        naptanCode: 32900152,
        fareStage: 'Blossom Street',
    },
    {
        stopName: 'Rail Station',
        naptanCode: 32900141,
        fareStage: 'Rail Station (York)',
    },
    {
        stopName: 'Rougier Street',
        naptanCode: 32900924,
        fareStage: 'Piccadilly (York)',
    },
    {
        stopName: 'Micklegate',
        naptanCode: 32900099,
        fareStage: 'Piccadilly (York)',
    },
    {
        stopName: 'Merchantgate',
        naptanCode: 32900107,
        fareStage: 'Piccadilly (York)',
    },
];

export const mockDynamoDBItemDataObjectWithAttributeValueAsString: AWS.DynamoDB.DocumentClient.QueryOutput = {
    Items: [{ testattribute: 'test' }],
    Count: 1,
    ScannedCount: 1,
};

export const mockDynamoDBItemDataObjectWithAttributeValueAsStringArray: AWS.DynamoDB.DocumentClient.QueryOutput = {
    Items: [{ testattribute: ['test1', 'test2'] }],
    Count: 1,
    ScannedCount: 1,
};

export const mockDynamoDBItemDataObjectWithAttributeValueAsObjectArray: AWS.DynamoDB.DocumentClient.QueryOutput = {
    Items: [{ testattribute: [{ test1: 'aaaa', test2: 'bbbb' }] }],
    Count: 1,
    ScannedCount: 1,
};

export const fareZoneList = {
    lineName: '354',
    nocCode: 'TLCT',
    operatorShortName: 'IWBus',
    fareZones: [
        {
            name: 'Acomb Green Lane',
            stops: [
                {
                    stopName: 'Queenswood Grove',
                    naptanCode: '32903623',
                    atcoCode: '3290YYA03623',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    qualifierName: 'West Sussex',
                },
                {
                    stopName: 'Kingsthorpe',
                    naptanCode: '32900077',
                    atcoCode: '3290YYA00077',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    qualifierName: 'West Sussex',
                },
            ],
            prices: [
                {
                    price: '1.10',
                    fareZones: ['Mattison Way'],
                },
                {
                    price: '1.70',
                    fareZones: ['Nursery Drive'],
                },
                {
                    price: '2.20',
                    fareZones: ['Holl Bank/Beech Ave'],
                },
            ],
        },
        {
            name: 'Mattison Way',
            stops: [
                {
                    stopName: 'Mattison Way',
                    naptanCode: '32900359',
                    atcoCode: '3290YYA00359',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    qualifierName: 'West Sussex',
                },
            ],
            prices: [
                {
                    price: '1.10',
                    fareZones: ['Nursery Drive'],
                },
                {
                    price: '1.70',
                    fareZones: ['Holl Bank/Beech Ave'],
                },
            ],
        },
        {
            name: 'Nursery Drive',
            stops: [
                {
                    stopName: 'Campbell Avenue',
                    naptanCode: '32900357',
                    atcoCode: '3290YYA00357',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    qualifierName: 'West Sussex',
                },
            ],
            prices: [
                {
                    price: '1.10',
                    fareZones: ['Holl Bank/Beech Ave'],
                },
            ],
        },
        {
            name: 'Holl Bank/Beech Ave',
            stops: [],
            prices: [
                {
                    price: '1.10',
                    fareZones: [],
                },
            ],
        },
    ],
};

export const expectedFareTables = [
    {
        id: 'Trip@single-SOP@p-ticket@line_123@adult@c1@Acomb_Green_Lane',
        version: '1.0',
        Description: { $t: 'Column 1' },
        Name: { $t: 'Acomb Green Lane' },
        cells: {
            Cell: [
                {
                    ColumnRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@c1@Acomb_Green_Lane',
                        versionRef: '1',
                    },
                    DistanceMatrixElementPrice: {
                        DistanceMatrixElementRef: { ref: 'Acomb_Green_Lane+Mattison_Way', version: '1.0' },
                        GeographicalIntervalPriceRef: { ref: 'price_band_1.10@adult', version: '1.0' },
                        id: 'Trip@single-SOP@p-ticket@line_123@adult@Acomb_Green_Lane+Mattison_Way',
                        version: '1.0',
                    },
                    RowRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@r3@Mattison_Way',
                        versionRef: '1',
                    },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@Acomb_Green_Lane',
                    order: 1,
                    version: '1.0',
                },
                {
                    ColumnRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@c1@Acomb_Green_Lane',
                        versionRef: '1',
                    },
                    DistanceMatrixElementPrice: {
                        DistanceMatrixElementRef: { ref: 'Acomb_Green_Lane+Nursery_Drive', version: '1.0' },
                        GeographicalIntervalPriceRef: { ref: 'price_band_1.70@adult', version: '1.0' },
                        id: 'Trip@single-SOP@p-ticket@line_123@adult@Acomb_Green_Lane+Nursery_Drive',
                        version: '1.0',
                    },
                    RowRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@r2@Nursery_Drive',
                        versionRef: '1',
                    },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@Acomb_Green_Lane',
                    order: 2,
                    version: '1.0',
                },
                {
                    ColumnRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@c1@Acomb_Green_Lane',
                        versionRef: '1',
                    },
                    DistanceMatrixElementPrice: {
                        DistanceMatrixElementRef: {
                            ref: 'Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                            version: '1.0',
                        },
                        GeographicalIntervalPriceRef: { ref: 'price_band_2.20@adult', version: '1.0' },
                        id: 'Trip@single-SOP@p-ticket@line_123@adult@Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                        version: '1.0',
                    },
                    RowRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@r1@Holl_Bank/Beech_Ave',
                        versionRef: '1',
                    },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@Acomb_Green_Lane',
                    order: 3,
                    version: '1.0',
                },
            ],
        },
    },
    {
        id: 'Trip@single-SOP@p-ticket@line_123@adult@c2@Mattison_Way',
        version: '1.0',
        Description: { $t: 'Column 2' },
        Name: { $t: 'Mattison Way' },
        cells: {
            Cell: [
                {
                    ColumnRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@c2@Mattison_Way',
                        versionRef: '1',
                    },
                    DistanceMatrixElementPrice: {
                        DistanceMatrixElementRef: { ref: 'Mattison_Way+Nursery_Drive', version: '1.0' },
                        GeographicalIntervalPriceRef: { ref: 'price_band_1.10@adult', version: '1.0' },
                        id: 'Trip@single-SOP@p-ticket@line_123@adult@Mattison_Way+Nursery_Drive',
                        version: '1.0',
                    },
                    RowRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@r2@Nursery_Drive',
                        versionRef: '1',
                    },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@Mattison_Way',
                    order: 1,
                    version: '1.0',
                },
                {
                    ColumnRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@c2@Mattison_Way',
                        versionRef: '1',
                    },
                    DistanceMatrixElementPrice: {
                        DistanceMatrixElementRef: {
                            ref: 'Mattison_Way+Holl_Bank/Beech_Ave',
                            version: '1.0',
                        },
                        GeographicalIntervalPriceRef: { ref: 'price_band_1.70@adult', version: '1.0' },
                        id: 'Trip@single-SOP@p-ticket@line_123@adult@Mattison_Way+Holl_Bank/Beech_Ave',
                        version: '1.0',
                    },
                    RowRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@r1@Holl_Bank/Beech_Ave',
                        versionRef: '1',
                    },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@Mattison_Way',
                    order: 2,
                    version: '1.0',
                },
            ],
        },
    },
    {
        id: 'Trip@single-SOP@p-ticket@line_123@adult@c3@Nursery_Drive',
        version: '1.0',
        Description: { $t: 'Column 3' },
        Name: { $t: 'Nursery Drive' },
        cells: {
            Cell: [
                {
                    ColumnRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@c3@Nursery_Drive',
                        versionRef: '1',
                    },
                    DistanceMatrixElementPrice: {
                        DistanceMatrixElementRef: {
                            ref: 'Nursery_Drive+Holl_Bank/Beech_Ave',
                            version: '1.0',
                        },
                        GeographicalIntervalPriceRef: { ref: 'price_band_1.10@adult', version: '1.0' },
                        id: 'Trip@single-SOP@p-ticket@line_123@adult@Nursery_Drive+Holl_Bank/Beech_Ave',
                        version: '1.0',
                    },
                    RowRef: {
                        ref: 'Trip@single-SOP@p-ticket@line_123@adult@r1@Holl_Bank/Beech_Ave',
                        versionRef: '1',
                    },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@Nursery_Drive',
                    order: 1,
                    version: '1.0',
                },
            ],
        },
    },
];
