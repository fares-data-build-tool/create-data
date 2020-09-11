/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';
import { defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo } from '../../src/pages/selectSalesOfferPackage';
import {
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    STAGE_NAMES_ATTRIBUTE,
    DAYS_VALID_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    INPUT_METHOD_ATTRIBUTE,
    PERIOD_TYPE_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    OPERATOR_COOKIE,
    PRODUCT_DETAILS_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    ID_TOKEN_COOKIE,
    USER_COOKIE,
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    FARE_STAGES_ATTRIBUTE,
} from '../../src/constants/index';

import { RawService, Service } from '../../src/data/auroradb';
import { UserFareStages } from '../../src/data/s3';

import { MultiProduct } from '../../src/pages/api/multipleProducts';
import { RadioConditionalInputFieldset } from '../../src/components/RadioConditionalInput';
import {
    ErrorInfo,
    Breadcrumb,
    NextPageContextWithSession,
    BasicService,
    SingleTicket,
    ReturnTicket,
    PeriodGeoZoneTicket,
    Stop,
    PeriodMultipleServicesTicket,
    FlatFareTicket,
    SalesOfferPackage,
    ProductDetails,
    TimeRestriction,
} from '../../src/interfaces';
import { MatchingFareZones } from '../../src/interfaces/matchingInterface';
import { TextInputFieldset } from '../../src/pages/definePassengerType';

interface GetMockContextInput {
    session?: { [key: string]: any };
    cookies?: any;
    body?: any;
    url?: any;
    uuid?: any;
    mockWriteHeadFn?: jest.Mock<any, any>;
    mockEndFn?: jest.Mock<any, any>;
    isLoggedin?: boolean;
    query?: any;
}

interface GetMockRequestAndResponse {
    session?: { [key: string]: any };
    cookieValues?: any;
    body?: any;
    uuid?: any;
    mockWriteHeadFn?: jest.Mock<any, any>;
    mockEndFn?: jest.Mock<any, any>;
    requestHeaders?: any;
    isLoggedin?: boolean;
    url?: any;
}

export const getMockRequestAndResponse = ({
    cookieValues = {},
    body = null,
    uuid = {},
    mockWriteHeadFn = jest.fn(),
    mockEndFn = jest.fn(),
    requestHeaders = {},
    isLoggedin = true,
    url = null,
    session,
}: GetMockRequestAndResponse = {}): { req: any; res: any } => {
    const res = new MockRes();
    res.writeHead = mockWriteHeadFn;
    res.end = mockEndFn;
    const defaultUuid = '1e0459b3-082e-4e70-89db-96e8ae173e10';

    const {
        operator = {
            operator: {
                operatorPublicName: 'test',
            },
            noc: 'TEST',
        },
        productName = 'Product A',
        productPrice = '1234',
        idToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXN0b206bm9jIjoiVEVTVCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImp0aSI6Ijg1MmQ1MTVlLTU5YWUtNDllZi1iMTA5LTI4YTRhNzk3YWFkNSIsImlhdCI6MTU5Mjk4NzMwNywiZXhwIjoxNTkyOTkwOTA3fQ.DFdxnpdhykDONOMeZMNeMUFpCHZ-hQ3UXczq_Qh0IAI',
        userCookieValue = null,
    } = cookieValues;

    const defaultSession = {
        [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
        [SERVICE_ATTRIBUTE]: { service: 'X01#NW_05_BLAC_12A_1' },
        [INPUT_METHOD_ATTRIBUTE]: { inputMethod: 'csv' },
        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'Adult' },
        [DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE]: { passengerType: 'Adult' },
        [DAYS_VALID_ATTRIBUTE]: { daysValid: '2', errors: [] },
        [PERIOD_TYPE_ATTRIBUTE]: { name: 'period' },
        [FARE_STAGES_ATTRIBUTE]: { fareStages: 6 },
        [STAGE_NAMES_ATTRIBUTE]: ['Stage name one', 'Stage name two', 'Stage name three'],
        [SERVICE_LIST_ATTRIBUTE]: {
            selectedServices: [
                '12A#NW_05_BLAC_12A_1#13/05/2020#Infinity Works, Leeds - Infinity Works, Manchester',
                '6#NW_05_BLAC_6_1#08/05/2020#Infinity Works, Edinburgh - Infinity Works, London',
                '101#NW_05_BLAC_101_1#06/05/2020#Infinity Works, Boston - Infinity Works, Berlin',
            ],
        },
        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: {
            numberOfProducts: 2,
        },
        [MULTIPLE_PRODUCT_ATTRIBUTE]: {
            products: [
                {
                    productName: 'Weekly Ticket',
                    productNameId: 'multiple-product-name-1',
                    productPrice: '50',
                    productPriceId: 'multiple-product-price-1',
                    productDuration: '5',
                    productDurationId: 'multiple-product-duration-1',
                },
                {
                    productName: 'Day Ticket',
                    productNameId: 'multiple-product-name-2',
                    productPrice: '2.50',
                    productPriceId: 'multiple-product-price-2',
                    productDuration: '1',
                    productDurationId: 'multiple-product-duration-2',
                },
                {
                    productName: 'Monthly Ticket',
                    productNameId: 'multiple-product-name-3',
                    productPrice: '200',
                    productPriceId: 'multiple-product-price-3',
                    productDuration: '28',
                    productDurationId: 'multiple-product-duration-3',
                },
            ],
        },
        [PRODUCT_DETAILS_ATTRIBUTE]: {
            productName: 'Product A',
            productPrice: '1234',
        },
        [SALES_OFFER_PACKAGES_ATTRIBUTE]: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        ...session,
    };

    const { operatorUuid = defaultUuid } = uuid;

    let cookieString = '';

    cookieString += operator
        ? `${OPERATOR_COOKIE}=${encodeURI(JSON.stringify({ ...operator, uuid: operatorUuid }))};`
        : '';

    cookieString += productName
        ? `${PRODUCT_DETAILS_ATTRIBUTE}=%7B%22productName%22%3A%22${productName}%22%2C%22productPrice%22%3A%22${productPrice}%22%7D;`
        : '';

    cookieString += isLoggedin ? `${ID_TOKEN_COOKIE}=${idToken};` : '';

    cookieString += userCookieValue ? `${USER_COOKIE}=${encodeURI(JSON.stringify(userCookieValue))}` : '';

    const req = mockRequest({
        connection: {
            encrypted: true,
        },
        url,
        headers: {
            host: 'localhost:5000',
            cookie: cookieString,
            origin: 'localhost:5000',
            ...requestHeaders,
        },
        cookies: cookieValues,
        session: { ...defaultSession },
    });

    if (body) {
        req.body = body;
    }

    return { req, res };
};

