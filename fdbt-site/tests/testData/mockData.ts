/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { NextPageContext } from 'next';
import mockReqRes, { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';
import { RawService, Service } from '../../src/data/dynamodb';
import { UserFareStages } from '../../src/data/s3';
import {
    OPERATOR_COOKIE,
    FARETYPE_COOKIE,
    SERVICE_COOKIE,
    JOURNEY_COOKIE,
    FARE_STAGES_COOKIE,
} from '../../src/constants';

export const getMockRequestAndResponse = (
    cookieValues: any = {},
    body: any = null,
    uuid: any = {},
    mockWriteHeadFn = jest.fn(),
    mockEndFn = jest.fn(),
): { req: mockReqRes.RequestOutput; res: any } => {
    const res = new MockRes();
    res.writeHead = mockWriteHeadFn;
    res.end = mockEndFn;
    const defaultUuid = '1e0459b3-082e-4e70-89db-96e8ae173e10';

    const {
        operator = 'test',
        faretype = 'single',
        serviceLineName = 'X01',
        journey: { startPoint = '13003921A', endPoint = '13003655B' } = {},
        fareStages = 6,
    } = cookieValues;

    const {
        operatorUuid = defaultUuid,
        faretypeUuid = defaultUuid,
        serviceUuid = defaultUuid,
        journeyUuid = defaultUuid,
    } = uuid;

    let cookieString = '';

    cookieString += operator
        ? `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%22${operatorUuid}%22%2C%22nocCode%22%3A%22HCTY%22%7D;`
        : '';

    cookieString += faretype
        ? `${FARETYPE_COOKIE}=%7B%22faretype%22%3A%22${faretype}%22%2C%22uuid%22%3A%22${faretypeUuid}%22%7D;`
        : '';

    cookieString += serviceLineName
        ? `${SERVICE_COOKIE}=%7B%22service%22%3A%22${serviceLineName}%2329%2F04%2F2019%22%2C%22uuid%22%3A%22${serviceUuid}%22%7D;`
        : '';

    cookieString +=
        startPoint && endPoint
            ? `${JOURNEY_COOKIE}=%7B%22journeyPattern%22%3A%22${startPoint}%23${endPoint}%22%2C%22uuid%22%3A%22${journeyUuid}%22%7D;`
            : '';

    cookieString += fareStages ? `${FARE_STAGES_COOKIE}=%7B%22fareStages%22%3A%22${fareStages}%22%7D;` : '';

    const req = mockRequest({
        connection: {
            encrypted: true,
        },
        headers: {
            host: 'localhost:5000',
            cookie: cookieString,
            origin: 'localhost:5000',
        },
        cookies: cookieValues,
    });

    if (body) {
        req.body = body;
    }

    return { req, res };
};

export const getMockContext = (
    cookies: any = {},
    body: any = null,
    uuid: any = {},
    mockWriteHeadFn = jest.fn(),
    mockEndFn = jest.fn(),
): NextPageContext => {
    const { req, res } = getMockRequestAndResponse(cookies, body, uuid, mockWriteHeadFn, mockEndFn);

    const ctx: NextPageContext = {
        res,
        req,
        pathname: '',
        query: {},
        AppTree: () => React.createElement('div'),
    };

    return ctx;
};

export const mockRawService: RawService = {
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

export const mockRawServiceWithDuplicates: RawService = {
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
                    Id: 'JPS_I1',
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
                            StopPointRef: '13003999F',
                            CommonName: 'New Tempest Road (York House) SW/B',
                        },
                        {
                            StopPointRef: '13003111A',
                            CommonName: 'Vane Terrace/Castlereagh N/B',
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
                            StopPointRef: '13003921A',
                            CommonName: 'Estate (Hail and Ride) N/B',
                        },
                    ],
                    StartPoint: 'Interchange Stand B',
                    EndPoint: 'Estate (Hail and Ride) N/B',
                    Id: 'JPS_I2',
                },
            ],
        },
    ],
};

