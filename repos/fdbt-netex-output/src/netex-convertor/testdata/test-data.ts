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
                    parentLocalityName: 'IW Test',
                    qualifierName: 'West Sussex',
                },
                {
                    stopName: 'Kingsthorpe',
                    naptanCode: '32900077',
                    atcoCode: '3290YYA00077',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    parentLocalityName: 'IW Test',
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
                    parentLocalityName: 'IW Test',
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
                    parentLocalityName: 'IW Test',
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

export const expectedScheduledStopPointsList = [
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:wilajmwd',
        $t: 'Woodcock Park, Woodcock Road, Warminster',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:sglgdjd',
        $t: 'Ellacombe Road Shops, Ellacombe Road, Longwell Green',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:MANATDWT',
        $t: 'Manchester Rd, MANCHESTER RD, Hollinwood',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:langjpaw',
        $t: 'Skippool Avenue, Breck Road, Poulton-le-Fylde',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:plygpaj',
        $t: 'Warleigh Crescent, Looseleigh Lane, Derriford',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:37055608',
        $t: 'Bank End Farm, Bank Lane, Howbrook',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:flijmgd',
        $t: 'Deeside Leisure Centre, Chester Road West, Queensferry',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:32010274',
        $t: 'Hare & Hounds, Rook Street, Lothersdale',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:bregdtw',
        $t: 'Caedu Crossing, Alma Terrace, Ogmore Vale',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:MANDWAWJ',
        $t: 'The Summit, TODMORDEN RD, Summit',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:esxjdwpj',
        $t: 'Fox & Raven, Chelmer Village Way, Chelmer Village',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:wardmatm',
        $t: 'Peake Avenue, St Nicolas Park Drive, Nuneaton',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:67524289',
        $t: 'Lyde Road End, A966, Rendall',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:26426393',
        $t: 'Crossroads Cottage, B965, Chapelton',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:22001392',
        $t: 'Brough Moor Road, Moor Road, Brough',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:dbsdpgta',
        $t: 'Bridge End, Derwent Lane, Derwent',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:CHEPWJP',
        $t: 'Bus Station, Queen Victoria Street, Macclesfield',
    },
    {
        versionRef: 'EXTERNAL',
        ref: 'naptStop:',
        $t: 'Arram Rail Station, -, Arram',
    },
];

export const expectedTopographicProjectionsList = [
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0056891',
        $t: 'Woodcock Road, Warminster, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0041864',
        $t: 'Ellacombe Road, Longwell Green, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0028839',
        $t: 'MANCHESTER RD, Hollinwood, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0016583',
        $t: 'Breck Road, Poulton-le-Fylde, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0040583',
        $t: 'Looseleigh Lane, Derriford, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0030284',
        $t: 'Bank Lane, Howbrook, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0054252',
        $t: 'Chester Road West, Queensferry, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0048917',
        $t: 'Rook Street, Lothersdale, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0035483',
        $t: 'Alma Terrace, Ogmore Vale, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0029398',
        $t: 'TODMORDEN RD, Summit, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:N0076772',
        $t: 'Chelmer Village Way, Chelmer Village, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0026040',
        $t: 'St Nicolas Park Drive, Nuneaton, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:ES001323',
        $t: 'A966, Rendall, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:N0067035',
        $t: 'B965, Chapelton, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0036884',
        $t: 'Moor Road, Brough, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0045128',
        $t: 'Derwent Lane, Derwent, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:N0076467',
        $t: 'Queen Victoria Street, Macclesfield, LEEDS',
    },
    {
        versionRef: 'nptg:EXTERNAL',
        ref: 'nptgLocality:E0036851',
        $t: '-, Arram, LEEDS',
    },
];