export const getMockContext = ({
    session,
    cookies = {},
    body = null,
    uuid = {},
    mockWriteHeadFn = jest.fn(),
    mockEndFn = jest.fn(),
    isLoggedin = true,
    url = null,
    query = '',
}: GetMockContextInput = {}): NextPageContextWithSession => {
    const { req, res } = getMockRequestAndResponse({
        session,
        cookieValues: cookies,
        body,
        uuid,
        mockWriteHeadFn,
        mockEndFn,
        requestHeaders: {},
        isLoggedin,
        url,
    });

    const ctx: NextPageContextWithSession = {
        res,
        req,
        pathname: '',
        query,
        AppTree: () => React.createElement('div'),
    };

    return ctx;
};

export const mockMatchingFaresZones: MatchingFareZones = {
    'Acomb Green Lane': {
        name: 'Acomb Green Lane',
        stops: [
            {
                stopName: 'Yoden Way - Chapel Hill Road',
                naptanCode: 'duratdmj',
                atcoCode: '13003521G',
                localityCode: 'E0045956',
                parentLocalityName: '',
                localityName: 'Peterlee',
                indicator: 'W-bound',
                street: 'Yodan Way',
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
                parentLocalityName: '',
                localityName: 'Horden',
                indicator: 'SW-bound',
                street: 'Yoden Way',
            },
        ],
        prices: [
            {
                price: '1.10',
                fareZones: ['Nursery Drive', 'Holl Bank/Beech Ave'],
            },
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
                parentLocalityName: '',
                localityName: 'Peterlee',
                indicator: 'NW-bound',
                street: 'Surtees Road',
            },
        ],
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
    'Blossom Street': {
        name: 'Blossom Street',
        stops: [
            {
                stopName: 'Bus Station',
                naptanCode: 'duratdma',
                atcoCode: '13003519H',
                localityCode: 'E0045956',
                parentLocalityName: '',
                localityName: 'Peterlee',
                indicator: 'H',
                street: 'Bede Way',
            },
        ],
        prices: [
            {
                price: '1.00',
                fareZones: ['Rail Station (York)', 'Piccadilly (York)'],
            },
        ],
    },
    'Piccadilly (York)': {
        name: 'Piccadilly (York)',
        stops: [
            {
                stopName: 'Kell Road',
                naptanCode: 'duraptwp',
                atcoCode: '13003345D',
                localityCode: 'E0010183',
                parentLocalityName: '',
                localityName: 'Horden',
                indicator: 'SE-bound',
                street: 'Kell Road',
            },
        ],
        prices: [],
    },
};

