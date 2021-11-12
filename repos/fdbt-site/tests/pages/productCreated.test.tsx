import * as React from 'react';
import { shallow } from 'enzyme';
import ProductCreated, { getServerSideProps } from '../../src/pages/productCreated';
import { getMockContext } from '../testData/mockData';
import {
    FARE_TYPE_ATTRIBUTE,
    INPUT_METHOD_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
} from '../../src/constants/attributes';
import { OperatorAttribute } from '../../src/interfaces';

describe('pages', () => {
    describe('productCreated', () => {
        it('should render correctly', () => {
            const tree = shallow(<ProductCreated />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('clears all session data except operator data', () => {
            const operatorData: OperatorAttribute = {
                name: 'Test Op',
                nocCode: 'TEST',
            };

            const ctx = getMockContext({
                cookies: {},
                body: null,
                session: {
                    [OPERATOR_ATTRIBUTE]: operatorData,
                    [FARE_TYPE_ATTRIBUTE]: {
                        fareType: 'single',
                    },
                    [SERVICE_ATTRIBUTE]: {
                        service: 'test',
                    },
                    [INPUT_METHOD_ATTRIBUTE]: {
                        inputMethod: 'csv',
                    },
                },
            });

            getServerSideProps(ctx);

            expect(ctx.req.session[OPERATOR_ATTRIBUTE]).toEqual(operatorData);
            expect(ctx.req.session[FARE_TYPE_ATTRIBUTE]).toBeUndefined();
            expect(ctx.req.session[SERVICE_ATTRIBUTE]).toBeUndefined();
            expect(ctx.req.session[INPUT_METHOD_ATTRIBUTE]).toBeUndefined();
        });
    });
});