export const userFareStages: UserFareStages = {
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
        stopName: 'Interchange Stand B',
        naptanCode: 'duratjwd',
        atcoCode: '13003655B',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        indicator: 'B',
        street: 'South Crescent',
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

export const service = { lineName: '215', nocCode: 'DCCL', operatorShortName: 'DCC' };

export const mockService: Service = {
    serviceDescription: '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
    operatorShortName: 'HCTY',
    journeyPatterns: [
        {
            startPoint: { Display: 'Estate (Hail and Ride) N/B', Id: '13003921A' },
            endPoint: { Display: 'Interchange Stand B', Id: '13003655B' },
            stopList: [
                '13003921A',
                '13003305E',
                '13003306B',
                '13003618B',
                '13003622B',
                '13003923B',
                '13003939H',
                '13003625C',
                '13003612D',
                '13003611B',
                '13003609E',
                '13003661E',
                '13003949C',
                '13003635B',
                '13003655B',
            ],
        },
        {
            startPoint: { Display: 'Interchange Stand B', Id: '13003655B' },
            endPoint: { Display: 'Estate (Hail and Ride) N/B', Id: '13003921A' },
            stopList: [
                '13003655B',
                '13003654G',
                '13003609A',
                '13003611F',
                '13003612H',
                '13003625G',
                '13003939D',
                '13003923F',
                '13003622F',
                '13003621F',
                '13003618F',
                '13003306A',
                '13003305A',
                '13003921A',
            ],
        },
    ],
};

export const mockMatchingUserFareStages = {
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
            prices: {},
        },
    ],
};

export const expectedMatchingJson = {
    lineName: '215',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    fareZones: [
        {
            name: 'Acomb Green Lane',
            stops: [
                {
                    stopName: 'Yoden Way - Chapel Hill Road',
                    naptanCode: 'duratdmj',
                    atcoCode: '13003521G',
                    localityCode: 'E0045956',
                    localityName: 'Peterlee',
                    indicator: 'W-bound',
                    street: 'Yodan Way',
                    qualifierName: '',
                },
            ],
            prices: [
                { price: '1.10', fareZones: ['Mattison Way', 'Nursery Drive', 'Holl Bank/Beech Ave'] },
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
            name: 'Mattison Way',
            stops: [
                {
                    stopName: 'Yoden Way',
                    naptanCode: 'duratdmt',
                    atcoCode: '13003522F',
                    localityCode: 'E0010183',
                    localityName: 'Horden',
                    indicator: 'SW-bound',
                    street: 'Yoden Way',
                    qualifierName: '',
                },
            ],
            prices: [
                { price: '1.10', fareZones: ['Nursery Drive', 'Holl Bank/Beech Ave'] },
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
            name: 'Holl Bank/Beech Ave',
            stops: [
                {
                    stopName: 'Surtees Rd-Edenhill Rd',
                    naptanCode: 'durapgdw',
                    atcoCode: '13003219H',
                    localityCode: 'E0045956',
                    localityName: 'Peterlee',
                    indicator: 'NW-bound',
                    street: 'Surtees Road',
                    qualifierName: '',
                },
            ],
            prices: [
                { price: '1.10', fareZones: ['Cambridge Street (York)', 'Blossom Street'] },
                { price: '1.70', fareZones: ['Rail Station (York)', 'Piccadilly (York)'] },
            ],
        },
        {
            name: 'Blossom Street',
            stops: [
                {
                    stopName: 'Bus Station',
                    naptanCode: 'duratdma',
                    atcoCode: '13003519H',
                    localityCode: 'E0045956',
                    localityName: 'Peterlee',
                    indicator: 'H',
                    street: 'Bede Way',
                    qualifierName: '',
                },
            ],
            prices: [{ price: '1.00', fareZones: ['Rail Station (York)', 'Piccadilly (York)'] }],
        },
        {
            name: 'Piccadilly (York)',
            stops: [
                {
                    stopName: 'Kell Road',
                    naptanCode: 'duraptwp',
                    atcoCode: '13003345D',
                    localityCode: 'E0010183',
                    localityName: 'Horden',
                    indicator: 'SE-bound',
                    street: 'Kell Road',
                    qualifierName: '',
                },
            ],
            prices: {},
        },
    ],
};