export const mockOutBoundMatchingFaresZones: MatchingFareZones = {
    'Acomb Green Lane': {
        name: 'Acomb Green Lane',
        stops: [
            {
                stopName: 'Yoden Way - Chapel Hill Road',
                naptanCode: 'duratdmj',
                atcoCode: '13003521G',
                localityCode: 'E0045956',
                parentLocalityName: '',
                localityName: 'Peterlee',
                indicator: 'W-bound',
                street: 'Yodan Way',
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

export const zoneStops: Stop[] = [
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

export const selectedFareStages: string[] = [
    '{"stop":{"stopName":"Sophia Street","naptanCode":"durgapwp","atcoCode":"13003661E","localityCode":"E0045957","localityName":"Seaham","parentLocalityName":"IW Test","indicator":"S-bound","street":"Sophia Street"},"stage":"Acomb Green Lane"}',
];

export const service: BasicService = {
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

export const mockMatchingUserFareStagesWithUnassignedStages: UserFareStages = {
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
};

export const mockMatchingUserFareStagesWithAllStagesAssigned: UserFareStages = {
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
            prices: [],
        },
    ],
};

export const expectedSalesOfferPackageArray: SalesOfferPackage[] = [
    {
        name: 'Onboard (cash)',
        description: 'Purchasable on board the bus, with cash, as a paper ticket.',
        purchaseLocations: ['onBoard'],
        paymentMethods: ['cash'],
        ticketFormats: ['paperTicket'],
    },
    {
        name: 'Onboard (contactless)',
        description: 'Purchasable on board the bus, with a contactless card or device, as a paper ticket.',
        purchaseLocations: ['onBoard'],
        paymentMethods: ['contactlessPaymentCard'],
        ticketFormats: ['paperTicket'],
    },
];

export const expectedProductDetailsArray: ProductDetails[] = [
    {
        productName: 'Product',
        productPrice: '2.99',
        productDuration: '1',
        productValidity: '24hr',
        salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
    },
    {
        productName: 'Product Two',
        productPrice: '7.99',
        productDuration: '7',
        productValidity: '24hr',
        salesOfferPackages: [defaultSalesOfferPackageTwo],
    },
];

export const mockTimeRestriction: TimeRestriction = {
    startTime: '0900',
    endTime: '1500',
    validDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
};

export const expectedMatchingJsonSingle: SingleTicket = {
    type: 'single',
    lineName: '215',
    nocCode: 'DCCL',
    passengerType: 'Adult',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
    email: 'test@example.com',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
                    indicator: 'SE-bound',
                    street: 'Kell Road',
                    qualifierName: '',
                },
            ],
            prices: [],
        },
    ],
};

export const expectedMatchingJsonReturnNonCircular: ReturnTicket = {
    type: 'return',
    passengerType: 'Adult',
    lineName: '215',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
    email: 'test@example.com',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
    inboundFareZones: [
        {
            name: 'Acomb Green Lane',
            stops: [
                {
                    stopName: 'Yoden Way - Chapel Hill Road',
                    naptanCode: 'duratdmj',
                    atcoCode: '13003521G',
                    localityCode: 'E0045956',
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
                    localityName: 'Horden',
                    indicator: 'SE-bound',
                    street: 'Kell Road',
                    qualifierName: '',
                },
            ],
            prices: [],
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
                    parentLocalityName: '',
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
    ],
};

export const expectedMatchingJsonReturnCircular: ReturnTicket = {
    type: 'return',
    lineName: '215',
    passengerType: 'Adult',
    nocCode: 'DCCL',
    operatorShortName: 'DCC',
    serviceDescription: 'Worthing - Seaham - Crawley',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    email: 'test@example.com',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
    inboundFareZones: [],
    outboundFareZones: [
        {
            name: 'Acomb Green Lane',
            stops: [
                {
                    stopName: 'Yoden Way - Chapel Hill Road',
                    naptanCode: 'duratdmj',
                    atcoCode: '13003521G',
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
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
                    parentLocalityName: '',
                    localityName: 'Horden',
                    indicator: 'SE-bound',
                    street: 'Kell Road',
                    qualifierName: '',
                },
            ],
            prices: [],
        },
    ],
};

export const expectedSingleProductUploadJsonWithZoneUpload: PeriodGeoZoneTicket = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'TEST',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    email: 'test@example.com',
    zoneName: 'Green Lane Shops',
    stops: zoneStops,
    passengerType: 'Adult',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            productName: 'Product A',
            productPrice: '1234',
            productDuration: '2',
            productValidity: '24hr',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
};

export const expectedSingleProductUploadJsonWithSelectedServices: PeriodMultipleServicesTicket = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'TEST',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    email: 'test@example.com',
    passengerType: 'Adult',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            productName: 'Product A',
            productPrice: '1234',
            productDuration: '2',
            productValidity: '24hr',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
    selectedServices: [
        {
            lineName: '12A',
            serviceCode: 'NW_05_BLAC_12A_1',
            startDate: '13/05/2020',
            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
        },
        {
            lineName: '6',
            serviceCode: 'NW_05_BLAC_6_1',
            startDate: '08/05/2020',
            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
        },
        {
            lineName: '101',
            serviceCode: 'NW_05_BLAC_101_1',
            startDate: '06/05/2020',
            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
        },
    ],
};

