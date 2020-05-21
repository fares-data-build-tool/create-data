/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';
import { RawService, Service } from '../../src/data/auroradb';
import { UserFareStages } from '../../src/data/s3';
import {
    MULTIPLE_PRODUCT_COOKIE,
    NUMBER_OF_PRODUCTS_COOKIE,
    OPERATOR_COOKIE,
    FARETYPE_COOKIE,
    SERVICE_COOKIE,
    JOURNEY_COOKIE,
    PASSENGER_TYPE_COOKIE,
    FARE_STAGES_COOKIE,
    CSV_ZONE_UPLOAD_COOKIE,
    PRODUCT_DETAILS_COOKIE,
    DAYS_VALID_COOKIE,
    PERIOD_TYPE_COOKIE,
    SERVICE_LIST_COOKIE,
} from '../../src/constants/index';

import { MultiProduct } from '../../src/pages/api/multipleProducts';

export const getMockRequestAndResponse = (
    cookieValues: any = {},
    body: any = null,
    uuid: any = {},
    mockWriteHeadFn = jest.fn(),
    mockEndFn = jest.fn(),
    requestHeaders: any = {},
): { req: any; res: any } => {
    const res = new MockRes();
    res.writeHead = mockWriteHeadFn;
    res.end = mockEndFn;
    const defaultUuid = '1e0459b3-082e-4e70-89db-96e8ae173e10';

    const {
        operator = 'test',
        fareType = 'single',
        passengerType = 'Adult',
        serviceLineName = 'X01',
        journey: { startPoint = '13003921A', endPoint = '13003655B' } = {},
        fareStages = 6,
        productName = 'Product A',
        productPrice = '1234',
        fareZoneName = 'fare zone 1',
        daysValid = '2',
        periodTypeName = 'period',
        numberOfProducts = '2',
        multipleProducts = [
            {
                productName: 'Weekly Ticket',
                productNameId: 'multipleProductName1',
                productPrice: '50',
                productPriceId: 'multipleProductPrice1',
                productDuration: '5',
                productDurationId: 'multipleProductDuration1',
            },
            {
                productName: 'Day Ticket',
                productNameId: 'multipleProductName2',
                productPrice: '2.50',
                productPriceId: 'multipleProductPrice2',
                productDuration: '1',
                productDurationId: 'multipleProductDuration2',
            },
            {
                productName: 'Monthly Ticket',
                productNameId: 'multipleProductName3',
                productPrice: '200',
                productPriceId: 'multipleProductPrice3',
                productDuration: '28',
                productDurationId: 'multipleProductDuration3',
            },
        ],
        selectedServices = [
            '12A#13/05/2020#Infinity Works, Leeds - Infinity Works, Manchester',
            '6#08/05/2020#Infinity Works, Edinburgh - Infinity Works, London',
            '101#06/05/2020#Infinity Works, Boston - Infinity Works, Berlin',
        ],
    } = cookieValues;

    const {
        operatorUuid = defaultUuid,
        fareTypeUuid = defaultUuid,
        passengerTypeUuid = defaultUuid,
        serviceUuid = defaultUuid,
        journeyUuid = defaultUuid,
        csvUploadZoneUuid = defaultUuid,
        daysValidUuid = defaultUuid,
    } = uuid;

    let cookieString = '';

    cookieString += operator
        ? `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%22${operatorUuid}%22%2C%22nocCode%22%3A%22HCTY%22%7D;`
        : '';

    cookieString += fareType
        ? `${FARETYPE_COOKIE}=%7B%22fareType%22%3A%22${fareType}%22%2C%22uuid%22%3A%22${fareTypeUuid}%22%7D;`
        : '';

    cookieString += passengerType
        ? `${PASSENGER_TYPE_COOKIE}=%7B%22passengerType%22%3A%22${passengerType}%22%2C%22uuid%22%3A%22${passengerTypeUuid}%22%7D;`
        : '';

    cookieString += serviceLineName
        ? `${SERVICE_COOKIE}=%7B%22service%22%3A%22${serviceLineName}%2329%2F04%2F2019%22%2C%22uuid%22%3A%22${serviceUuid}%22%7D;`
        : '';

    cookieString +=
        startPoint && endPoint
            ? `${JOURNEY_COOKIE}=%7B%22directionJourneyPattern%22%3A%22${startPoint}%23${endPoint}%22%2C%22inboundJourney%22%3A%22${startPoint}%23${endPoint}%22%2C%22outboundJourney%22%3A%22${startPoint}%23${endPoint}%22%2C%22uuid%22%3A%22${journeyUuid}%22%7D;`
            : '';

    cookieString += productName
        ? `${PRODUCT_DETAILS_COOKIE}=%7B%22productName%22%3A%22${productName}%22%2C%22productPrice%22%3A%22${productPrice}%22%7D;`
        : '';

    cookieString += fareZoneName
        ? `${CSV_ZONE_UPLOAD_COOKIE}=%7B%22fareZoneName%22%3A%22${fareZoneName}%22%2C%22uuid%22%3A%22${csvUploadZoneUuid}%22%7D;`
        : '';

    cookieString += daysValid
        ? `${DAYS_VALID_COOKIE}=%7B%22daysValid%22%3A%22${daysValid}%22%2C%22uuid%22%3A%22${daysValidUuid}%22%7D;`
        : '';

    cookieString += fareStages ? `${FARE_STAGES_COOKIE}=%7B%22fareStages%22%3A%22${fareStages}%22%7D;` : '';

    cookieString += periodTypeName
        ? `${PERIOD_TYPE_COOKIE}=%7B%22periodTypeName%22%3A%22${periodTypeName}%22%2C%22uuid%22%3A%22${operatorUuid}%22%7D;`
        : '';

    cookieString += numberOfProducts
        ? `${NUMBER_OF_PRODUCTS_COOKIE}=%7B%22numberOfProductsInput%22%3A%22${numberOfProducts}%22%2C%22uuid%22%3A%22${operatorUuid}%22%7D;`
        : '';

    cookieString += multipleProducts
        ? `${MULTIPLE_PRODUCT_COOKIE}=${encodeURI(JSON.stringify(multipleProducts))};`
        : '';

    cookieString += selectedServices
        ? `${SERVICE_LIST_COOKIE}=%7B%22error%22%3Afalse%2C%22selectedServices%22%3A${JSON.stringify(
              selectedServices,
          )}%7D`
        : '';

    const req = mockRequest({
        connection: {
            encrypted: true,
        },
        headers: {
            host: 'localhost:5000',
            cookie: cookieString,
            origin: 'localhost:5000',
            ...requestHeaders,
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

export const mockSingleService: RawService = {
    serviceDescription: '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
    operatorShortName: 'HCTY',
    journeyPatterns: [
        {
            orderedStopPoints: [
                {
                    stopPointRef: '13003921A',
                    commonName: 'Estate (Hail and Ride) N/B',
                },
                {
                    stopPointRef: '13003612D',
                    commonName: 'New Strangford Road SE/B',
                },
                {
                    stopPointRef: '13003611B',
                    commonName: 'New Tempest Road (York House) NE/B',
                },
                {
                    stopPointRef: '13003655B',
                    commonName: 'Interchange Stand B',
                },
            ],
        },
    ],
};

export const mockRawService: RawService = {
    serviceDescription: '\n\t\t\t\tInterchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea\n\t\t\t',
    operatorShortName: 'HCTY',
    journeyPatterns: [
        {
            orderedStopPoints: [
                {
                    stopPointRef: '13003921A',
                    commonName: 'Estate (Hail and Ride) N/B',
                },
                {
                    stopPointRef: '13003305E',
                    commonName: 'Westlea shops S/B',
                },
                {
                    stopPointRef: '13003306B',
                    commonName: 'Mount Pleasant NE/B',
                },
                {
                    stopPointRef: '13003618B',
                    commonName: 'The Avenue/Essex Crescent NE/B',
                },
                {
                    stopPointRef: '13003622B',
                    commonName: 'The Avenue Shops NE/B',
                },
                {
                    stopPointRef: '13003923B',
                    commonName: 'Kingston Avenue Hail and Ride NE/B',
                },
                {
                    stopPointRef: '13003939H',
                    commonName: 'Laurel Avenue NW/B',
                },
                { stopPointRef: '13003625C', commonName: 'Park E/B' },
                {
                    stopPointRef: '13003612D',
                    commonName: 'New Strangford Road SE/B',
                },
                {
                    stopPointRef: '13003611B',
                    commonName: 'New Tempest Road (York House) NE/B',
                },
                {
                    stopPointRef: '13003609E',
                    commonName: 'Vane Terrace/Castlereagh S/B',
                },
                {
                    stopPointRef: '13003661E',
                    commonName: 'Sophia Street S/B',
                },
                {
                    stopPointRef: '13003949C',
                    commonName: 'Viceroy Street E/B',
                },
                {
                    stopPointRef: '13003635B',
                    commonName: 'Adolphus Place NE/B',
                },
                {
                    stopPointRef: '13003655B',
                    commonName: 'Interchange Stand B',
                },
            ],
        },
        {
            orderedStopPoints: [
                {
                    stopPointRef: '13003655B',
                    commonName: 'Interchange Stand B',
                },
                {
                    stopPointRef: '13003654G',
                    commonName: 'North Railway Street W/B',
                },
                {
                    stopPointRef: '13003609A',
                    commonName: 'Vane Terrace/Castlereagh N/B',
                },
                {
                    stopPointRef: '13003611F',
                    commonName: 'New Tempest Road (York House) SW/B',
                },
                {
                    stopPointRef: '13003612H',
                    commonName: 'New Strangford Road NW/B',
                },
                { stopPointRef: '13003625G', commonName: 'Park W/B' },
                {
                    stopPointRef: '13003939D',
                    commonName: 'Laurel Avenue SE/B',
                },
                {
                    stopPointRef: '13003923F',
                    commonName: 'Kingston Avenue Hail and Ride SW/B',
                },
                {
                    stopPointRef: '13003622F',
                    commonName: 'The Avenue Shops SW/B',
                },
                { stopPointRef: '13003621F', commonName: 'The Lawns SW/B' },
                {
                    stopPointRef: '13003618F',
                    commonName: 'The Avenue/Essex Crescent SW/B',
                },
                {
                    stopPointRef: '13003306A',
                    commonName: 'Mount Pleasant N/B',
                },
                {
                    stopPointRef: '13003305A',
                    commonName: 'Westlea shops N/B',
                },
                {
                    stopPointRef: '13003921A',
                    commonName: 'Estate (Hail and Ride) N/B',
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
            orderedStopPoints: [
                {
                    stopPointRef: '13003921A',
                    commonName: 'Estate (Hail and Ride) N/B',
                },
                {
                    stopPointRef: '13003305E',
                    commonName: 'Westlea shops S/B',
                },
                {
                    stopPointRef: '13003306B',
                    commonName: 'Mount Pleasant NE/B',
                },
                {
                    stopPointRef: '13003618B',
                    commonName: 'The Avenue/Essex Crescent NE/B',
                },
                {
                    stopPointRef: '13003622B',
                    commonName: 'The Avenue Shops NE/B',
                },
                {
                    stopPointRef: '13003923B',
                    commonName: 'Kingston Avenue Hail and Ride NE/B',
                },
                {
                    stopPointRef: '13003939H',
                    commonName: 'Laurel Avenue NW/B',
                },
                { stopPointRef: '13003625C', commonName: 'Park E/B' },
                {
                    stopPointRef: '13003612D',
                    commonName: 'New Strangford Road SE/B',
                },
                {
                    stopPointRef: '13003611B',
                    commonName: 'New Tempest Road (York House) NE/B',
                },
                {
                    stopPointRef: '13003609E',
                    commonName: 'Vane Terrace/Castlereagh S/B',
                },
                {
                    stopPointRef: '13003661E',
                    commonName: 'Sophia Street S/B',
                },
                {
                    stopPointRef: '13003949C',
                    commonName: 'Viceroy Street E/B',
                },
                {
                    stopPointRef: '13003635B',
                    commonName: 'Adolphus Place NE/B',
                },
                {
                    stopPointRef: '13003655B',
                    commonName: 'Interchange Stand B',
                },
            ],
        },
        {
            orderedStopPoints: [
                {
                    stopPointRef: '13003655B',
                    commonName: 'Interchange Stand B',
                },
                {
                    stopPointRef: '13003654G',
                    commonName: 'North Railway Street W/B',
                },
                {
                    stopPointRef: '13003609A',
                    commonName: 'Vane Terrace/Castlereagh N/B',
                },
                {
                    stopPointRef: '13003611F',
                    commonName: 'New Tempest Road (York House) SW/B',
                },
                {
                    stopPointRef: '13003612H',
                    commonName: 'New Strangford Road NW/B',
                },
                { stopPointRef: '13003625G', commonName: 'Park W/B' },
                {
                    stopPointRef: '13003939D',
                    commonName: 'Laurel Avenue SE/B',
                },
                {
                    stopPointRef: '13003923F',
                    commonName: 'Kingston Avenue Hail and Ride SW/B',
                },
                {
                    stopPointRef: '13003622F',
                    commonName: 'The Avenue Shops SW/B',
                },
                { stopPointRef: '13003621F', commonName: 'The Lawns SW/B' },
                {
                    stopPointRef: '13003618F',
                    commonName: 'The Avenue/Essex Crescent SW/B',
                },
                {
                    stopPointRef: '13003306A',
                    commonName: 'Mount Pleasant N/B',
                },
                {
                    stopPointRef: '13003305A',
                    commonName: 'Westlea shops N/B',
                },
                {
                    stopPointRef: '13003921A',
                    commonName: 'Estate (Hail and Ride) N/B',
                },
            ],
        },
        {
            orderedStopPoints: [
                {
                    stopPointRef: '13003655B',
                    commonName: 'Interchange Stand B',
                },
                {
                    stopPointRef: '13003654G',
                    commonName: 'North Railway Street W/B',
                },
                {
                    stopPointRef: '13003999F',
                    commonName: 'New Tempest Road (York House) SW/B',
                },
                {
                    stopPointRef: '13003111A',
                    commonName: 'Vane Terrace/Castlereagh N/B',
                },
                {
                    stopPointRef: '13003612H',
                    commonName: 'New Strangford Road NW/B',
                },
                { stopPointRef: '13003625G', commonName: 'Park W/B' },
                {
                    stopPointRef: '13003939D',
                    commonName: 'Laurel Avenue SE/B',
                },
                {
                    stopPointRef: '13003921A',
                    commonName: 'Estate (Hail and Ride) N/B',
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
        parentLocalityName: 'IW Test',
        indicator: 'S-bound',
        street: 'B1285 Stockton Road',
    },
    {
        stopName: 'The Avenue Shops',
        naptanCode: 'duratgtm',
        atcoCode: '13003622B',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        parentLocalityName: 'IW Test',
        indicator: 'NE-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'Interchange Stand B',
        naptanCode: 'duratjwd',
        atcoCode: '13003655B',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'B',
        street: 'South Crescent',
    },
    {
        stopName: 'Adolphus Place',
        naptanCode: 'duratjga',
        atcoCode: '13003635B',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'NE-bound',
        street: 'South Terrace',
    },
    {
        stopName: 'The Avenue - Essex Crescent',
        naptanCode: 'duratgpt',
        atcoCode: '13003618B',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        parentLocalityName: 'IW Test',
        indicator: 'NE-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'New Strangford Road',
        naptanCode: 'duratgma',
        atcoCode: '13003612D',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'SE-bound',
        street: 'New Stranford Road',
    },
    {
        stopName: 'New Tempest Road - York House',
        naptanCode: 'duratgjt',
        atcoCode: '13003611B',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'NE-bound',
        street: 'Tempest Road',
    },
    {
        stopName: 'Mount Pleasant',
        naptanCode: 'durapmjg',
        atcoCode: '13003306B',
        localityCode: 'N0077347',
        localityName: 'New Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'NE-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'Viceroy Street',
        naptanCode: 'durgawmt',
        atcoCode: '13003949C',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'E-bound',
        street: 'Viceroy street',
    },
    {
        stopName: 'Vane Terrace - Castlereagh',
        naptanCode: 'duratgdt',
        atcoCode: '13003609E',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'S-bound',
        street: 'Vane Terrace',
    },
    {
        stopName: 'Estate Hail and Ride',
        naptanCode: 'durgawjp',
        atcoCode: '13003921A',
        localityCode: 'N0077347',
        localityName: 'New Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'N-bound',
        street: 'Windermere Road',
    },
    {
        stopName: 'Kingston Avenue',
        naptanCode: 'durawagw',
        atcoCode: '13003923B',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        parentLocalityName: 'IW Test',
        indicator: 'NE-bound',
        street: 'Kingston Avenue',
    },
    {
        stopName: 'Park',
        naptanCode: 'duratgwg',
        atcoCode: '13003625C',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        parentLocalityName: 'IW Test',
        indicator: 'E-bound',
        street: 'The Avenue',
    },
    {
        stopName: 'Laurel Avenue',
        naptanCode: 'durawamp',
        atcoCode: '13003939H',
        localityCode: 'E0010170',
        localityName: 'Deneside',
        parentLocalityName: 'IW Test',
        indicator: 'NW-bound',
        street: 'Laurel Avenue',
    },
    {
        stopName: 'Sophia Street',
        naptanCode: 'durgapwp',
        atcoCode: '13003661E',
        localityCode: 'E0045957',
        localityName: 'Seaham',
        parentLocalityName: 'IW Test',
        indicator: 'S-bound',
        street: 'Sophia Street',
    },
];

export const service = {
    type: 'pointToPoint',
    lineName: '215',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
};

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

export const mockMatchingUserFareStagesWithUnassignedStages = {
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

export const mockMatchingUserFareStagesWithAllStagesAssigned = {
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
            stageName: 'Blossom Street',
            prices: [
                {
                    price: '1.00',
                    fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
                },
            ],
        },
        {
            stageName: 'Piccadilly (York)',
            prices: {},
        },
    ],
};

export const expectedMatchingJsonSingle = {
    type: 'pointToPoint',
    lineName: '215',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
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

export const expectedMatchingJsonReturnNonCircular = {
    type: 'return',
    lineName: '215',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
    inboundFareZones: [
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
    outboundFareZones: [
        {
            name: 'Acomb Green Lane',
            stops: [
                {
                    stopName: 'Yoden Way - Chapel Hill Road',
                    atcoCode: '13003521G',
                    localityCode: 'E0045956',
                    naptanCode: 'duratdmj',
                    localityName: 'Peterlee',
                    indicator: 'W-bound',
                    street: 'Yodan Way',
                    qualifierName: '',
                    parentLocalityName: 'IW Test',
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
    ],
};

export const expectedMatchingJsonReturnCircular = {
    type: 'return',
    lineName: '215',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
    inboundFareZones: [],
    outboundFareZones: [
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

export const matchingOutBound = {
    'Acomb Green Lane': {
        name: 'Acomb Green Lane',
        stops: [
            {
                stopName: 'Yoden Way - Chapel Hill Road',
                atcoCode: '13003521G',
                localityCode: 'E0045956',
                naptanCode: 'duratdmj',
                localityName: 'Peterlee',
                indicator: 'W-bound',
                street: 'Yodan Way',
                qualifierName: '',
                parentLocalityName: 'IW Test',
            },
        ],
        prices: [
            {
                price: '1.10',
                fareZones: ['Mattison Way', 'Nursery Drive', 'Holl Bank/Beech Ave'],
            },
            {
                price: '1.70',
                fareZones: ['Cambridge Street (York)', 'Blossom Street', 'Rail Station (York)', 'Piccadilly (York)'],
            },
        ],
    },
    'Mattison Way': {
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
                parentLocalityName: 'IW Test',
            },
        ],
        prices: [
            { price: '1.10', fareZones: ['Nursery Drive', 'Holl Bank/Beech Ave'] },
            {
                price: '1.70',
                fareZones: ['Cambridge Street (York)', 'Blossom Street', 'Rail Station (York)', 'Piccadilly (York)'],
            },
        ],
    },
    'Holl Bank/Beech Ave': {
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
                parentLocalityName: 'IW Test',
            },
        ],
        prices: [
            { price: '1.10', fareZones: ['Cambridge Street (York)', 'Blossom Street'] },
            { price: '1.70', fareZones: ['Rail Station (York)', 'Piccadilly (York)'] },
        ],
    },
    'Blossom Street': {
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
                parentLocalityName: 'IW Test',
            },
        ],
        prices: [{ price: '1.00', fareZones: ['Rail Station (York)', 'Piccadilly (York)'] }],
    },
    'Piccadilly (York)': {
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
                parentLocalityName: 'IW Test',
            },
        ],
        prices: {},
    },
};

export const expectedSingleProductUploadJsonWithZoneUpload = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'HCTY',
    products: [
        {
            productName: 'Product A',
            productPrice: '1234',
            productDuration: '2',
            productValidity: '24hr',
        },
    ],
    zoneName: 'fare zone 1',
    stops: naptanStopInfo,
};

export const expectedSingleProductUploadJsonWithSelectedServices = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'HCTY',
    products: [
        {
            productName: 'Product A',
            productPrice: '1234',
            productDuration: '2',
            productValidity: '24hr',
        },
    ],
    selectedServices: [
        {
            lineName: '12A',
            startDate: '13/05/2020',
            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
        },
        {
            lineName: '6',
            startDate: '08/05/2020',
            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
        },
        {
            lineName: '101',
            startDate: '06/05/2020',
            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
        },
    ],
};

export const expectedMultiProductUploadJsonWithZoneUpload = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'HCTY',
    products: [
        {
            productName: 'Weekly Ticket',
            productPrice: '50',
            productDuration: '5',
            productValidity: '24hr',
        },
        {
            productName: 'Day Ticket',
            productPrice: '2.50',
            productDuration: '1',
            productValidity: '24hr',
        },
        {
            productName: 'Monthly Ticket',
            productPrice: '200',
            productDuration: '28',
            productValidity: 'endOfCalendarDay',
        },
    ],
    zoneName: 'fare zone 1',
    stops: naptanStopInfo,
};

export const expectedMultiProductUploadJsonWithSelectedServices = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'HCTY',
    products: [
        {
            productName: 'Weekly Ticket',
            productPrice: '50',
            productDuration: '5',
            productValidity: '24hr',
        },
        {
            productName: 'Day Ticket',
            productPrice: '2.50',
            productDuration: '1',
            productValidity: '24hr',
        },
        {
            productName: 'Monthly Ticket',
            productPrice: '200',
            productDuration: '28',
            productValidity: 'endOfCalendarDay',
        },
    ],
    selectedServices: [
        {
            lineName: '12A',
            startDate: '13/05/2020',
            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
        },
        {
            lineName: '6',
            startDate: '08/05/2020',
            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
        },
        {
            lineName: '101',
            startDate: '06/05/2020',
            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
        },
    ],
};

export const expectedFlatFareProductUploadJson = {
    operatorName: 'test',
    type: 'flatFare',
    nocCode: 'HCTY',
    products: [
        {
            productName: 'Weekly Rider',
            productPrice: '7',
        },
    ],
    selectedServices: [
        {
            lineName: '12A',
            startDate: '13/05/2020',
            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
        },
        {
            lineName: '6',
            startDate: '08/05/2020',
            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
        },
        {
            lineName: '101',
            startDate: '06/05/2020',
            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
        },
    ],
};

export const multipleProducts: MultiProduct[] = [
    {
        productName: 'p',
        productNameId: 'productOneId',
        productNameError: 'Name too short',
        productPrice: '3.50',
        productPriceId: 'productOnePriceId',
        productDuration: '66.5',
        productDurationId: 'productOneDurationId',
        productDurationError: 'Product duration must be a whole number',
    },
    {
        productName: 'Super ticket',
        productNameId: 'productOneId',
        productPrice: '3.50gg',
        productPriceId: 'productOnePriceId',
        productPriceError: 'Product price must be a valid price',
        productDuration: '7',
        productDurationId: 'productOneDurationId',
    },
];

export const multipleProductsWithoutErrors: MultiProduct[] = [
    {
        productName: 'Best ticket',
        productNameId: 'productOneId',
        productPrice: '3.50',
        productPriceId: 'productOnePriceId',
        productDuration: '66',
        productDurationId: 'productOneDurationId',
    },
    {
        productName: 'Super ticket',
        productNameId: 'productOneId',
        productPrice: '3.50',
        productPriceId: 'productOnePriceId',
        productDuration: '7',
        productDurationId: 'productOneDurationId',
    },
];

export const invalidDurationProducts: MultiProduct[] = [
    {
        productName: 'valid duration',
        productNameId: 'multipleProductNameInput0',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '66',
        productDurationId: '.',
    },
    {
        productName: 'zero duration',
        productNameId: '.',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '0',
        productDurationId: '.',
    },
    {
        productName: 'negative duration',
        productNameId: '.',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '-1',
        productDurationId: '.',
    },
    {
        productName: 'empty duration',
        productNameId: '.',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '',
        productDurationId: '.',
    },
    {
        productName: 'non-numeric duration',
        productNameId: '.',
        productPrice: '.',
        productPriceId: '.',
        productDuration: 'ddd',
        productDurationId: '.',
    },
];

export const invalidPriceProducts: MultiProduct[] = [
    {
        productName: 'valid price',
        productNameId: '.',
        productPrice: '4.50',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
    {
        productName: 'empty price',
        productNameId: '.',
        productPrice: '',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
    {
        productName: 'negative price',
        productNameId: '.',
        productPrice: '-3.00',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
    {
        productName: 'non-numeric / invalid price',
        productNameId: '.',
        productPrice: '3.g6',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
];

export const invalidNameProducts: MultiProduct[] = [
    {
        productName: 'Super Saver Bus Ticket',
        productNameId: 'valid name',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
    {
        productName: '',
        productNameId: 'empty name',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
    {
        productName: 'S',
        productNameId: 'Too short name',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
    {
        productName:
            'Super Saver Bus Ticket for the cheapest you have ever seen and no other bus service will compare to this one, or your money back',
        productNameId: 'Too Long name',
        productPrice: '.',
        productPriceId: '.',
        productDuration: '.',
        productDurationId: '.',
    },
];
