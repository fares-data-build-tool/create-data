import * as React from 'react';
import { shallow } from 'enzyme';
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
    TicketConfirmationProps,
} from '../../src/pages/ticketConfirmation';
import * as ticketConfirmation from '../../src/pages/ticketConfirmation';
import { getMockContext, mockMatchingFaresZones, service, userFareStages } from '../testData/mockData';
import {
    FARE_TYPE_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    JOURNEY_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../src/constants/attributes';
import { ConfirmationElement, MultiOperatorInfo, Operator } from '../../src/interfaces';

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
                        [JOURNEY_ATTRIBUTE]: {
                            inboundJourney: '2590B0080#250014868',
                            outboundJourney: '250014868#2590B0080',
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
                        [JOURNEY_ATTRIBUTE]: { directionJourneyPattern: '0690WNA02857#0690WNA02856' },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
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
                    productValidity: '24hr',
                    productDurationUnits: 'weeks',
                },
            ];
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
                        },
                        {
                            lineName: '391',
                            lineId: 'strfg323',
                            serviceCode: 'NW_01_MCT_391_1',
                            startDate: '23/04/2019',
                            serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                        },
                        {
                            lineName: '232',
                            lineId: 'strfg323',
                            serviceCode: 'NW_04_MCTR_232_1',
                            startDate: '06/04/2020',
                            serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                        },
                    ],
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
                        },
                        {
                            lineName: '6',
                            lineId: '3h3vb32ik',
                            serviceCode: 'NW_05_BLAC_6_1',
                            serviceDescription: 'Infinity Works, Edinburgh - Infinity Works, London',
                            startDate: '08/05/2020',
                        },
                        {
                            lineId: '3h3v22ik',
                            lineName: '101',
                            serviceCode: 'NW_05_BLAC_101_1',
                            serviceDescription: 'Infinity Works, Boston - Infinity Works, Berlin',
                            startDate: '06/05/2020',
                        },
                    ],
                },
            ];

            it('should build confirmation elements for a period geoZone ticket with multiple products', () => {
                const ctx = getMockContext({
                    session: {
                        [SERVICE_LIST_ATTRIBUTE]: undefined,
                    },
                });
                const numberOfElementsDueToProducts = ctx.req.session[MULTIPLE_PRODUCT_ATTRIBUTE].products.length * 3;
                const totalExpectedLength = 1 + numberOfElementsDueToProducts;
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });

            it('should build confirmation elements for a multi operator geoZone ticket with a single product', () => {
                const ctx = getMockContext({
                    session: {
                        [SERVICE_LIST_ATTRIBUTE]: undefined,
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: 1,
                        [PERIOD_EXPIRY_ATTRIBUTE]: {
                            products: mockSingleProduct,
                        },
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: mockAdditionalOperators,
                        },
                    },
                });
                const numberOfElementsDueToProducts = mockSingleProduct.length * 3;
                const totalExpectedLength = 2 + numberOfElementsDueToProducts;
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });

            it('should build confirmation elements for a period multiService ticket with a single product', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
                        [NUMBER_OF_PRODUCTS_ATTRIBUTE]: 1,
                        [PERIOD_EXPIRY_ATTRIBUTE]: {
                            products: mockSingleProduct,
                        },
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const numberOfElementsDueToProducts = mockSingleProduct.length * 3;
                const totalExpectedLength = 2 + numberOfElementsDueToProducts;
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });

            it('should build confirmation elements for a multi operator multiService ticket with multiple products', () => {
                const ctx = getMockContext({
                    session: {
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                            selectedOperators: mockAdditionalOperators,
                        },
                        [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: mockAdditionalOperatorsServices,
                        [TXC_SOURCE_ATTRIBUTE]: {
                            source: 'bods',
                            hasBods: true,
                            hasTnds: true,
                        },
                    },
                });
                const numberOfElementsDueToProducts = ctx.req.session[MULTIPLE_PRODUCT_ATTRIBUTE].products.length * 3;
                const numberOfElementsDueToAdditionalOperators = mockAdditionalOperators.length;
                const totalExpectedLength =
                    3 + numberOfElementsDueToProducts + numberOfElementsDueToAdditionalOperators;
                const confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });
        });

        describe('buildFlatFareTicketConfirmationElements', () => {
            it('should build confirmation elements for a flat fare ticket', () => {
                const ctx = getMockContext({
                    session: {
                        [PRODUCT_DETAILS_ATTRIBUTE]: {
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
                const totalExpectedLength = 11;
                const confirmationElements = buildFlatFareTicketConfirmationElements(ctx);
                expect(confirmationElements).toContainEqual(confirmationElementStructure);
                expect(confirmationElements).toHaveLength(totalExpectedLength);
            });
        });

        describe('buildSchoolTicketConfirmationElements', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });

            it('should call the correct method for a school service single ticket', () => {
                const singleTicketSpy = jest.spyOn(ticketConfirmation, 'buildSingleTicketConfirmationElements');
                const ctx = getMockContext({
                    session: {
                        [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'single' },
                    },
                });
                singleTicketSpy.mockReturnValue([]);
                buildSchoolTicketConfirmationElements(ctx);
                expect(singleTicketSpy).toBeCalled();
            });

            it('should call the correct method for a school service period ticket', () => {
                const periodTicketSpy = jest.spyOn(
                    ticketConfirmation,
                    'buildPeriodOrMultiOpTicketConfirmationElements',
                );
                const ctx = getMockContext({
                    session: {
                        [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'period' },
                    },
                });
                periodTicketSpy.mockReturnValue([]);
                buildSchoolTicketConfirmationElements(ctx);
                expect(periodTicketSpy).toBeCalled();
            });

            it('should call the correct method for a school service flat fare ticket', () => {
                const flatFareTicketSpy = jest.spyOn(ticketConfirmation, 'buildFlatFareTicketConfirmationElements');
                const ctx = getMockContext({
                    session: {
                        [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'flatFare' },
                    },
                });
                flatFareTicketSpy.mockReturnValue([]);
                buildSchoolTicketConfirmationElements(ctx);
                expect(flatFareTicketSpy).toBeCalled();
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

            it.each([
                ['single', 'buildSingleTicketConfirmationElements'],
                ['return', 'buildReturnTicketConfirmationElements'],
                ['period', 'buildPeriodOrMultiOpTicketConfirmationElements'],
                ['flatFare', 'buildFlatFareTicketConfirmationElements'],
                ['multiOperator', 'buildPeriodOrMultiOpTicketConfirmationElements'],
                ['schoolService', 'buildSchoolTicketConfirmationElements'],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ])('should call the correct method for a %s ticket', (fareType, methodName: any) => {
                const spy = jest.spyOn(ticketConfirmation, methodName);
                const ctx = getMockContext();
                spy.mockReturnValue([]);
                buildTicketConfirmationElements(fareType, ctx);
                expect(spy).toBeCalledWith(ctx);
            });

            it('should throw an error when the fare type is not an expected type', () => {
                const ctx = getMockContext();
                expect(() => buildTicketConfirmationElements('not a real fare type', ctx)).toThrowError(
                    'Did not receive an expected fareType.',
                );
            });
        });

        describe('getServerSideProps', () => {
            it('should call the buildTicketConfirmationElements method and return valid props', () => {
                const buildConfirmationElementsSpy = jest.spyOn(ticketConfirmation, 'buildTicketConfirmationElements');
                buildConfirmationElementsSpy.mockReturnValue([]);
                const ctx = getMockContext();
                const mockProps: { props: TicketConfirmationProps } = {
                    props: {
                        confirmationElements: expect.any(Array),
                        csrfToken: expect.any(String),
                    },
                };
                const props = getServerSideProps(ctx);
                expect(buildConfirmationElementsSpy).toBeCalled();
                expect(props).toEqual(mockProps);
            });

            it('should throw an error if the fare type is not an expected type', () => {
                const buildConfirmationElementsSpy = jest.spyOn(ticketConfirmation, 'buildTicketConfirmationElements');
                buildConfirmationElementsSpy.mockReturnValue([]);
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