export const expectedMultiProductUploadJsonWithZoneUpload: PeriodGeoZoneTicket = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'TEST',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    email: 'test@example.com',
    zoneName: 'fare zone 1',
    stops: zoneStops,
    passengerType: 'Adult',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            productName: 'Weekly Ticket',
            productPrice: '50',
            productDuration: '5',
            productValidity: '24hr',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
        {
            productName: 'Day Ticket',
            productPrice: '2.50',
            productDuration: '1',
            productValidity: '24hr',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
        {
            productName: 'Monthly Ticket',
            productPrice: '200',
            productDuration: '28',
            productValidity: 'endOfCalendarDay',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
};

export const expectedMultiProductUploadJsonWithSelectedServices: PeriodMultipleServicesTicket = {
    operatorName: 'test',
    type: 'period',
    nocCode: 'TEST',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    email: 'test@example.com',
    passengerType: 'Adult',
    timeRestriction: mockTimeRestriction,
    products: [
        {
            productName: 'Weekly Ticket',
            productPrice: '50',
            productDuration: '5',
            productValidity: '24hr',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
        {
            productName: 'Day Ticket',
            productPrice: '2.50',
            productDuration: '1',
            productValidity: '24hr',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
        {
            productName: 'Monthly Ticket',
            productPrice: '200',
            productDuration: '28',
            productValidity: 'endOfCalendarDay',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
    selectedServices: [
        {
            lineName: '12A',
            serviceCode: 'NW_05_BLAC_12A_1',
            startDate: '13/05/2020',
            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
        },
        {
            lineName: '6',
            serviceCode: 'NW_05_BLAC_6_1',
            startDate: '08/05/2020',
            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
        },
        {
            lineName: '101',
            serviceCode: 'NW_05_BLAC_101_1',
            startDate: '06/05/2020',
            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
        },
    ],
};

export const expectedFlatFareProductUploadJson: FlatFareTicket = {
    operatorName: 'test',
    passengerType: 'Adult',
    type: 'flatFare',
    nocCode: 'TEST',
    uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
    email: 'test@example.com',
    products: [
        {
            productName: 'Weekly Rider',
            productPrice: '7',
            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
        },
    ],
    selectedServices: [
        {
            lineName: '12A',
            serviceCode: 'NW_05_BLAC_12A_1',
            startDate: '13/05/2020',
            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
        },
        {
            lineName: '6',
            serviceCode: 'NW_05_BLAC_6_1',
            startDate: '08/05/2020',
            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
        },
        {
            lineName: '101',
            serviceCode: 'NW_05_BLAC_101_1',
            startDate: '06/05/2020',
            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
        },
    ],
};

export const multipleProducts: MultiProduct[] = [
    {
        productName: 'p',
        productNameId: 'product-name-1',
        productNameError: 'Name too short',
        productPrice: '3.50',
        productPriceId: 'product-price-1',
        productDuration: '66.5',
        productDurationId: 'product-duration-1',
        productDurationError: 'Product duration must be a whole number',
    },
    {
        productName: 'Super ticket',
        productNameId: 'product-name-1',
        productPrice: '3.50gg',
        productPriceId: 'product-price-2',
        productPriceError: 'Product price must be a valid price',
        productDuration: '7',
        productDurationId: 'product-duration-2',
    },
];

export const multipleProductsWithoutErrors: MultiProduct[] = [
    {
        productName: 'Best ticket',
        productNameId: 'product-name-1',
        productPrice: '3.50',
        productPriceId: 'product-price-1',
        productDuration: '66',
        productDurationId: 'product-duration-1',
    },
    {
        productName: 'Super ticket',
        productNameId: 'product-name-2',
        productPrice: '3.50',
        productPriceId: 'product-price-2',
        productDuration: '7',
        productDurationId: 'product-duration-2',
    },
];

export const invalidDurationProducts: MultiProduct[] = [
    {
        productName: 'valid duration',
        productNameId: 'multiple-product-name-input-0',
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

export const mockDefinePassengerTypeFieldsets: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-passenger-age-range',
            content: expect.any(String),
        },
        radios: [
            {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-age-range-hint',
                    content: 'Enter a minimum and/or maximum age for this passenger type.',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'age-range-min',
                        name: 'ageRangeMin',
                        label: 'Minimum Age (if applicable)',
                    },
                    {
                        id: 'age-range-max',
                        name: 'ageRangeMax',
                        label: 'Maximum Age (if applicable)',
                    },
                ],
                inputErrors: [],
            },
            {
                id: 'age-range-not-required',
                name: 'ageRange',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
    {
        heading: {
            id: 'define-passenger-proof',
            content: expect.any(String),
        },
        radios: [
            {
                id: 'proof-required',
                name: 'proof',
                value: 'Yes',
                dataAriaControls: 'proof-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-proof-hint',
                    content: 'Select the applicable proof document(s).',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'membership-card',
                        name: 'proofDocuments',
                        label: 'Membership Card',
                    },
                    {
                        id: 'student-card',
                        name: 'proofDocuments',
                        label: 'Student Card',
                    },
                    {
                        id: 'identity-document',
                        name: 'proofDocuments',
                        label: 'Identity Document',
                    },
                ],
                inputErrors: [],
            },
            { id: 'proof-not-required', name: 'proof', value: 'No', label: 'No' },
        ],
        radioError: [],
    },
];

export const mockDefinePassengerTypeFieldsetsWithRadioErrors: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-passenger-age-range',
            content: 'Do child passengers have an age range?',
        },
        radios: [
            {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-age-range-hint',
                    content: 'Enter a minimum and/or maximum age for this passenger type.',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'age-range-min',
                        name: 'ageRangeMin',
                        label: 'Minimum Age (if applicable)',
                    },
                    {
                        id: 'age-range-max',
                        name: 'ageRangeMax',
                        label: 'Maximum Age (if applicable)',
                    },
                ],
                inputErrors: [],
            },
            {
                id: 'age-range-not-required',
                name: 'ageRange',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [
            {
                errorMessage: 'Choose one of the options below',
                id: 'define-passenger-age-range',
            },
        ],
    },
    {
        heading: {
            id: 'define-passenger-proof',
            content: 'Do child passengers require a proof document?',
        },
        radios: [
            {
                id: 'proof-required',
                name: 'proof',
                value: 'Yes',
                dataAriaControls: 'proof-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-proof-hint',
                    content: 'Select the applicable proof document(s).',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'membership-card',
                        name: 'proofDocuments',
                        label: 'Membership Card',
                    },
                    {
                        id: 'student-card',
                        name: 'proofDocuments',
                        label: 'Student Card',
                    },
                    {
                        id: 'identity-document',
                        name: 'proofDocuments',
                        label: 'Identity Document',
                    },
                ],
                inputErrors: [],
            },
            { id: 'proof-not-required', name: 'proof', value: 'No', label: 'No' },
        ],
        radioError: [
            {
                errorMessage: 'Choose one of the options below',
                id: 'define-passenger-proof',
            },
        ],
    },
];

