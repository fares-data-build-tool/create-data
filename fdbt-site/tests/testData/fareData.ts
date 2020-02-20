import { RawServiceInformation } from '../../src/data/dynamodb';
import { UserFareStages } from '../../src/data/s3';

export const serviceData: RawServiceInformation = {
    serviceDescription: '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
    operatorShortName: 'HCTY',
    journeyPatterns: [
        {
            JourneyPatternSections: [
                {
                    OrderedStopPoints: [
                        {
                            StopPointRef: '13003921A',
                            CommonName: 'Estate (Hail and Ride) N/B',
                        },
                        {
                            StopPointRef: '13003305E',
                            CommonName: 'Westlea shops S/B',
                        },
                        {
                            StopPointRef: '13003306B',
                            CommonName: 'Mount Pleasant NE/B',
                        },
                        {
                            StopPointRef: '13003618B',
                            CommonName: 'The Avenue/Essex Crescent NE/B',
                        },
                        {
                            StopPointRef: '13003622B',
                            CommonName: 'The Avenue Shops NE/B',
                        },
                        {
                            StopPointRef: '13003923B',
                            CommonName: 'Kingston Avenue Hail and Ride NE/B',
                        },
                        {
                            StopPointRef: '13003939H',
                            CommonName: 'Laurel Avenue NW/B',
                        },
                        { StopPointRef: '13003625C', CommonName: 'Park E/B' },
                        {
                            StopPointRef: '13003612D',
                            CommonName: 'New Strangford Road SE/B',
                        },
                        {
                            StopPointRef: '13003611B',
                            CommonName: 'New Tempest Road (York House) NE/B',
                        },
                        {
                            StopPointRef: '13003609E',
                            CommonName: 'Vane Terrace/Castlereagh S/B',
                        },
                        {
                            StopPointRef: '13003661E',
                            CommonName: 'Sophia Street S/B',
                        },
                        {
                            StopPointRef: '13003949C',
                            CommonName: 'Viceroy Street E/B',
                        },
                        {
                            StopPointRef: '13003635B',
                            CommonName: 'Adolphus Place NE/B',
                        },
                        {
                            StopPointRef: '13003655B',
                            CommonName: 'Interchange Stand B',
                        },
                    ],
                    StartPoint: 'Estate (Hail and Ride) N/B',
                    EndPoint: 'Interchange Stand B',
                    Id: 'JPS_I0',
                },
            ],
        },
        {
            JourneyPatternSections: [
                {
                    OrderedStopPoints: [
                        {
                            StopPointRef: '13003655B',
                            CommonName: 'Interchange Stand B',
                        },
                        {
                            StopPointRef: '13003654G',
                            CommonName: 'North Railway Street W/B',
                        },
                        {
                            StopPointRef: '13003609A',
                            CommonName: 'Vane Terrace/Castlereagh N/B',
                        },
                        {
                            StopPointRef: '13003611F',
                            CommonName: 'New Tempest Road (York House) SW/B',
                        },
                        {
                            StopPointRef: '13003612H',
                            CommonName: 'New Strangford Road NW/B',
                        },
                        { StopPointRef: '13003625G', CommonName: 'Park W/B' },
                        {
                            StopPointRef: '13003939D',
                            CommonName: 'Laurel Avenue SE/B',
                        },
                        {
                            StopPointRef: '13003923F',
                            CommonName: 'Kingston Avenue Hail and Ride SW/B',
                        },
                        {
                            StopPointRef: '13003622F',
                            CommonName: 'The Avenue Shops SW/B',
                        },
                        { StopPointRef: '13003621F', CommonName: 'The Lawns SW/B' },
                        {
                            StopPointRef: '13003618F',
                            CommonName: 'The Avenue/Essex Crescent SW/B',
                        },
                        {
                            StopPointRef: '13003306A',
                            CommonName: 'Mount Pleasant N/B',
                        },
                        {
                            StopPointRef: '13003305A',
                            CommonName: 'Westlea shops N/B',
                        },
                        {
                            StopPointRef: '13003921A',
                            CommonName: 'Estate (Hail and Ride) N/B',
                        },
                    ],
                    StartPoint: 'Interchange Stand B',
                    EndPoint: 'Estate (Hail and Ride) N/B',
                    Id: 'JPS_O1',
                },
            ],
        },
    ],
};

export const userData: UserFareStages = {
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
            prices: [{ price: '1.00', fareZones: ['Piccadilly (York)'] }],
        },
        { stageName: 'Piccadilly (York)', prices: [] },
    ],
};

export const naptanStopInfo = [
    {
        stopName: 'Westlea shops',
        naptanCode: 'durapmja',
        atcoCode: '13003305E',
        localityCode: 'N0077347',
        localityName: 'New Seaham',
        indicator: 'S-bound',
        street: 'B1285 Stockton Road',
    },
    {
        stopName: 'The Avenue Shops',
        naptanCode: 'duratgtm',
        atcoCode: '13003622B',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        indicator: 'NE-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'Adolphus Place',
        naptanCode: 'duratjga',
        atcoCode: '13003635B',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'NE-bound',
        street: 'South Terrace',
    },
    {
        stopName: 'The Avenue - Essex Crescent',
        naptanCode: 'duratgpt',
        atcoCode: '13003618B',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        indicator: 'NE-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'New Strangford Road',
        naptanCode: 'duratgma',
        atcoCode: '13003612D',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'SE-bound',
        street: 'New Stranford Road',
    },
    {
        stopName: 'New Tempest Road - York House',
        naptanCode: 'duratgjt',
        atcoCode: '13003611B',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'NE-bound',
        street: 'Tempest Road',
    },
    {
        stopName: 'Mount Pleasant',
        naptanCode: 'durapmjg',
        atcoCode: '13003306B',
        localityCode: 'N0077347',
        localityName: 'New Seaham',
        indicator: 'NE-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'Viceroy Street',
        naptanCode: 'durgawmt',
        atcoCode: '13003949C',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'E-bound',
        street: 'Viceroy street',
    },
    {
        stopName: 'Vane Terrace - Castlereagh',
        naptanCode: 'duratgdt',
        atcoCode: '13003609E',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'S-bound',
        street: 'Vane Terrace',
    },
    {
        stopName: 'Estate Hail and Ride',
        naptanCode: 'durgawjp',
        atcoCode: '13003921A',
        localityCode: 'N0077347',
        localityName: 'New Seaham',
        indicator: 'N-bound',
        street: 'Windermere Road',
    },
    {
        stopName: 'Kingston Avenue',
        naptanCode: 'durawagw',
        atcoCode: '13003923B',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        indicator: 'NE-bound',
        street: 'Kingston Avenue',
    },
    {
        stopName: 'Park',
        naptanCode: 'duratgwg',
        atcoCode: '13003625C',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        indicator: 'E-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'Laurel Avenue',
        naptanCode: 'durawamp',
        atcoCode: '13003939H',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        indicator: 'NW-bound',
        street: 'Laurel Avenue',
    },
    {
        stopName: 'Sophia Street',
        naptanCode: 'durgapwp',
        atcoCode: '13003661E',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'S-bound',
        street: 'Sophia Street',
    },
];

export const serviceInfo = { lineName: '215', nocCode: 'DCCL', operatorShortName: 'DCC' };
