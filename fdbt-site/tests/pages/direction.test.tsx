import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';

import Direction from '../../src/pages/direction';
import { JOURNEY_COOKIE } from '../../src/constants';
import {
    getJourneyPatternsAndLocalityByNocCodeAndLineName,
    getStopPointLocalityByAtcoCode,
    ServiceInformation,
} from '../../src/data/dynamodb';

jest.mock('../../src/data/dynamodb');

const mockServiceInfo: ServiceInformation = {
    serviceDescription: 'Harrogate - Beckwith Knowle',
    journeyPatterns: [
        {
            startPoint: 'Harrogate Bus Station Stand 5, Harrogate',
            endPoint: 'Harrogate Bus Station Stand 6, Harrogate',
        },
    ],
};

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (getJourneyPatternsAndLocalityByNocCodeAndLineName as jest.Mock).mockImplementation(() => mockServiceInfo);
        });

        it('should render correctly', () => {
            const tree = shallow(
                <Direction Operator="Connexions Buses" lineName="X6A" serviceInfo={mockServiceInfo} />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