export const mockCombinedErrorInfoForRadioErrors: ErrorInfo[] = [
    {
        errorMessage: 'Choose one of the options below',
        id: 'define-passenger-age-range',
    },
    {
        errorMessage: 'Choose one of the options below',
        id: 'define-passenger-proof',
    },
];

export const mockDefinePassengerTypeFieldsetsWithInputErrors: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-passenger-age-range',
            content: 'Do child passengers have an age range?',
        },
        radios: [
            {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-age-range-hint',
                    content: 'Enter a minimum and/or maximum age for this passenger type.',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'age-range-min',
                        name: 'ageRangeMin',
                        label: 'Minimum Age (if applicable)',
                    },
                    {
                        id: 'age-range-max',
                        name: 'ageRangeMax',
                        label: 'Maximum Age (if applicable)',
                    },
                ],
                inputErrors: [
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'age-range-min',
                    },
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'age-range-max',
                    },
                ],
            },
            {
                id: 'age-range-not-required',
                name: 'ageRange',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
    {
        heading: {
            id: 'define-passenger-proof',
            content: 'Do child passengers require a proof document?',
        },
        radios: [
            {
                id: 'proof-required',
                name: 'proof',
                value: 'Yes',
                dataAriaControls: 'proof-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-proof-hint',
                    content: 'Select the applicable proof document(s).',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'membership-card',
                        name: 'proofDocuments',
                        label: 'Membership Card',
                    },
                    {
                        id: 'student-card',
                        name: 'proofDocuments',
                        label: 'Student Card',
                    },
                    {
                        id: 'identity-document',
                        name: 'proofDocuments',
                        label: 'Identity Document',
                    },
                ],
                inputErrors: [
                    {
                        errorMessage: 'Select at least one proof document',
                        id: 'proof-required',
                        userInput: '',
                    },
                ],
            },
            { id: 'proof-not-required', name: 'proof', value: 'No', label: 'No' },
        ],
        radioError: [],
    },
];

export const mockPassengerTypeInputErrors: ErrorInfo[] = [
    {
        errorMessage: 'Enter a minimum or maximum age',
        id: 'define-passenger-age-range',
    },
    {
        errorMessage: 'Enter a minimum or maximum age',
        id: 'define-passenger-age-range',
    },
    {
        errorMessage: 'Select at least one proof document',
        id: 'define-passenger-proof',
    },
];

export const mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-passenger-age-range',
            content: expect.any(String),
        },
        radios: [
            {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-age-range-hint',
                    content: 'Enter a minimum and/or maximum age for this passenger type.',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'age-range-min',
                        name: 'ageRangeMin',
                        label: 'Minimum Age (if applicable)',
                    },
                    {
                        id: 'age-range-max',
                        name: 'ageRangeMax',
                        label: 'Maximum Age (if applicable)',
                    },
                ],
                inputErrors: [
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'age-range-min',
                    },
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'age-range-max',
                    },
                ],
            },
            {
                id: 'age-range-not-required',
                name: 'ageRange',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
    {
        heading: {
            id: 'define-passenger-proof',
            content: expect.any(String),
        },
        radios: [
            {
                id: 'proof-required',
                name: 'proof',
                value: 'Yes',
                dataAriaControls: 'proof-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-passenger-proof-hint',
                    content: 'Select the applicable proof document(s).',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'membership-card',
                        name: 'proofDocuments',
                        label: 'Membership Card',
                    },
                    {
                        id: 'student-card',
                        name: 'proofDocuments',
                        label: 'Student Card',
                    },
                    {
                        id: 'identity-document',
                        name: 'proofDocuments',
                        label: 'Identity Document',
                    },
                ],
                inputErrors: [],
            },
            { id: 'proof-not-required', name: 'proof', value: 'No', label: 'No' },
        ],
        radioError: [
            {
                errorMessage: 'Choose one of the options below',
                id: 'define-passenger-proof',
            },
        ],
    },
];

export const mockPassengerTypeRadioAndInputErrors: ErrorInfo[] = [
    {
        userInput: '',
        errorMessage: 'Choose one of the options below',
        id: 'define-passenger-proof',
    },
    {
        userInput: '',
        errorMessage: 'Enter a minimum or maximum age',
        id: 'age-range-min',
    },
    {
        userInput: '',
        errorMessage: 'Enter a minimum or maximum age',
        id: 'age-range-max',
    },
];

export const mockNumberOfPassengerTypeFieldset: TextInputFieldset = {
    heading: {
        id: 'number-of-passenger-type-heading',
        content: 'How many child passengers can be in the group?',
    },
    inputs: [
        {
            id: 'min-number-of-passengers',
            name: 'minNumber',
            label: 'Minimum (optional)',
        },
        {
            id: 'max-number-of-passengers',
            name: 'maxNumber',
            label: 'Maximum (required)',
        },
    ],
    inputErrors: [],
};

