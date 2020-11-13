/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { mount, shallow } from 'enzyme';
import * as auroradb from '../../src/data/auroradb';
import * as s3 from '../../src/data/s3';
import {
    mockRawService,
    userFareStages,
    zoneStops,
    service,
    getMockContext,
    mockRawServiceWithDuplicates,
    selectedFareStages,
} from '../testData/mockData';
import Matching, { getServerSideProps } from '../../src/pages/matching';
import { JOURNEY_ATTRIBUTE, SERVICE_ATTRIBUTE } from '../../src/constants/index';

jest.mock('../../src/data/auroradb.ts');
jest.mock('../../src/data/s3.ts');

describe('Matching Page', () => {
    let wrapper: any;
    let getServiceByNocCodeAndLineNameSpy: any;
    let batchGetStopsByAtcoCodeSpy: any;
    let getUserFareStagesSpy: any;

    beforeEach(() => {
        getServiceByNocCodeAndLineNameSpy = jest.spyOn(auroradb, 'getServiceByNocCodeAndLineName');
        batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
        getUserFareStagesSpy = jest.spyOn(s3, 'getUserFareStages');

        getServiceByNocCodeAndLineNameSpy.mockImplementation(() => Promise.resolve(mockRawService));
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));
        getUserFareStagesSpy.mockImplementation(() => Promise.resolve(userFareStages));

        wrapper = shallow(
            <Matching
                userFareStages={userFareStages}
                stops={zoneStops}
                service={service}
                error={false}
                selectedFareStages={selectedFareStages}
                csrfToken=""
            />,
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('shows the correct amount of fare stages in the select boxes', () => {
        const mountedWrapper = mount(
            <Matching
                userFareStages={userFareStages}
                stops={zoneStops}
                service={service}
                error={false}
                selectedFareStages={selectedFareStages}
                csrfToken=""
            />,
        );

        expect(
            mountedWrapper
                .find('.farestage-select')
                .first()
                .find('option'),
        ).toHaveLength(10);
    });

    describe('getServerSideProps', () => {
        it('generates the correct list of master stops', async () => {
            const ctx = getMockContext({
                session: {
                    [JOURNEY_ATTRIBUTE]: {
                        directionJourneyPattern: '13003921A#13003655B',
                    },
                },
            });

            await getServerSideProps(ctx);

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
            getServiceByNocCodeAndLineNameSpy.mockImplementation(() => Promise.resolve(mockRawService));
            batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));

            const ctx = getMockContext({
                session: {
                    [JOURNEY_ATTRIBUTE]: {
                        directionJourneyPattern: '13003921A#13003655B',
                    },
                },
            });

            const result = await getServerSideProps(ctx);

            expect(result.props.stops[0].atcoCode).toEqual('13003921A');
            expect(result.props.stops[result.props.stops.length - 1].atcoCode).toEqual('13003655B');
        });

        it('generates the correct list of master stops given journeys with duplicate start and end points', async () => {
            getServiceByNocCodeAndLineNameSpy.mockImplementation(() => Promise.resolve(mockRawServiceWithDuplicates));

            const ctx = getMockContext({
                session: {
                    [JOURNEY_ATTRIBUTE]: {
                        directionJourneyPattern: '13003655B#13003921A',
                    },
                },
            });

            await getServerSideProps(ctx);

            expect(auroradb.batchGetStopsByAtcoCode).toBeCalledTimes(1);
            expect(auroradb.batchGetStopsByAtcoCode).toBeCalledWith([
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
                '13003999F',
                '13003111A',
            ]);
        });

        it('throws an error if no stops can be found', async () => {
            const ctx = getMockContext({
                session: {
                    [JOURNEY_ATTRIBUTE]: {
                        directionJourneyPattern: '123ZZZ#13003921A',
                    },
                },
            });

            await expect(getServerSideProps(ctx)).rejects.toThrow(
                'No stops found for journey: nocCode TEST, lineName: X01, startPoint: 123ZZZ, endPoint: 13003921A',
            );
        });

        it('throws an error if noc invalid', async () => {
            const ctx = getMockContext({
                cookies: {
                    operator: null,
                },
            });

            await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
        });

        it('throws an error if service attribute not set', async () => {
            const ctx = getMockContext({
                session: {
                    [SERVICE_ATTRIBUTE]: undefined,
                },
            });

            await expect(getServerSideProps(ctx)).rejects.toThrow('Necessary cookies not found to show matching page');
        });
    });
});
