import { shallow } from 'enzyme';
import React from 'react';
import MatchingList from '../../src/components/MatchingList';
import { userFareStages, selectedFareStages, naptanStopInfo } from '../testData/mockData';

describe('MatchingList', () => {
    it('should render the matchinglist with options', () => {
        const wrapper = shallow(
            <MatchingList
                userFareStages={userFareStages}
                stops={naptanStopInfo}
                selectedFareStages={selectedFareStages}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render value of selected stage as default value if passed in selectedFareStages', () => {
        const wrapper = shallow(
            <MatchingList
                userFareStages={userFareStages}
                stops={naptanStopInfo}
                selectedFareStages={[
                    '{"stop":{"stopName":"Sophia Street","naptanCode":"durgapwp","atcoCode":"13003661E","localityCode":"E0045957","localityName":"Seaham","parentLocalityName":"IW Test","indicator":"S-bound","street":"Sophia Street"},"stage":"Acomb Green Lane"}',
                ]}
            />,
        );
        const selector = wrapper.find('#option-14');
        expect(selector.prop('defaultValue')).toEqual(
            '{"stop":{"stopName":"Sophia Street","naptanCode":"durgapwp","atcoCode":"13003661E","localityCode":"E0045957","localityName":"Seaham","parentLocalityName":"IW Test","indicator":"S-bound","street":"Sophia Street"},"stage":"Acomb Green Lane"}',
        );
    });

    it('should render no value as default value if empty array passed in selectedFareStages', () => {
        const wrapper = shallow(
            <MatchingList userFareStages={userFareStages} stops={naptanStopInfo} selectedFareStages={[]} />,
        );
        const selector = wrapper.find('#option-1');
        expect(selector.prop('defaultValue')).toEqual('');
    });
});
