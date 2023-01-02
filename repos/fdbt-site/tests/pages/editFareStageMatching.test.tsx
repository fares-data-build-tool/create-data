/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as auroradb from '../../src/data/auroradb';
import * as s3 from '../../src/data/s3';
import {
    mockRawService,
    userFareStages,
    fareStagesEditTicket,
    zoneStops,
    selectedFareStages,
} from '../testData/mockData';

import EditFareStageMatching from '../../src/pages/editFareStageMatching';

jest.mock('../../src/data/auroradb.ts');
jest.mock('../../src/data/s3.ts');

describe('Edit Fare Stage Matching Page', () => {
    let wrapper: ShallowWrapper;
    let getServiceByNocCodeLineNameAndDataSourceSpy = jest.spyOn(auroradb, 'getServiceByIdAndDataSource');
    let batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
    let getUserFareStagesSpy = jest.spyOn(s3, 'getUserFareStages');

    beforeEach(() => {
        getServiceByNocCodeLineNameAndDataSourceSpy = jest.spyOn(auroradb, 'getServiceByIdAndDataSource');
        batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
        getUserFareStagesSpy = jest.spyOn(s3, 'getUserFareStages');

        getServiceByNocCodeLineNameAndDataSourceSpy.mockImplementation(() => Promise.resolve(mockRawService));
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve([]));
        getUserFareStagesSpy.mockImplementation(() => Promise.resolve(userFareStages));

        wrapper = shallow(
            <EditFareStageMatching
                fareStages={fareStagesEditTicket}
                stops={zoneStops}
                errors={[]}
                selectedFareStages={selectedFareStages}
                csrfToken=""
                backHref=""
            />,
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with error', () => {
        wrapper = shallow(
            <EditFareStageMatching
                fareStages={fareStagesEditTicket}
                stops={zoneStops}
                errors={[
                    {
                        errorMessage:
                            'One or more fare stages have not been assigned, assign each fare stage to a stop',
                        id: 'option-0',
                    },
                ]}
                selectedFareStages={selectedFareStages}
                csrfToken=""
                backHref=""
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
