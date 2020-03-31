/* eslint-disable global-require */

import * as React from 'react';
import { shallow } from 'enzyme';
import SingleOperator, { SelectedServiceProps } from '../../src/pages/singleOperator';

const serviceInfo: SelectedServiceProps = {
    service: {
        selectedServices: [],
        error: false,
    },
    buttonText: 'Select All',
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
