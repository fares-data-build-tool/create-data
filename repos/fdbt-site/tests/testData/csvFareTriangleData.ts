export const nonTicketerTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,170,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)';

export const testCsv: string =
    'Acomb Green Lane,,,,,,,\n' +
    '110,Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110,110,Holl Bank/Beech Ave,,,,\n' +
    '170,170,110,110,Cambridge Street (York),,,\n' +
    '170,170,110,110,100,Blossom Street,,\n' +
    '170,170,170,170,100,100,Rail Station (York),\n' +
    '170,170,170,170,100,100,100,Piccadilly (York)';

export const validTestCsvWithEmptyCellsAndEmptyLine: string =
    'Acomb Green Lane   ,,,,,,,\n' +
    ',Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110, , Holl Bank/Beech Ave,,,,\n' +
    '170,170,110,110,Cambridge Street (York),,,\n' +
    '170,170,110,110,100,"Blossom Street, test",,\n' +
    '170,170,170,170,100,100,Rail Station (York),\n' +
    ' ,170,170,170,100,100,100, Piccadilly (York)\n' +
    ',,,,,,,\n';

export const noPricesTestCsv: string =
    'Acomb Green Lane,,,,,,,\n' +
    ',Mattison Way,,,,,,\n' +
    ',,Nursery Drive,,,,,\n' +
    ',,,Holl Bank/Beech Ave,,,,\n' +
    ',,,,Cambridge Street (York),,,\n' +
    ',,,,,Blossom Street,,\n' +
    ',,,,,,Rail Station (York),\n' +
    ',,,,,,,Piccadilly (York)';

export const testCsvDuplicateFareStages: string =
    'Acomb Green Lane,,,,,,,\n' +
    '110,Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110,110,Holl Bank/Beech Ave,,,,\n' +
    '170,170,110,110,Cambridge Street (York),,,\n' +
    '170,170,110,110,100,Nursery Drive,,\n' +
    '170,170,170,170,100,100,Rail Station (York),\n' +
    '170,170,170,170,100,100,100,Piccadilly (York)';

export const testCsvWithEmptyLines: string =
    'Acomb Green Lane,,,,,,,\n' +
    '110,Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110,110,Holl Bank/Beech Ave,,,,\n' +
    '170,170,110,110,Cambridge Street (York),,,\n' +
    '170,170,110,110,100,Blossom Street,,\n' +
    '170,170,170,170,100,100,Rail Station (York),\n' +
    '170,170,170,170,100,100,100,Piccadilly (York)\n\n\n\n';

export const nonNumericPricesTestCsv: string =
    'Acomb Green Lane,,,,,,,\n' +
    '110,Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110,110,Holl Bank/Beech Ave,,,,\n' +
    '170,d,110,110,Cambridge Street (York),,,\n' +
    '170,170,d,110,100,Blossom Street,,\n' +
    '170,170,170,170,100,100,Rail Station (York),\n' +
    '170,170,170,s,100,100,100,Piccadilly (York)';

export const decimalPricesTestCsv: string =
    'Acomb Green Lane,,,,,,,\n' +
    '1.10,Mattison Way,,,,,,\n' +
    '1.10,1.10,Nursery Drive,,,,,\n' +
    '1.10,1.10,1.10,Holl Bank/Beech Ave,,,,\n' +
    '1.70,1.70,1.10,1.10,Cambridge Street (York),,,\n' +
    '1.70,1.70,1.10,1.10,1.00,Blossom Street,,\n' +
    '1.70,1.70,1.70,1.70,1,1.00,Rail Station (York),\n' +
    '1.70,1.70,1.70,1.70,1.00,1.00,1,Piccadilly (York)';

export const mismatchedNameTestCsv: string =
    'Acomb Red Lane,,,,\n' +
    '1.10,Mattison Way,,,\n' +
    '1.10,1.10,Holl Bank/Beech Ave,,\n' +
    '1.70,1.70,1.10,Blossom Street,\n' +
    '1.70,1.70,1.70,1.00,Piccadilly (York)';

export const matchedNameTestCsv: string =
    'Acomb Green Lane,,,,\n' +
    '2.10,Mattison Way,,,\n' +
    '2.10,1.10,Holl Bank/Beech Ave,,\n' +
    '4.70,1.70,1.10,Blossom Street,\n' +
    '6.70,1.70,1.70,2.00,Piccadilly (York)';

export const emptyStageNameTestCsv: string =
    'Acomb Green Lane,,,,,,,\n' +
    '110,Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110,110,Holl Bank/Beech Ave,,,,\n' +
    '170,170,110,110,Cambridge Street (York),,,\n' +
    '170,170,110,110,100,,,\n' +
    '170,170,170,170,100,100,Rail Station (York),\n' +
    '170,170,170,170,100,100,100,Piccadilly (York)';

export const missingPricesTestCsv: string =
    'Acomb Green Lane,,,,,,,\n' +
    '110,Mattison Way,,,,,,\n' +
    '110,110,Nursery Drive,,,,,\n' +
    '110,110,110,Holl Bank/Beech Ave,,,,\n' +
    '170,,110,,Cambridge Street (York),,,\n' +
    '170,170,110,110,100,Blossom Street,,\n' +
    '170,,170,170,100,100,Rail Station (York),\n' +
    '170,170,170,170,100,,100,Piccadilly (York)';

export const unprocessedObject = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        'Acomb Green Lane,,,,,,,\n' +
        '110,Mattison Way,,,,,,\n' +
        '110,110,Nursery Drive,,,,,\n' +
        '110,110,110,Holl Bank/Beech Ave,,,,\n' +
        '170,170,110,110,Cambridge Street (York),,,\n' +
        '170,170,110,110,100,Blossom Street,,\n' +
        '170,170,170,170,100,100,Rail Station (York),\n' +
        '170,170,170,170,100,100,100,Piccadilly (York)',
    ContentType: 'text/csv; charset=utf-8',
};