export const mockNumberOfPassengerTypeFieldsetWithErrors: TextInputFieldset = {
    heading: {
        id: 'number-of-passenger-type-heading',
        content: 'How many child passengers can be in the group?',
    },
    inputs: [
        {
            id: 'min-number-of-passengers',
            name: 'minNumber',
            label: 'Minimum (optional)',
        },
        {
            id: 'max-number-of-passengers',
            name: 'maxNumber',
            label: 'Maximum (required)',
        },
    ],
    inputErrors: [
        {
            id: 'min-number-of-passengers',
            errorMessage: 'Enter a number between 1 and 30',
        },
        {
            id: 'max-number-of-passengers',
            errorMessage: 'Enter a number between 1 and 30',
        },
    ],
};

export const mockDefineTimeRestrictionsFieldsets: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-time-restrictions',
            content: 'Is there a start time or an end time to this ticket?',
        },
        radios: [
            {
                id: 'time-restriction-required',
                name: 'timeRestriction',
                value: 'Yes',
                dataAriaControls: 'time-restriction-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-time-restriction-hint',
                    content: 'Enter a time in 24 hour format. Example 0900 or 2300',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'start-time',
                        name: 'startTime',
                        label: 'Start Time (required)',
                    },
                    {
                        id: 'end-time',
                        name: 'endTime',
                        label: 'End Time (required)',
                    },
                ],
                inputErrors: [],
            },
            {
                id: 'time-restriction-not-required',
                name: 'timeRestriction',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
    {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days?',
        },
        radios: [
            {
                id: 'valid-days-required',
                name: 'validDaysSelected',
                value: 'Yes',
                dataAriaControls: 'valid-days-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-valid-days-hint',
                    content: 'Select the days of the week the ticket is valid for',
                },
                inputType: 'checkbox',
                inputs: [
                    { id: 'monday', name: 'validDays', label: 'Monday' },
                    { id: 'tuesday', name: 'validDays', label: 'Tuesday' },
                    { id: 'wednesday', name: 'validDays', label: 'Wednesday' },
                    { id: 'thursday', name: 'validDays', label: 'Thursday' },
                    { id: 'friday', name: 'validDays', label: 'Friday' },
                    { id: 'saturday', name: 'validDays', label: 'Saturday' },
                    { id: 'sunday', name: 'validDays', label: 'Sunday' },
                ],
                inputErrors: [],
            },
            {
                id: 'valid-days-not-required',
                name: 'validDaysSelected',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
];

export const mockDefineTimeRestrictionsFieldsetsWithRadioErrors: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-time-restrictions',
            content: 'Is there a start time or an end time to this ticket?',
        },
        radios: [
            {
                id: 'time-restriction-required',
                name: 'timeRestriction',
                value: 'Yes',
                dataAriaControls: 'time-restriction-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-time-restriction-hint',
                    content: 'Enter a time in 24 hour format. Example 0900 or 2300',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'start-time',
                        name: 'startTime',
                        label: 'Start Time (required)',
                    },
                    {
                        id: 'end-time',
                        name: 'endTime',
                        label: 'End Time (required)',
                    },
                ],
                inputErrors: [],
            },
            {
                id: 'time-restriction-not-required',
                name: 'timeRestriction',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [
            {
                id: 'define-time-restrictions',
                errorMessage: 'Choose one of the options below',
            },
        ],
    },
    {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days?',
        },
        radios: [
            {
                id: 'valid-days-required',
                name: 'validDaysSelected',
                value: 'Yes',
                dataAriaControls: 'valid-days-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-valid-days-hint',
                    content: 'Select the days of the week the ticket is valid for',
                },
                inputType: 'checkbox',
                inputs: [
                    { id: 'monday', name: 'validDays', label: 'Monday' },
                    { id: 'tuesday', name: 'validDays', label: 'Tuesday' },
                    { id: 'wednesday', name: 'validDays', label: 'Wednesday' },
                    { id: 'thursday', name: 'validDays', label: 'Thursday' },
                    { id: 'friday', name: 'validDays', label: 'Friday' },
                    { id: 'saturday', name: 'validDays', label: 'Saturday' },
                    { id: 'sunday', name: 'validDays', label: 'Sunday' },
                ],
                inputErrors: [],
            },
            {
                id: 'valid-days-not-required',
                name: 'validDaysSelected',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [
            {
                id: 'define-valid-days',
                errorMessage: 'Choose one of the options below',
            },
        ],
    },
];

export const mockTimeRestrictionsRadioErrors: ErrorInfo[] = [
    {
        id: 'define-time-restrictions',
        errorMessage: 'Choose one of the options below',
    },
    {
        id: 'define-valid-days',
        errorMessage: 'Choose one of the options below',
    },
];

