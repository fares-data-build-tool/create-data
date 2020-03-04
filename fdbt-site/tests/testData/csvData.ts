export const testCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,170,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)\n';

export const nonNumericPricesTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,d,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,d,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,s,100,100,100,Piccadilly (York)\n';

export const missingPricesTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,,110,,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,,100,Piccadilly (York)\n';

export const unprocessedObject = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        ',Acomb Green Lane,,,,,,,\n' +
        'Mattison Way,110,Mattison Way,,,,,,\n' +
        'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
        'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
        'Cambridge Street (York),170,170,110,110,Cambridge Street (York),,,\n' +
        'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
        'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
        'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)\n',
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
