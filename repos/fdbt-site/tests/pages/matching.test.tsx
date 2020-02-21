/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { shallow } from 'enzyme';
import * as dynamodb from '../../src/data/dynamodb';
import * as s3 from '../../src/data/s3';
import {
    serviceData,
    userData,
    naptanStopInfo,
    serviceInfo,
    getMockContext,
    serviceDataWithDuplicates,
} from '../testData/mockData';
import Matching from '../../src/pages/matching';

jest.mock('../../src/data/dynamodb.ts');
jest.mock('../../src/data/s3.ts');

describe('Matching Page', () => {
    let wrapper: any;
    let getServiceByNocCodeAndLineNameSpy: any;
    let batchGetNaptanInfoByAtcoCodeSpy: any;
    let getUserDataSpy: any;

    beforeEach(() => {
        getServiceByNocCodeAndLineNameSpy = jest.spyOn(dynamodb, 'getServiceByNocCodeAndLineName');
        batchGetNaptanInfoByAtcoCodeSpy = jest.spyOn(dynamodb, 'batchGetNaptanInfoByAtcoCode');
        getUserDataSpy = jest.spyOn(s3, 'getUserData');

        getServiceByNocCodeAndLineNameSpy.mockImplementation(() => Promise.resolve(serviceData));
        batchGetNaptanInfoByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));
        getUserDataSpy.mockImplementation(() => Promise.resolve(userData));

        wrapper = shallow(<Matching userData={userData} stops={naptanStopInfo} serviceInfo={serviceInfo} />);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('shows the correct amount of fare stages in the select boxes', () => {
        expect(
            wrapper
                .find('.farestage-select')
                .first()
                .find('option'),
        ).toHaveLength(9);
    });

    describe('getInitialProps', () => {
        it('generates the correct list of master stops', async () => {
            const ctx = getMockContext();

            await Matching.getInitialProps(ctx);

            expect(dynamodb.batchGetNaptanInfoByAtcoCode).toBeCalledTimes(1);
            expect(dynamodb.batchGetNaptanInfoByAtcoCode).toBeCalledWith([
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

        it('generates the correct list of master stops given journeys with duplicate start and end points', async () => {
            getServiceByNocCodeAndLineNameSpy.mockImplementation(() => Promise.resolve(serviceDataWithDuplicates));

            const ctx = getMockContext({
                journey: {
                    startPoint: '13003655B',
                    endPoint: '13003921A',
                },
            });

            await Matching.getInitialProps(ctx);

            expect(dynamodb.batchGetNaptanInfoByAtcoCode).toBeCalledTimes(1);
            expect(dynamodb.batchGetNaptanInfoByAtcoCode).toBeCalledWith([
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
                journey: {
                    startPoint: '123ZZZ',
                    endPoint: '13003921A',
                },
            });

            await expect(Matching.getInitialProps(ctx)).rejects.toThrow(
                'No stops found for journey: nocCode HCTY, lineName: X01, startPoint: 123ZZZ, endPoint: 13003921A',
            );
        });

        it('throws an error if the operator, service or journey cookies are not set', async () => {
            const ctx = getMockContext({
                operator: null,
            });

            await expect(Matching.getInitialProps(ctx)).rejects.toThrow(
                'Necessary cookies not found to show matching page',
            );
        });
    });
});