export const unprocessedObjectWithEmptyLines = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        'Acomb Green Lane,,,,,,,\n' +
        '110,Mattison Way,,,,,,\n' +
        '110,110,Nursery Drive,,,,,\n' +
        '110,110,110,Holl Bank/Beech Ave,,,,\n' +
        '170,170,110,110,Cambridge Street (York),,,\n' +
        '170,110,110,100,Blossom Street,,\n' +
        '170,170,170,170,100,100,Rail Station (York),\n' +
        '170,170,170,170,100,100,100,Piccadilly (York)\n\n\n\n',
    ContentType: 'text/csv; charset=utf-8',
};

export const unprocessedObjectWithEmptyCells = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        'Acomb Green Lane   ,,,,,,,\n' +
        ',Mattison Way,,,,,,\n' +
        '110,110,Nursery Drive,,,,,\n' +
        '110,110, , Holl Bank/Beech Ave,,,,\n' +
        '170,170,110,110,Cambridge Street (York),,,\n' +
        '170,170,110,110,100,"Blossom Street, test",,\n' +
        '170,170,170,170,100,100,Rail Station (York),\n' +
        ' ,170,170,170,100,100,100, Piccadilly (York)\n' +
        ',,,,,,,\n',
    ContentType: 'text/csv; charset=utf-8',
};

export const unprocessedObjectWithDecimalPrices = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        'Acomb Green Lane,,,,,,,\n' +
        '1.10,Mattison Way,,,,,,\n' +
        '1.10,1.10,Nursery Drive,,,,,\n' +
        '1.10,1.10,1.10,Holl Bank/Beech Ave,,,,\n' +
        '1.70,1.70,1.10,1.10,Cambridge Street (York),,,\n' +
        '1.70,1.70,1.10,1.10,1.00,Blossom Street,,\n' +
        '1.70,1.70,1.70,1.70,1,1.00,Rail Station (York),\n' +
        '1.70,1.70,1.70,1.70,1.00,1.00,1,Piccadilly (York)',
    ContentType: 'text/csv; charset=utf-8',
};

export const processedObject = {
    Bucket: 'fdbt-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body: {
        fareStages: [
            {
                stageName: 'Acomb Green Lane',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Mattison Way', 'Nursery Drive', 'Holl Bank/Beech Ave'],
                    },
                    {
                        price: '1.70',
                        fareZones: [
                            'Cambridge Street (York)',
                            'Blossom Street',
                            'Rail Station (York)',
                            'Piccadilly (York)',
                        ],
                    },
                ],
            },
            {
                stageName: 'Mattison Way',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Nursery Drive', 'Holl Bank/Beech Ave'],
                    },
                    {
                        price: '1.70',
                        fareZones: [
                            'Cambridge Street (York)',
                            'Blossom Street',
                            'Rail Station (York)',
                            'Piccadilly (York)',
                        ],
                    },
                ],
            },
            {
                stageName: 'Nursery Drive',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Holl Bank/Beech Ave', 'Cambridge Street (York)', 'Blossom Street'],
                    },
                    {
                        price: '1.70',
                        fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Holl Bank/Beech Ave',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Cambridge Street (York)', 'Blossom Street'],
                    },
                    {
                        price: '1.70',
                        fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Cambridge Street (York)',
                prices: [
                    {
                        price: '1.00',
                        fareZones: ['Blossom Street', 'Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Blossom Street',
                prices: [
                    {
                        price: '1.00',
                        fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Rail Station (York)',
                prices: [
                    {
                        price: '1.00',
                        fareZones: ['Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Piccadilly (York)',
                prices: [],
            },
        ],
    },
    ContentType: 'application/json; charset=utf-8',
};

export const processedObjectWithEmptyCells = {
    Bucket: 'fdbt-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body: {
        fareStages: [
            {
                stageName: 'Acomb Green Lane',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Nursery Drive', 'Holl Bank/Beech Ave'],
                    },
                    {
                        price: '1.70',
                        fareZones: ['Cambridge Street (York)', 'Blossom Street, test', 'Rail Station (York)'],
                    },
                ],
            },
            {
                stageName: 'Mattison Way',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Nursery Drive', 'Holl Bank/Beech Ave'],
                    },
                    {
                        price: '1.70',
                        fareZones: [
                            'Cambridge Street (York)',
                            'Blossom Street, test',
                            'Rail Station (York)',
                            'Piccadilly (York)',
                        ],
                    },
                ],
            },
            {
                stageName: 'Nursery Drive',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Cambridge Street (York)', 'Blossom Street, test'],
                    },
                    {
                        price: '1.70',
                        fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Holl Bank/Beech Ave',
                prices: [
                    {
                        price: '1.10',
                        fareZones: ['Cambridge Street (York)', 'Blossom Street, test'],
                    },
                    {
                        price: '1.70',
                        fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Cambridge Street (York)',
                prices: [
                    {
                        price: '1.00',
                        fareZones: ['Blossom Street, test', 'Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Blossom Street, test',
                prices: [
                    {
                        price: '1.00',
                        fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Rail Station (York)',
                prices: [
                    {
                        price: '1.00',
                        fareZones: ['Piccadilly (York)'],
                    },
                ],
            },
            {
                stageName: 'Piccadilly (York)',
                prices: [],
            },
        ],
    },
    ContentType: 'application/json; charset=utf-8',
};