export const mockSingleTicketMatchingDataUpload = {
    lineName: '243',
    nocCode: 'ERDG',
    operatorShortName: 'East Riding of Yorkshire',
    type: 'pointToPoint',
    fareZones: [
        {
            name: 'Shott Drive',
            stops: [
                {
                    stopName: 'Beverley Norwood',
                    naptanCode: '22000075',
                    atcoCode: '2200YEA00075',
                    localityCode: 'E0036870',
                    localityName: 'Beverley',
                    parentLocalityName: '',
                    indicator: '22000075',
                    street: 'Norwood',
                    qualifierName: '',
                },
                {
                    stopName: 'Humbleton Moor',
                    naptanCode: '22011876',
                    atcoCode: '2200YEA11876',
                    localityCode: 'E0036958',
                    localityName: 'Flinton',
                    parentLocalityName: '',
                    indicator: '22011876',
                    street: 'B1238',
                    qualifierName: '',
                },
                {
                    stopName: 'Roos Thirtle Bridge',
                    naptanCode: '22001331',
                    atcoCode: '2200YEZ01331',
                    localityCode: 'E0053103',
                    localityName: 'Roos',
                    parentLocalityName: '',
                    indicator: '22001331',
                    street: 'Withernsea',
                    qualifierName: '',
                },
            ],
            prices: [
                { price: '1.10', fareZones: ['The Stag pub', 'Frederick Drive', 'Red Lane'] },
                { price: '1.70', fareZones: ['Rail Station', 'Redtree Street', 'Park Lane', 'Daws Bank/Plough Ave'] },
            ],
        },
        {
            name: 'The Stag pub',
            stops: [
                {
                    stopName: 'Routh Meaux Lane',
                    naptanCode: '22011818',
                    atcoCode: '2200YEA11818',
                    localityCode: 'E0053104',
                    localityName: 'Routh',
                    parentLocalityName: '',
                    indicator: '22011818',
                    street: 'A1035',
                    qualifierName: '',
                },
                {
                    stopName: 'Bilton Main Road',
                    naptanCode: '22000955',
                    atcoCode: '2200YEA00955',
                    localityCode: 'E0053000',
                    localityName: 'Bilton',
                    parentLocalityName: '',
                    indicator: '22000955',
                    street: 'Main Road',
                    qualifierName: '',
                },
            ],
            prices: [
                { price: '1.10', fareZones: ['Frederick Drive', 'Red Lane'] },
                { price: '1.70', fareZones: ['Rail Station', 'Redtree Street', 'Park Lane', 'Daws Bank/Plough Ave'] },
            ],
        },
        {
            name: 'Frederick Drive',
            stops: [
                {
                    stopName: 'Beverley Hull Bridge Road',
                    naptanCode: '22000619',
                    atcoCode: '2200YEA00619',
                    localityCode: 'E0036870',
                    localityName: 'Beverley',
                    parentLocalityName: '',
                    indicator: '22000619',
                    street: 'Hull Bridge Road',
                    qualifierName: '',
                },
                {
                    stopName: 'Skirlaugh Main Road',
                    naptanCode: '22000753',
                    atcoCode: '2200YEA00753',
                    localityCode: 'E0053116',
                    localityName: 'Skirlaugh',
                    parentLocalityName: '',
                    indicator: '22000753',
                    street: 'Main Road',
                    qualifierName: '',
                },
                {
                    stopName: 'Coniston Hull Road',
                    naptanCode: '22000978',
                    atcoCode: '2200YEA00978',
                    localityCode: 'E0053019',
                    localityName: 'Coniston',
                    parentLocalityName: '',
                    indicator: '22000978',
                    street: 'Hull Road',
                    qualifierName: '',
                },
            ],
            prices: [
                { price: '1.10', fareZones: ['Red Lane', 'Rail Station', 'Redtree Street'] },
                { price: '1.70', fareZones: ['Park Lane', 'Daws Bank/Plough Ave'] },
            ],
        },
        {
            name: 'Rail Station',
            stops: [
                {
                    stopName: 'Skirlaugh Main Road',
                    naptanCode: '22000751',
                    atcoCode: '2200YEA00751',
                    localityCode: 'E0053116',
                    localityName: 'Skirlaugh',
                    parentLocalityName: '',
                    indicator: '22000751',
                    street: 'Main Road',
                    qualifierName: '',
                },
                {
                    stopName: 'Sproatley B1238',
                    naptanCode: '22000959',
                    atcoCode: '2200YEA00959',
                    localityCode: 'E0053123',
                    localityName: 'Sproatley',
                    parentLocalityName: '',
                    indicator: '22000959',
                    street: 'B1238',
                    qualifierName: '',
                },
            ],
            prices: [{ price: '1.00', fareZones: ['Redtree Street', 'Park Lane', 'Daws Bank/Plough Ave'] }],
        },
        {
            name: 'Redtree Street',
            stops: [
                {
                    stopName: 'Burton Pidsea Main Road',
                    naptanCode: '22000705',
                    atcoCode: '2200YEA00705',
                    localityCode: 'E0053014',
                    localityName: 'Burton Pidsea',
                    parentLocalityName: '',
                    indicator: '22000705',
                    street: 'Main Road',
                    qualifierName: '',
                },
            ],
            prices: [{ price: '1.00', fareZones: ['Park Lane', 'Daws Bank/Plough Ave'] }],
        },
        {
            name: 'Park Lane',
            stops: [
                {
                    stopName: 'Beverley BS',
                    naptanCode: '22011925',
                    atcoCode: '2200YEA11925',
                    localityCode: 'E0036870',
                    localityName: 'Beverley',
                    parentLocalityName: '',
                    indicator: 'Bay E',
                    street: 'Sow Hill',
                    qualifierName: '',
                },
                {
                    stopName: 'Withernsea North Road',
                    naptanCode: '22000905',
                    atcoCode: '2200YEA00905',
                    localityCode: 'E0053145',
                    localityName: 'Withernsea',
                    parentLocalityName: '',
                    indicator: '22000905',
                    street: 'North Road',
                    qualifierName: '',
                },
            ],
            prices: [{ price: '1.00', fareZones: ['Daws Bank/Plough Ave'] }],
        },
        {
            name: 'Daws Bank/Plough Ave',
            stops: [
                {
                    stopName: 'Withernsea Arthur Street',
                    naptanCode: '22000336',
                    atcoCode: '2200YEA00336',
                    localityCode: 'E0053145',
                    localityName: 'Withernsea',
                    parentLocalityName: '',
                    indicator: '22000336',
                    street: 'Arthur Street',
                    qualifierName: '',
                },
            ],
            prices: [],
        },
    ],
};

