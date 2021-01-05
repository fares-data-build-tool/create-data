import React from 'react';
import { shallow } from 'enzyme';
import ChooseValidity, { getServerSideProps } from '../../src/pages/chooseValidity';
import { getMockContext } from '../testData/mockData';
import { DURATION_VALID_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, PRODUCT_DETAILS_ATTRIBUTE } from '../../src/constants';
import { DurationValidInfo } from '../../src/interfaces';

describe('Choose Validity Page', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render correctly', () => {
        const tree = shallow(
            <ChooseValidity
                productName="bus company"
                productPrice="£3.00"
                passengerType="Adult"
                amount=""
                duration=""
                errors={[]}
                csrfToken=""
            />,
        );
        expect(tree).toMatchSnapshot();
    });
    it('should render correctly with defaults when provided', () => {
        const tree = shallow(
            <ChooseValidity
                productName="bus company"
                productPrice="£3.00"
                passengerType="Adult"
                amount="2"
                duration="day"
                errors={[]}
                csrfToken=""
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    describe('getServerSideProps', () => {
        it('should throw an error if the PRODUCT_DETAILS_ATTRIBUTE cannot be found', () => {
            const ctx = getMockContext({ session: { [PRODUCT_DETAILS_ATTRIBUTE]: null } });
            expect(() => getServerSideProps(ctx)).toThrow(
                'Failed to retrieve productCookie info for choose validity page.',
            );
        });

        it('should throw an error if the PASSENGER_TYPE_ATTRIBUTE cannot be found', () => {
            const ctx = getMockContext({ session: { [PASSENGER_TYPE_ATTRIBUTE]: undefined } });
            expect(() => getServerSideProps(ctx)).toThrow(
                'Failed to retrieve passenger type session info for choose validity page.',
            );
        });

        it('should return default props when the page is first visited', () => {
            const ctx = getMockContext({ session: { [DURATION_VALID_ATTRIBUTE]: null } });
            const expectedProps = {
                productName: 'Product A',
                productPrice: '1234',
                passengerType: 'Adult',
                amount: '',
                errors: [],
                duration: '',
                csrfToken: '',
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });

        it('should extract info from the DURATION_VALID_ATTRIBUTE and return this info in the props', () => {
            const mockValidityInfo: DurationValidInfo = { amount: '2', duration: 'day', errors: [] };
            const ctx = getMockContext({ session: { [DURATION_VALID_ATTRIBUTE]: mockValidityInfo } });
            const expectedProps = {
                productName: 'Product A',
                productPrice: '1234',
                passengerType: 'Adult',
                amount: '2',
                errors: [],
                duration: 'day',
                csrfToken: '',
            };
            const actualProps = getServerSideProps(ctx);
            expect(actualProps.props).toEqual(expectedProps);
        });
    });
});