export const mockDefineTimeRestrictionsFieldsetsWithInputErrors: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-time-restrictions',
            content: 'Is there a start time or an end time to this ticket?',
        },
        radios: [
            {
                id: 'time-restriction-required',
                name: 'timeRestriction',
                value: 'Yes',
                dataAriaControls: 'time-restriction-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-time-restriction-hint',
                    content: 'Enter a time in 24 hour format. Example 0900 or 2300',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'start-time',
                        name: 'startTime',
                        label: 'Start Time (required)',
                    },
                    {
                        id: 'end-time',
                        name: 'endTime',
                        label: 'End Time (required)',
                    },
                ],
                inputErrors: [
                    {
                        id: 'start-time',
                        errorMessage: 'Enter a start time in a valid 24 hour format between 0000 - 2300',
                    },
                    {
                        id: 'end-time',
                        errorMessage: 'Enter an end time in a valid 24 hour format between 0000 - 2300',
                    },
                ],
            },
            {
                id: 'time-restriction-not-required',
                name: 'timeRestriction',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
    {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days?',
        },
        radios: [
            {
                id: 'valid-days-required',
                name: 'validDaysSelected',
                value: 'Yes',
                dataAriaControls: 'valid-days-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-valid-days-hint',
                    content: 'Select the days of the week the ticket is valid for',
                },
                inputType: 'checkbox',
                inputs: [
                    { id: 'monday', name: 'validDays', label: 'Monday' },
                    { id: 'tuesday', name: 'validDays', label: 'Tuesday' },
                    { id: 'wednesday', name: 'validDays', label: 'Wednesday' },
                    { id: 'thursday', name: 'validDays', label: 'Thursday' },
                    { id: 'friday', name: 'validDays', label: 'Friday' },
                    { id: 'saturday', name: 'validDays', label: 'Saturday' },
                    { id: 'sunday', name: 'validDays', label: 'Sunday' },
                ],
                inputErrors: [
                    {
                        id: 'valid-days-required',
                        errorMessage: 'Select at least one day',
                    },
                ],
            },
            {
                id: 'valid-days-not-required',
                name: 'validDaysSelected',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
];

export const mockTimeRestrictionsInputErrors: ErrorInfo[] = [
    {
        id: 'start-time',
        errorMessage: 'Enter a start time in a valid 24 hour format between 0000 - 2300',
        userInput: undefined,
    },
    {
        id: 'end-time',
        errorMessage: 'Enter an end time in a valid 24 hour format between 0000 - 2300',
        userInput: undefined,
    },
    {
        id: 'valid-days-required',
        errorMessage: 'Select at least one day',
        userInput: undefined,
    },
];

export const mockDefineTimeRestrictionsFieldsetsWithRadioAndInputErrors: RadioConditionalInputFieldset[] = [
    {
        heading: {
            id: 'define-time-restrictions',
            content: 'Is there a start time or an end time to this ticket?',
        },
        radios: [
            {
                id: 'time-restriction-required',
                name: 'timeRestriction',
                value: 'Yes',
                dataAriaControls: 'time-restriction-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-time-restriction-hint',
                    content: 'Enter a time in 24 hour format. Example 0900 or 2300',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'start-time',
                        name: 'startTime',
                        label: 'Start Time (required)',
                    },
                    {
                        id: 'end-time',
                        name: 'endTime',
                        label: 'End Time (required)',
                    },
                ],
                inputErrors: [
                    {
                        id: 'start-time',
                        errorMessage: 'Enter a start time in a valid 24 hour format between 0000 - 2300',
                    },
                    {
                        id: 'end-time',
                        errorMessage: 'Enter an end time in a valid 24 hour format between 0000 - 2300',
                    },
                ],
            },
            {
                id: 'time-restriction-not-required',
                name: 'timeRestriction',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [],
    },
    {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days?',
        },
        radios: [
            {
                id: 'valid-days-required',
                name: 'validDaysSelected',
                value: 'Yes',
                dataAriaControls: 'valid-days-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-valid-days-hint',
                    content: 'Select the days of the week the ticket is valid for',
                },
                inputType: 'checkbox',
                inputs: [
                    { id: 'monday', name: 'validDays', label: 'Monday' },
                    { id: 'tuesday', name: 'validDays', label: 'Tuesday' },
                    { id: 'wednesday', name: 'validDays', label: 'Wednesday' },
                    { id: 'thursday', name: 'validDays', label: 'Thursday' },
                    { id: 'friday', name: 'validDays', label: 'Friday' },
                    { id: 'saturday', name: 'validDays', label: 'Saturday' },
                    { id: 'sunday', name: 'validDays', label: 'Sunday' },
                ],
                inputErrors: [],
            },
            {
                id: 'valid-days-not-required',
                name: 'validDaysSelected',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: [
            {
                id: 'define-valid-days',
                errorMessage: 'Choose one of the options below',
            },
        ],
    },
];

export const mockTimeRestrictionsRadioAndInputErrors: ErrorInfo[] = [
    {
        id: 'define-valid-days',
        errorMessage: 'Choose one of the options below',
        userInput: undefined,
    },
    {
        id: 'start-time',
        errorMessage: 'Enter a start time in a valid 24 hour format between 0000 - 2300',
        userInput: undefined,
    },
    {
        id: 'end-time',
        errorMessage: 'Enter an end time in a valid 24 hour format between 0000 - 2300',
        userInput: undefined,
    },
];

export const mockBreadCrumbList: Breadcrumb[] = [
    { name: 'Home', link: '/', show: true },
    { name: 'Select Fare Type', link: '/fareType', show: true },
    { name: 'Select Passenger Type', link: '/passengerType', show: true },
    { name: 'Select Service', link: '/service', show: true },
];

export const mockFromHomeBreadcrumbs: Breadcrumb[] = [];

export const mockSingleAdultCsvUploadFromMatchingBreadcrumbs: Breadcrumb[] = [
    {
        name: 'Home',
        link: '/home',
        show: true,
    },
    {
        name: 'Fare type',
        link: '/fareType',
        show: true,
    },
    {
        name: 'Passenger type',
        link: '/passengerType',
        show: true,
    },
    {
        name: 'Passenger type details',
        link: '/definePassengerType',
        show: true,
    },
    {
        name: 'Time restrictions',
        link: '/timeRestrictions',
        show: true,
    },
    {
        name: 'Service',
        link: '/service',
        show: true,
    },
    {
        name: 'Direction',
        link: '/singleDirection',
        show: true,
    },
    {
        name: 'Input method',
        link: '/inputMethod',
        show: true,
    },
    {
        name: 'Upload CSV',
        link: '/csvUpload',
        show: true,
    },
    {
        name: 'Match stops',
        link: '/matching',
        show: true,
    },
];

export const mockReturnAnyoneManualFromOutboundMatchingBreadcrumbs: Breadcrumb[] = [
    {
        name: 'Home',
        link: '/home',
        show: true,
    },
    {
        name: 'Fare type',
        link: '/fareType',
        show: true,
    },
    {
        name: 'Passenger type',
        link: '/passengerType',
        show: true,
    },
    {
        name: 'Time restrictions',
        link: '/timeRestrictions',
        show: true,
    },
    {
        name: 'Service',
        link: '/service',
        show: true,
    },
    {
        name: 'Direction',
        link: '/returnDirection',
        show: true,
    },
    {
        name: 'Input method',
        link: '/inputMethod',
        show: true,
    },
    {
        name: 'Stage count check',
        link: '/howManyStages',
        show: true,
    },
    {
        name: 'Number of stages',
        link: '/chooseStages',
        show: true,
    },
    {
        name: 'Stage names',
        link: '/stageNames',
        show: true,
    },
    {
        name: 'Stage prices',
        link: '/priceEntry',
        show: true,
    },
    {
        name: 'Outbound stops',
        link: '/outboundMatching',
        show: true,
    },
];

export const mockPeriodGeoZoneSeniorFromCsvZoneUploadBreadcrumbs: Breadcrumb[] = [
    {
        name: 'Home',
        link: '/home',
        show: true,
    },
    {
        name: 'Fare type',
        link: '/fareType',
        show: true,
    },
    {
        name: 'Passenger type',
        link: '/passengerType',
        show: true,
    },
    {
        name: 'Passenger type details',
        link: '/definePassengerType',
        show: true,
    },
    {
        name: 'Time restrictions',
        link: '/timeRestrictions',
        show: true,
    },
    {
        name: 'Period type',
        link: '/periodType',
        show: true,
    },
    {
        name: 'Upload CSV',
        link: '/csvZoneUpload',
        show: true,
    },
];

export const mockFlatFareStudentFromDefinePassengerTypeBreadcrumbs: Breadcrumb[] = [
    {
        name: 'Home',
        link: '/home',
        show: true,
    },
    {
        name: 'Fare type',
        link: '/fareType',
        show: true,
    },
    {
        name: 'Passenger type',
        link: '/passengerType',
        show: true,
    },
    {
        name: 'Passenger type details',
        link: '/definePassengerType',
        show: true,
    },
];

export const mockMultiServicesAnyoneFromMultipleProductValidityBreadcrumbs: Breadcrumb[] = [
    {
        name: 'Home',
        link: '/home',
        show: true,
    },
    {
        name: 'Fare type',
        link: '/fareType',
        show: true,
    },
    {
        name: 'Passenger type',
        link: '/passengerType',
        show: true,
    },
    {
        name: 'Time restrictions',
        link: '/timeRestrictions',
        show: true,
    },
    {
        name: 'Period type',
        link: '/periodType',
        show: true,
    },
    {
        name: 'Services',
        link: '/serviceList',
        show: true,
    },
    {
        name: 'Number of products',
        link: '/howManyProducts',
        show: true,
    },
    {
        name: 'Product details',
        link: '/multipleProducts',
        show: true,
    },
    {
        name: 'Product period validity',
        link: '/multipleProductValidity',
        show: true,
    },
];

export const mockMultiServicesAnyoneFromPeriodValidityBreadcrumbs: Breadcrumb[] = [
    {
        name: 'Home',
        link: '/home',
        show: true,
    },
    {
        name: 'Fare type',
        link: '/fareType',
        show: true,
    },
    {
        name: 'Passenger type',
        link: '/passengerType',
        show: true,
    },
    {
        name: 'Time restrictions',
        link: '/timeRestrictions',
        show: true,
    },
    {
        name: 'Time restrictions details',
        link: '/defineTimeRestrictions',
        show: true,
    },
    {
        name: 'Period type',
        link: '/periodType',
        show: true,
    },
    {
        name: 'Services',
        link: '/serviceList',
        show: true,
    },
    {
        name: 'Number of products',
        link: '/howManyProducts',
        show: true,
    },
    {
        name: 'Product details',
        link: '/productDetails',
        show: true,
    },
    {
        name: 'Days valid',
        link: '/chooseValidity',
        show: true,
    },
    {
        name: 'Product period validity',
        link: '/periodValidity',
        show: true,
    },
];