export const mockPeriodTicketMatchingDataUpload = {
    operatorName: 'Pilkington Bus',
    type: 'periodGeoZone',
    zoneName: 'Test Town Centre',
    stops: [
        {
            stopName: 'Bridge End',
            naptanCode: 'dbsdpgta',
            atcoCode: '100000008363',
            localityCode: 'E0045128',
            localityName: 'Derwent',
            parentLocalityName: '',
            indicator: 'Adj',
            street: 'Derwent Lane',
        },
        {
            stopName: 'Skippool Avenue',
            naptanCode: 'langjpaw',
            atcoCode: '2500IMG456',
            localityCode: 'E0016583',
            localityName: 'Poulton-le-Fylde',
            parentLocalityName: '',
            indicator: 'opp',
            street: 'Breck Road',
        },
        {
            stopName: 'Warleigh Crescent',
            naptanCode: 'plygpaj',
            atcoCode: '1180PLA10404',
            localityCode: 'E0040583',
            localityName: 'Derriford',
            parentLocalityName: 'Plymouth',
            indicator: 'E-bound',
            street: 'Looseleigh Lane',
        },
        {
            stopName: 'Bank End Farm',
            naptanCode: '37055608',
            atcoCode: '370055608',
            localityCode: 'E0030284',
            localityName: 'Howbrook',
            parentLocalityName: '',
            indicator: null,
            street: 'Bank Lane',
        },
        {
            stopName: 'Caedu Crossing',
            naptanCode: 'bregdtw',
            atcoCode: '5510ANZ12855',
            localityCode: 'E0035483',
            localityName: 'Ogmore Vale',
            parentLocalityName: '',
            indicator: 'after',
            street: 'Alma Terrace',
        },
        {
            stopName: 'Arram Rail Station',
            naptanCode: null,
            atcoCode: '9100ARRAM',
            localityCode: 'E0036851',
            localityName: 'Arram',
            parentLocalityName: '',
            indicator: null,
            street: '-',
        },
        {
            stopName: 'Crossroads Cottage',
            naptanCode: '26426393',
            atcoCode: '6490IM063',
            localityCode: 'N0067035',
            localityName: 'Chapelton',
            parentLocalityName: '',
            indicator: 'opp',
            street: 'B965',
        },
        {
            stopName: 'Brough Moor Road',
            naptanCode: '22001392',
            atcoCode: '2200YEZ01392',
            localityCode: 'E0036884',
            localityName: 'Brough',
            parentLocalityName: '',
            indicator: '22001392',
            street: 'Moor Road',
        },
        {
            stopName: 'Manchester Rd',
            naptanCode: 'MANATDWT',
            atcoCode: '1800ED24711',
            localityCode: 'E0028839',
            localityName: 'Hollinwood',
            parentLocalityName: '',
            indicator: 'Stop A',
            street: 'MANCHESTER RD',
        },
        {
            stopName: 'Peake Avenue',
            naptanCode: 'wardmatm',
            atcoCode: '4200F216202',
            localityCode: 'E0026040',
            localityName: 'Nuneaton',
            parentLocalityName: '',
            indicator: 'Opp',
            street: 'St Nicolas Park Drive',
        },
        {
            stopName: 'Woodcock Park',
            naptanCode: 'wilajmwd',
            atcoCode: '4600WIA11163',
            localityCode: 'E0056891',
            localityName: 'Warminster',
            parentLocalityName: '',
            indicator: 'E-bound',
            street: 'Woodcock Road',
        },
        {
            stopName: 'Ellacombe Road Shops',
            naptanCode: 'sglgdjd',
            atcoCode: '0170SGB20303',
            localityCode: 'E0041864',
            localityName: 'Longwell Green',
            parentLocalityName: '',
            indicator: 'SW-bound',
            street: 'Ellacombe Road',
        },
        {
            stopName: 'Bus Station',
            naptanCode: 'CHEPWJP',
            atcoCode: '0600MA6110',
            localityCode: 'N0076467',
            localityName: 'Macclesfield',
            parentLocalityName: '',
            indicator: 'Stand 9',
            street: 'Queen Victoria Street',
        },
        {
            stopName: 'Fox & Raven',
            naptanCode: 'esxjdwpj',
            atcoCode: '1500CHVILL1C',
            localityCode: 'N0076772',
            localityName: 'Chelmer Village',
            parentLocalityName: 'Chelmsford',
            indicator: 'o/s',
            street: 'Chelmer Village Way',
        },
        {
            stopName: 'Lyde Road End',
            naptanCode: '67524289',
            atcoCode: '6020710632',
            localityCode: 'ES001323',
            localityName: 'Rendall',
            parentLocalityName: '',
            indicator: 'opp',
            street: 'A966',
        },
        {
            stopName: 'Hare & Hounds',
            naptanCode: '32010274',
            atcoCode: '3200YNF10274',
            localityCode: 'E0048917',
            localityName: 'Lothersdale',
            parentLocalityName: '',
            indicator: '32010274',
            street: 'Rook Street',
        },
        {
            stopName: 'The Summit',
            naptanCode: 'MANDWAWJ',
            atcoCode: '1800NE01231',
            localityCode: 'E0029398',
            localityName: 'Summit',
            parentLocalityName: 'Littleborough',
            indicator: 'opp',
            street: 'TODMORDEN RD',
        },
        {
            stopName: 'Deeside Leisure Centre',
            naptanCode: 'flijmgd',
            atcoCode: '5120WDB21629',
            localityCode: 'E0054252',
            localityName: 'Queensferry',
            parentLocalityName: "Connah's Quay",
            indicator: null,
            street: 'Chester Road West',
        },
    ],
    productName: 'Test Product',
    productPrice: '1000',
    daysValid: '31',
    expiryRules: 'endOfCalendarDay',
    nocCode: 'NWBT',
};

export const mockMatchingDataUploadWithNoType = {
    operatorName: 'IW Bus',
    zoneName: 'Test Town Centre',
    stops: [
        {
            stopName: 'Bridge End',
            naptanCode: 'dbsdpgta',
            atcoCode: '100000008363',
            localityCode: 'E0045128',
            localityName: 'Derwent',
            parentLocalityName: '',
            indicator: 'Adj',
            street: 'Derwent Lane',
        },
    ],
    productName: 'Test Product',
    productPrice: '1000',
    daysValid: '31',
    expiryRules: 'endOfCalendarDay',
    nocCode: 'IW1234',
};
