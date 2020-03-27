/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import SingleOperator from '../../src/pages/singleOperator';
import { ServiceLists } from '../../src/interfaces';

const serviceInfo: ServiceLists = {
    selectedServices: [],
    error: false,
};

describe('pages', () => {
    describe('singleOperator', () => {
        it('should render correctly', () => {
            // eslint-disable-next-line react/jsx-props-no-spreading
            const tree = shallow(<SingleOperator {...serviceInfo} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
