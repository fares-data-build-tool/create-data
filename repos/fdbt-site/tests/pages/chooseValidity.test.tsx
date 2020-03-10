/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { shallow } from 'enzyme';
import ChooseValidity from '../../src/pages/chooseValidity';

jest.mock('../../src/data/dynamodb.ts');
jest.mock('../../src/data/s3.ts');

describe('Choose Validity Page', () => {
    let wrapper: any;

    it('should render correctly', () => {
        wrapper = shallow(<ChooseValidity productName="" productPrice="" />);
        expect(wrapper).toMatchSnapshot();
    });
});
