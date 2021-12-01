import {
    getMockContext,
    mockRawService,
    zoneStops,
    mockRawServiceWithDuplicates,
    userFareStages,
} from '../../testData/mockData';
import {
    DIRECTION_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
} from '../../../src/constants/attributes';
import * as auroradb from '../../../src/data/auroradb';
import {
    getMatchingProps,
    removeDuplicateAdjacentStops,
    sortingWithoutSequenceNumbers,
} from '../../../src/utils/apiUtils/matching';
import * as s3 from '../../../src/data/s3';

describe('matching', () => {
    describe('getMatchingProps', () => {
        const getServiceByNocCodeLineNameAndDataSourceSpy = jest.spyOn(auroradb, 'getServiceByIdAndDataSource');
        const batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
        const getUserFareStagesSpy = jest.spyOn(s3, 'getUserFareStages');

        getServiceByNocCodeLineNameAndDataSourceSpy.mockImplementation(() => Promise.resolve(mockRawService));
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));
        getUserFareStagesSpy.mockImplementation(() => Promise.resolve(userFareStages));

        beforeEach(jest.clearAllMocks);

        it('generates the correct list of master stops', async () => {
            const ctx = getMockContext({
                session: {
                    [DIRECTION_ATTRIBUTE]: {
                        direction: 'outbound',
                    },
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
            });

            await getMatchingProps(ctx, {});

            expect(auroradb.batchGetStopsByAtcoCode).toBeCalledTimes(1);
            expect(auroradb.batchGetStopsByAtcoCode).toBeCalledWith([
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
            ]);
        });

        it('preserves the stops order', async () => {
            getServiceByNocCodeLineNameAndDataSourceSpy.mockImplementation(() => Promise.resolve(mockRawService));
            batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));

            const ctx = getMockContext({
                session: {
                    [DIRECTION_ATTRIBUTE]: {
                        direction: 'outbound',
                    },
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
            });

            const result = await getMatchingProps(ctx, {});

            expect(result.props.stops[0].atcoCode).toEqual('13003921A');
            expect(result.props.stops[result.props.stops.length - 1].atcoCode).toEqual('13003655B');
        });

        it('generates the correct list of master stops given journeys with duplicate start and end points', async () => {
            getServiceByNocCodeLineNameAndDataSourceSpy.mockImplementation(() =>
                Promise.resolve(mockRawServiceWithDuplicates),
            );

            const ctx = getMockContext({
                session: {
                    [DIRECTION_ATTRIBUTE]: {
                        direction: 'outbound',
                    },
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
            });

            await getMatchingProps(ctx, {});

            expect(auroradb.batchGetStopsByAtcoCode).toBeCalledTimes(1);
        });

        it('throws an error if no stops can be found', async () => {
            const ctx = getMockContext({
                session: {
                    [DIRECTION_ATTRIBUTE]: {
                        direction: 'blah',
                    },
                    [TXC_SOURCE_ATTRIBUTE]: {
                        source: 'bods',
                        hasBods: true,
                        hasTnds: true,
                    },
                },
            });

            await expect(getMatchingProps(ctx, {})).rejects.toThrow(
                'No stops found for journey: nocCode TEST, lineName: X01, direction: blah',
            );
        });

        it('throws an error if noc invalid', async () => {
            const ctx = getMockContext({
                session: {
                    [OPERATOR_ATTRIBUTE]: undefined,
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

            await expect(getMatchingProps(ctx, {})).rejects.toThrow('invalid NOC set');
        });

        it('throws an error if service attribute not set', async () => {
            const ctx = getMockContext({
                session: {
                    [SERVICE_ATTRIBUTE]: undefined,
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

            await expect(getMatchingProps(ctx, {})).rejects.toThrow(
                'Necessary attributes not found to show matching page',
            );
        });

        it('throws an error if txc source attribute not set', async () => {
            const ctx = getMockContext({
                session: {
                    [TXC_SOURCE_ATTRIBUTE]: undefined,
                    [DIRECTION_ATTRIBUTE]: {
                        direction: 'outbound',
                    },
                },
            });

            await expect(getMatchingProps(ctx, {})).rejects.toThrow('Attribute was not found fdbt-txc-source');
        });

        describe('sortingWithoutSequenceNumbers', () => {
            it('should correctly sort without sequence numbers', () => {
                const stopPoints = sortingWithoutSequenceNumbers([
                    {
                        direction: 'blah',
                        orderedStopPoints: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((it) => ({
                            stopPointRef: it,
                            commonName: it,
                        })),
                    },
                    {
                        direction: 'blah',
                        orderedStopPoints: ['1', '2', 'C', 'D'].map((it) => ({
                            stopPointRef: it,
                            commonName: it,
                        })),
                    },
                    {
                        direction: 'blah',
                        orderedStopPoints: ['A', 'B', 'X', 'Y', 'G', 'H', 'I'].map((it) => ({
                            stopPointRef: it,
                            commonName: it,
                        })),
                    },
                ]);

                expect(stopPoints).toEqual(['A', 'B', '1', '2', 'C', 'D', 'E', 'F', 'X', 'Y', 'G', 'H', 'I']);
            });
        });

        describe('removeDuplicateAdjacentStops', () => {
            it('removes some stops if theyre next to one another in the list and identical', () => {
                const input = ['stop1', 'stop2', 'stop3', 'stop3', 'stop4', 'stop1', 'stop2', 'stop2'];
                const result = removeDuplicateAdjacentStops(input);
                expect(result).toEqual(['stop1', 'stop2', 'stop3', 'stop4', 'stop1', 'stop2']);
            });

            it('does not remove stops if they are not identical', () => {
                const input = ['stop1', 'stop2', 'stop3', 'stop4', 'stop5', 'stop6', 'stop7', 'stop8'];
                const result = removeDuplicateAdjacentStops(input);
                expect(result).toEqual(['stop1', 'stop2', 'stop3', 'stop4', 'stop5', 'stop6', 'stop7', 'stop8']);
            });
        });
    });
});
