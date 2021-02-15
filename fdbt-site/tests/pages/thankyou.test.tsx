import * as React from 'react';
import { shallow } from 'enzyme';
import Thankyou, { getServerSideProps } from '../../src/pages/thankyou';
import { getMockContext } from '../testData/mockData';
import {
    FARE_TYPE_ATTRIBUTE,
    INPUT_METHOD_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
} from '../../src/constants/attributes';
import { OperatorAttribute } from '../../src/interfaces';

describe('pages', () => {
    describe('thankyou', () => {
        it('should render correctly', () => {
            const tree = shallow(<Thankyou uuid="a1b2c3d4e5" emailAddress="test@example.com" />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('retrieves the uuid correctly', () => {
            const ctx = getMockContext({
                cookies: {},
                body: null,
                uuid: { operatorUuid: '84c7b1b4-e178-4849-bc49-bd32cdb2db39' },
            });

            const expectedResults = {
                props: {
                    uuid: '84c7b1b4-e178-4849-bc49-bd32cdb2db39',
                    emailAddress: 'test@example.com',
                },
            };

            const results = getServerSideProps(ctx);
            expect(results).toEqual(expectedResults);
        });

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
