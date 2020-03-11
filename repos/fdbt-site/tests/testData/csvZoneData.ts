export const testCsv: string =
    'Town Centre,TestNaptan-TC1,TestATCO-TC1,\n' +
    ',TestNaptan-TC2,TestATCO-TC2,\n' +
    ',TestNaptan-TC3,TestATCO-TC3,\n' +
    ',TestNaptan-TC4,TestATCO-TC4,\n' +
    ',TestNaptan-TC5,TestATCO-TC5,\n' +
    ',TestNaptan-TC6,TestATCO-TC6,\n' +
    ',TestNaptan-TC7,TestATCO-TC7,\n' +
    ',TestNaptan-TC8,TestATCO-TC8,\n' +
    ',TestNaptan-TC9,TestATCO-TC9,\n';

export const testCsvWithEmptyCells: string =
    'Town Centre,TestNaptan-TC1,TestATCO-TC1,\n' +
    ',,TestATCO-TC2,\n' +
    ',TestNaptan-TC3,TestATCO-TC3,\n' +
    ',TestNaptan-TC4,TestATCO-TC4,\n' +
    ',TestNaptan-TC5,,\n' +
    ',TestNaptan-TC6,TestATCO-TC6,\n' +
    ',TestNaptan-TC7,TestATCO-TC7,\n' +
    ',,TestATCO-TC8,\n' +
    ',TestNaptan-TC9,TestATCO-TC9,\n';

export const unprocessedObject = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        'Town Centre,TestNaptan-TC1,TestATCO-TC1,\n' +
        ',TestNaptan-TC2,TestATCO-TC2,\n' +
        ',TestNaptan-TC3,TestATCO-TC3,\n' +
        ',TestNaptan-TC4,TestATCO-TC4,\n' +
        ',TestNaptan-TC5,TestATCO-TC5,\n' +
        ',TestNaptan-TC6,TestATCO-TC6,\n' +
        ',TestNaptan-TC7,TestATCO-TC7,\n' +
        ',TestNaptan-TC8,TestATCO-TC8,\n' +
        ',TestNaptan-TC9,TestATCO-TC9,\n',
    ContentType: 'text/csv; charset=utf-8',
};

export const unprocessedObjectWithEmptyCells = {
    Bucket: 'fdbt-raw-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body:
        'Town Centre,TestNaptan-TC1,TestATCO-TC1,\n' +
        ',,TestATCO-TC2,\n' +
        ',TestNaptan-TC3,TestATCO-TC3,\n' +
        ',TestNaptan-TC4,TestATCO-TC4,\n' +
        ',TestNaptan-TC5,,\n' +
        ',TestNaptan-TC6,TestATCO-TC6,\n' +
        ',TestNaptan-TC7,TestATCO-TC7,\n' +
        ',,TestATCO-TC8,\n' +
        ',TestNaptan-TC9,TestATCO-TC9,\n',
    ContentType: 'text/csv; charset=utf-8',
};

export const processedObject = {
    Bucket: 'fdbt-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body: {
        FareZoneName: 'Town Centre',
        AtcoCodes: [
            'TestATCO-TC1',
            'TestATCO-TC2',
            'TestATCO-TC3',
            'TestATCO-TC4',
            'TestATCO-TC5',
            'TestATCO-TC6',
            'TestATCO-TC7',
            'TestATCO-TC8',
            'TestATCO-TC9',
        ],
    },
    ContentType: 'application/json; charset=utf-8',
};
