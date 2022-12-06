import { shallow } from 'enzyme';
import * as React from 'react';
import {
    CARNET_PRODUCT_DETAILS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
    DIRECTION_ATTRIBUTE,
} from '../../src/constants/attributes';
import { ConfirmationElement, MultiOperatorInfo, Operator } from '../../src/interfaces';
import TicketConfirmation, {
    buildFlatFareTicketConfirmationElements,
    buildMatchedFareStages,
    buildPeriodOrMultiOpTicketConfirmationElements,
    buildReturnTicketConfirmationElements,
    buildSchoolTicketConfirmationElements,
    buildSingleTicketConfirmationElements,
    buildTicketConfirmationElements,
    getServerSideProps,
    MatchedFareStages,
} from '../../src/pages/ticketConfirmation';

import { getMockContext, mockMatchingFaresZones, service, userFareStages } from '../testData/mockData';

describe('pages', () => {
    const confirmationElementStructure: ConfirmationElement = {
        name: expect.any(String),
        content: expect.any(String),
        href: expect.any(String),
    };

    describe('ticketConfirmation', () => {
        describe('buildMatchedFareStages', () => {
            it('should return matched fare stages for a selection of matching fare zones', () => {
                const mockMatchedFareStageStructure: MatchedFareStages = {
                    fareStage: expect.any(String),
                    stops: expect.arrayContaining([expect.any(String)]),
                };
                const matchedFareStages = buildMatchedFareStages(mockMatchingFaresZones);
                expect(matchedFareStages).toContainEqual(mockMatchedFareStageStructure);
            });
        });

        describe('buildSingleTicketConfirmationElements', () => {
            it('should build confirmation elements for a single ticket', () => {
                const ctx = getMockContext({
                    session: {
                        [MATCHING_ATTRIBUTE]: {
                            service,
                            userFareStages,
                            matchingFareZones: mockMatchingFaresZones,
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const expectedConfirmationElementsLength = 3 + Object.entries(mockMatchingFaresZones).length;
                const confirmationElements = buildSingleTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(expectedConfirmationElementsLength);
            });
        });

        describe('buildReturnTicketConfirmationElements', () => {
            it('should build confirmation elements for a non-circular return ticket', () => {
                const ctx = getMockContext({
                    session: {
                        [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
                        [MATCHING_ATTRIBUTE]: {
                            service,
                            userFareStages,
                            matchingFareZones: mockMatchingFaresZones,
                        },
                        [INBOUND_MATCHING_ATTRIBUTE]: {
                            inboundUserFareStages: userFareStages,
                            inboundMatchingFareZones: mockMatchingFaresZones,
                        },
                        [RETURN_VALIDITY_ATTRIBUTE]: {
                            amount: '5',
                            typeOfDuration: 'day',
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                        [DIRECTION_ATTRIBUTE]: {
                            direction: 'outbound',
                            inboundDirection: 'inbound',
                        },
                    },
                });
                const totalNumberOfMatchingFareZones = Object.entries(mockMatchingFaresZones).length * 2;
                const totalExpectedLength = 3 + totalNumberOfMatchingFareZones;
                const confirmationElements = buildReturnTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });

            it('should build confirmation elements for a circular return ticket', () => {
                const ctx = getMockContext({
                    session: {
                        [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
                        [MATCHING_ATTRIBUTE]: {
                            service,
                            userFareStages,
                            matchingFareZones: mockMatchingFaresZones,
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                        [DIRECTION_ATTRIBUTE]: {
                            direction: 'outbound',
                        },
                    },
                });
                const totalNumberOfMatchingFareZones = Object.entries(mockMatchingFaresZones).length;
                const totalExpectedLength = 2 + totalNumberOfMatchingFareZones;
                const confirmationElements = buildReturnTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });
        });

        describe('buildPeriodOrMultiOpTicketConfirmationElements', () => {
            const mockSingleProduct = [
                {
                    productName: 'Weekly Ticket',
                    productPrice: '50',
                    productDuration: '5',
                    productDurationUnits: 'weeks',
                },
            ];
            const mockPeriodExpiry = { productValidity: '24hr', productEndTime: '' };
            const mockAdditionalOperators: Operator[] = [
                { nocCode: 'BLAC', name: expect.any(String) },
                { nocCode: 'MCT', name: expect.any(String) },
            ];
            const mockAdditionalOperatorsServices: MultiOperatorInfo[] = [
                {
                    nocCode: 'BLAC',
                    services: [
                        {
                            lineName: '237',
                            lineId: 'strfg323',
                            serviceCode: '11-237-_-y08-1',
                            startDate: '07/04/2020',
                            serviceDescription: 'Ashton Under Lyne - Glossop',
                            origin: 'Ashton Under Lyne',
                            destination: 'Glossop',
                        },
                        {
                            lineName: '391',
                            lineId: 'strfg323',
                            serviceCode: 'NW_01_MCT_391_1',
                            startDate: '23/04/2019',
                            serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                            origin: 'Macclesfield - Bollington',
                            destination: 'Stockport',
                        },
                        {
                            lineName: '232',
                            lineId: 'strfg323',
                            serviceCode: 'NW_04_MCTR_232_1',
                            startDate: '06/04/2020',
                            serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                            origin: 'Ashton',
                            destination: 'Broadoak Circular',
                        },
                    ],
                    selectedServices: [],
                    name: 'Blackpool Transport',
                },
                {
                    nocCode: 'MCT',
                    services: [
                        {
                            lineId: '3h3vb32ik',
                            lineName: '12A',
                            serviceCode: 'NW_05_BLAC_12A_1',
                            serviceDescription: 'Infinity Works, Leeds - Infinity Works, Manchester',
                            startDate: '13/05/2020',
                            origin: 'Infinity Works, Leeds',
                            destination: 'Infinity Works, Manchester',
                        },
                        {
                            lineName: '6',
                            lineId: '3h3vb32ik',
                            serviceCode: 'NW_05_BLAC_6_1',
                            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
                            startDate: '08/05/2020',
                            origin: 'Infinity Works, Edinburgh',
                            destination: 'Infinity Works, London',
                        },
                        {
                            lineId: '3h3v22ik',
                            lineName: '101',
                            serviceCode: 'NW_05_BLAC_101_1',
                            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
                            startDate: '06/05/2020',
                            origin: 'Infinity Works, Boston',
                            destination: 'Infinity Works, Berlin',
                        },
                    ],
                    selectedServices: [],
                    name: 'Manchester Transport',
                },
            ];

            it('should build confirmation elements for a period geoZone ticket with multiple products', () => {
                const ctx = getMockContext({
                    session: {
                        [SERVICE_LIST_ATTRIBUTE]: undefined,
                        [PERIOD_EXPIRY_ATTRIBUTE]: {
                            productValidity: '24hr',
                            productEndTime: '',
                        },
                    },
                });
                const numberOfElementsDueToProducts = ctx.req.session[MULTIPLE_PRODUCT_ATTRIBUTE].products.length;
                const totalExpectedLength = 2 + numberOfElementsDueToProducts;
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });

            it('should build confirmation elements for a multi operator geoZone ticket with a single product', () => {
                const ctx = getMockContext({
                    session: {
                        [SERVICE_LIST_ATTRIBUTE]: undefined,
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: 1,
                        [PERIOD_EXPIRY_ATTRIBUTE]: mockPeriodExpiry,
                        [CARNET_PRODUCT_DETAILS_ATTRIBUTE]: {
                            products: mockSingleProduct,
                        },
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: mockAdditionalOperators,
                        },
                    },
                });
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(6);
            });

            it('should build confirmation elements for a period multiService ticket with a single product', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: 1,
                        [PERIOD_EXPIRY_ATTRIBUTE]: mockPeriodExpiry,
                        [CARNET_PRODUCT_DETAILS_ATTRIBUTE]: {
                            products: mockSingleProduct,
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(6);
            });

            it('should build confirmation elements for a period hybrid ticket with a single product', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'hybrid' },
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: 1,
                        [PERIOD_EXPIRY_ATTRIBUTE]: mockPeriodExpiry,
                        [CARNET_PRODUCT_DETAILS_ATTRIBUTE]: {
                            products: mockSingleProduct,
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(7);
            });

            it('should build confirmation elements for a multi operator multiService ticket with multiple products', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: mockAdditionalOperators,
                        },
                        [PERIOD_EXPIRY_ATTRIBUTE]: {
                            productValidity: '24hr',
                            productEndTime: '',
                        },
                        [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: mockAdditionalOperatorsServices,
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const numberOfElementsDueToProducts = ctx.req.session[MULTIPLE_PRODUCT_ATTRIBUTE].products.length;
                const numberOfElementsDueToAdditionalOperators = mockAdditionalOperators.length;
                const totalExpectedLength =
                    4 + numberOfElementsDueToProducts + numberOfElementsDueToAdditionalOperators;
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });
        });

        describe('buildFlatFareTicketConfirmationElements', () => {
            it('should build confirmation elements for a flat fare ticket', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: undefined,
                        [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                            products: [
                                {
                                    productName: 'Some Product',
                                    productPrice: '12',
                                },
                            ],
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const totalExpectedLength = 3;
                const confirmationElements = buildFlatFareTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });

            it('should build confirmation elements for a flat fare geo zone ticket', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'geoZone' },
                        [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                            products: [
                                {
                                    productName: 'Some Product',
                                    productPrice: '12',
                                },
                            ],
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const confirmationElements = buildFlatFareTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(2);
            });
        });

        describe('buildSchoolTicketConfirmationElements', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });

            it('should throw an error when the fare type is not an expected type', () => {
                const ctx = getMockContext({
                    session: {
                        [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'not a real fare type' },
                    },
                });
                expect(() => buildSchoolTicketConfirmationElements(ctx)).toThrowError(
                    'Did not receive an expected schoolFareType.',
                );
            });
        });

        describe('buildTicketConfirmationElements', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });

            it('should throw an error when the fare type is not an expected type', () => {
                const ctx = getMockContext();
                expect(() => buildTicketConfirmationElements('not a real fare type', ctx)).toThrowError(
                    'Did not receive an expected fareType.',
                );
            });
        });

        describe('getServerSideProps', () => {
            it('should throw an error if the fare type is not an expected type', () => {
                const ctx = getMockContext({
                    session: {
                        [FARE_TYPE_ATTRIBUTE]: { fareType: 'not a real fare type' },
                    },
                });
                expect(() => getServerSideProps(ctx)).toThrowError('Did not receive an expected fareType');
            });
        });

        it('should render correctly for single tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    confirmationElements={[
                        { name: 'Service', content: 'X01', href: 'service' },
                        {
                            name: 'Fare Triangle',
                            content: 'You submitted or created a fare triangle',
                            href: 'inputMethod',
                        },
                        {
                            name: 'Fare Stage - Acomb Green Lane',
                            content: 'Stops - Yoden Way - Chapel Hill Road',
                            href: 'matching',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for return tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    confirmationElements={[
                        { name: 'Service', content: 'X01', href: 'service' },
                        {
                            name: 'Outbound Fare Stage - Acomb Green Lane',
                            content: 'Stops - Yoden Way - Chapel Hill Road',
                            href: 'outboundMatching',
                        },
                        {
                            name: 'Inbound Fare Stage - Acomb Green Lane',
                            content: 'Stops - Yoden Way - Chapel Hill Road',
                            href: 'inboundMatching',
                        },
                        {
                            name: 'Return Validity',
                            content: '5 day',
                            href: 'returnValidity',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for period and multiOperator tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    confirmationElements={[
                        { name: 'Services', content: '12A, 6, 101', href: 'serviceList' },
                        {
                            name: 'Product - Weekly Ticket',
                            content: 'Price - £50',
                            href: 'productDetails',
                        },
                        {
                            name: 'Product - Weekly Ticket',
                            content: 'Duration - 5 weekss',
                            href: 'chooseValidity',
                        },
                        {
                            name: 'Product - Weekly Ticket',
                            content: 'Validity - 24 Hr',
                            href: 'periodValidity',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly for flat fare tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    confirmationElements={[
                        { name: 'Services', content: '12A, 6, 101', href: 'serviceList' },
                        {
                            name: 'Product - Some Product',
                            content: 'Price - £12',
                            href: 'productDetails',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
