export const testCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,170,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)';

export const nonNumericPricesTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,d,110,110,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,d,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,170,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,s,100,100,100,Piccadilly (York)';

export const missingPricesTestCsv: string =
    ',Acomb Green Lane,,,,,,,\n' +
    'Mattison Way,110,Mattison Way,,,,,,\n' +
    'Nursery Drive,110,110,Nursery Drive,,,,,\n' +
    'Holl Bank/Beech Ave,110,110,110,Holl Bank/Beech Ave,,,,\n' +
    'Cambridge Street (York),170,,110,,Cambridge Street (York),,,\n' +
    'Blossom Street,170,170,110,110,100,Blossom Street,,\n' +
    'Rail Station (York),170,,170,170,100,100,Rail Station (York),\n' +
    'Piccadilly (York),170,170,170,170,100,,100,Piccadilly (York)';

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
        'Piccadilly (York),170,170,170,170,100,100,100,Piccadilly (York)',
    ContentType: 'text/csv; charset=utf-8',
};

export const processedObject = {
    Bucket: 'fdbt-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body: {
        fareStages: [
            { stageName: 'Acomb Green Lane', prices: ['110', '110', '110', '170', '170', '170', '170'] },
            { stageName: 'Mattison Way', prices: ['110', '110', '170', '170', '170', '170'] },
            { stageName: 'Nursery Drive', prices: ['110', '110', '110', '170', '170'] },
            { stageName: 'Holl Bank/Beech Ave', prices: ['110', '110', '170', '170'] },
            { stageName: 'Cambridge Street (York)', prices: ['100', '100', '100'] },
            { stageName: 'Blossom Street', prices: ['100', '100'] },
            { stageName: 'Rail Station (York)', prices: ['100'] },
            { stageName: 'Piccadilly (York)', prices: [] },
        ],
    },
    ContentType: 'application/json; charset=utf-8',
};
