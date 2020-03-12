export const testCsv: string =
    'FareZoneName,NaptanCodes,AtcoCodes,\n' +
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
    'FareZoneName,NaptanCodes,AtcoCodes,\n' +
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
        'FareZoneName,NaptanCodes,AtcoCodes,\n' +
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
        'FareZoneName,NaptanCodes,AtcoCodes,\n' +
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
    Body: [
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC1',
            AtcoCodes: 'TestATCO-TC1',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC2',
            AtcoCodes: 'TestATCO-TC2',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC3',
            AtcoCodes: 'TestATCO-TC3',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC4',
            AtcoCodes: 'TestATCO-TC4',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC5',
            AtcoCodes: 'TestATCO-TC5',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC6',
            AtcoCodes: 'TestATCO-TC6',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC7',
            AtcoCodes: 'TestATCO-TC7',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC8',
            AtcoCodes: 'TestATCO-TC8',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC9',
            AtcoCodes: 'TestATCO-TC9',
        },
    ],
    ContentType: 'application/json; charset=utf-8',
};

export const processedObjectForEmptyCells = {
    Bucket: 'fdbt-user-data',
    Key: '780e3459-6305-4ae5-9082-b925b92cb46c',
    Body: [
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC1',
            AtcoCodes: 'TestATCO-TC1',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: '',
            AtcoCodes: 'TestATCO-TC2',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC3',
            AtcoCodes: 'TestATCO-TC3',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC4',
            AtcoCodes: 'TestATCO-TC4',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC5',
            AtcoCodes: 'TestATCO-TC5',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC6',
            AtcoCodes: 'TestATCO-TC6',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC7',
            AtcoCodes: 'TestATCO-TC7',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: '',
            AtcoCodes: 'TestATCO-TC8',
        },
        {
            FareZoneName: 'Town Centre',
            NaptanCodes: 'TestNaptan-TC9',
            AtcoCodes: 'TestATCO-TC9',
        },
    ],
    ContentType: 'application/json; charset=utf-8',
};
