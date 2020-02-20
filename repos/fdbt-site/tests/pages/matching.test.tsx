import React from 'react';
import { shallow } from 'enzyme';
import * as dynamodb from '../../src/data/dynamodb';
import * as s3 from '../../src/data/s3';
import { serviceData, userData, naptanStopInfo, serviceInfo } from '../testData/fareData';
import Matching from '../../src/pages/matching';

jest.mock('../../src/data/dynamodb.ts');

describe('Matching Page', () => {
    beforeEach(() => {
        jest.spyOn(dynamodb, 'getServiceByNocCodeAndLineName').mockImplementation(() => Promise.resolve(serviceData));
        jest.spyOn(s3, 'getUserData').mockImplementation(() => Promise.resolve(userData));
    });

    it('should render correctly', () => {
        const tree = shallow(<Matching userData={userData} stops={naptanStopInfo} serviceInfo={serviceInfo} />);
        expect(tree).toMatchSnapshot();
    });
});
