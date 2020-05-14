const geoZonePeriodData = {
    type: 'period',
    zoneName: 'IW Village',
    stops: [
        {
            stopName: 'Woodcock Park',
            naptanCode: 'wilajmwd',
            atcoCode: '4600WIA11163',
            localityCode: 'E0056891',
            localityName: 'Warminster',
            parentLocalityName: 'LEEDS',
            indicator: 'E-bound',
            street: 'Woodcock Road',
        },
        {
            stopName: 'Ellacombe Road Shops',
            naptanCode: 'sglgdjd',
            atcoCode: '0170SGB20303',
            localityCode: 'E0041864',
            localityName: 'Longwell Green',
            parentLocalityName: 'LEEDS',
            indicator: 'SW-bound',
            street: 'Ellacombe Road',
        },
        {
            stopName: 'Manchester Rd',
            naptanCode: 'MANATDWT',
            atcoCode: '1800ED24711',
            localityCode: 'E0028839',
            localityName: 'Hollinwood',
            parentLocalityName: 'LEEDS',
            indicator: 'Stop A',
            street: 'MANCHESTER RD',
        },
        {
            stopName: 'Skippool Avenue',
            naptanCode: 'langjpaw',
            atcoCode: '2500IMG456',
            localityCode: 'E0016583',
            localityName: 'Poulton-le-Fylde',
            parentLocalityName: 'LEEDS',
            indicator: 'opp',
            street: 'Breck Road',
        },
        {
            stopName: 'Warleigh Crescent',
            naptanCode: 'plygpaj',
            atcoCode: '1180PLA10404',
            localityCode: 'E0040583',
            localityName: 'Derriford',
            parentLocalityName: 'LEEDS',
            indicator: 'E-bound',
            street: 'Looseleigh Lane',
        },
        {
            stopName: 'Bank End Farm',
            naptanCode: '37055608',
            atcoCode: '370055608',
            localityCode: 'E0030284',
            localityName: 'Howbrook',
            parentLocalityName: 'LEEDS',
            indicator: '',
            street: 'Bank Lane',
        },
        {
            stopName: 'Deeside Leisure Centre',
            naptanCode: 'flijmgd',
            atcoCode: '5120WDB21629',
            localityCode: 'E0054252',
            localityName: 'Queensferry',
            parentLocalityName: 'LEEDS',
            indicator: '',
            street: 'Chester Road West',
        },
        {
            stopName: 'Hare & Hounds',
            naptanCode: '32010274',
            atcoCode: '3200YNF10274',
            localityCode: 'E0048917',
            localityName: 'Lothersdale',
            parentLocalityName: 'LEEDS',
            indicator: '32010274',
            street: 'Rook Street',
        },
        {
            stopName: 'Caedu Crossing',
            naptanCode: 'bregdtw',
            atcoCode: '5510ANZ12855',
            localityCode: 'E0035483',
            localityName: 'Ogmore Vale',
            parentLocalityName: 'LEEDS',
            indicator: 'after',
            street: 'Alma Terrace',
        },
        {
            stopName: 'The Summit',
            naptanCode: 'MANDWAWJ',
            atcoCode: '1800NE01231',
            localityCode: 'E0029398',
            localityName: 'Summit',
            parentLocalityName: 'LEEDS',
            indicator: 'opp',
            street: 'TODMORDEN RD',
        },
        {
            stopName: 'Fox & Raven',
            naptanCode: 'esxjdwpj',
            atcoCode: '1500CHVILL1C',
            localityCode: 'N0076772',
            localityName: 'Chelmer Village',
            parentLocalityName: 'LEEDS',
            indicator: 'o/s',
            street: 'Chelmer Village Way',
        },
        {
            stopName: 'Peake Avenue',
            naptanCode: 'wardmatm',
            atcoCode: '4200F216202',
            localityCode: 'E0026040',
            localityName: 'Nuneaton',
            parentLocalityName: 'LEEDS',
            indicator: 'Opp',
            street: 'St Nicolas Park Drive',
        },
        {
            stopName: 'Lyde Road End',
            naptanCode: '67524289',
            atcoCode: '6020710632',
            localityCode: 'ES001323',
            localityName: 'Rendall',
            parentLocalityName: 'LEEDS',
            indicator: 'opp',
            street: 'A966',
        },
        {
            stopName: 'Crossroads Cottage',
            naptanCode: '26426393',
            atcoCode: '6490IM063',
            localityCode: 'N0067035',
            localityName: 'Chapelton',
            parentLocalityName: 'LEEDS',
            indicator: 'opp',
            street: 'B965',
        },
        {
            stopName: 'Brough Moor Road',
            naptanCode: '22001392',
            atcoCode: '2200YEZ01392',
            localityCode: 'E0036884',
            localityName: 'Brough',
            parentLocalityName: 'LEEDS',
            indicator: '22001392',
            street: 'Moor Road',
        },
        {
            stopName: 'Bridge End',
            naptanCode: 'dbsdpgta',
            atcoCode: '100000008363',
            localityCode: 'E0045128',
            localityName: 'Derwent',
            parentLocalityName: 'LEEDS',
            indicator: 'Adj',
            street: 'Derwent Lane',
        },
        {
            stopName: 'Bus Station',
            naptanCode: 'CHEPWJP',
            atcoCode: '0600MA6110',
            localityCode: 'N0076467',
            localityName: 'Macclesfield',
            parentLocalityName: 'LEEDS',
            indicator: 'Stand 9',
            street: 'Queen Victoria Street',
        },
        {
            stopName: 'Arram Rail Station',
            naptanCode: '',
            atcoCode: '9100ARRAM',
            localityCode: 'E0036851',
            localityName: 'Arram',
            parentLocalityName: 'LEEDS',
            indicator: '',
            street: '-',
        },
    ],
    products: [
        {
            productName: 'IW Product',
            productPrice: '1000',
            daysValid: '24',
            expiryRules: 'endOfCalendarDay',
        },
        {
            productName: 'Super Product',
            productPrice: '1230',
            daysValid: '4',
            expiryRules: '24hr',
        },
    ],
    nocCode: 'IW1234',
    operatorName: 'InfinityWorks',
};

export default geoZonePeriodData;
