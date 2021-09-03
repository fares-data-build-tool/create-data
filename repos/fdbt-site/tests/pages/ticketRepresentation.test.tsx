import * as React from 'react';
import { shallow } from 'enzyme';
import TicketRepresentation, { getServerSideProps } from '../../src/pages/ticketRepresentation';
import { getMockContext, mockSchemOpIdToken } from '../testData/mockData';
import { CARNET_FARE_TYPE_ATTRIBUTE, FARE_TYPE_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../src/constants/attributes';

describe('pages', () => {
    describe('ticketRepresentation', () => {
        it('should render correctly when the fare type is a period ticket', () => {
            const tree = shallow(
                <TicketRepresentation fareType="period" errors={[]} csrfToken="" showHybrid showPointToPoint />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when the fare type is a multi operator ticket', () => {
            const tree = shallow(
                <TicketRepresentation
                    fareType="multiOperator"
                    errors={[]}
                    csrfToken=""
                    showHybrid={false}
                    showPointToPoint
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <TicketRepresentation
                    fareType="period"
                    errors={[
                        {
                            errorMessage: 'Choose a type of ticket representation',
                            id: 'geo-zone',
                        },
                    ]}
                    csrfToken=""
                    showHybrid
                    showPointToPoint
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('should set showHybrid to false when the ticket is a multiOperator', () => {
            const ctx = getMockContext({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                },
            });
            const result = getServerSideProps(ctx);

            expect(result.props.showHybrid).toBeFalsy();
        });

        it('should set showHybrid to true when the ticket is not a multiOperator', () => {
            const ctx = getMockContext({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                },
            });
            const result = getServerSideProps(ctx);

            expect(result.props.showHybrid).toBe(true);
        });

        it('should set showPointToPoint to false when the ticket is a carnet', () => {
            const ctx = getMockContext({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                    [CARNET_FARE_TYPE_ATTRIBUTE]: true,
                },
            });
            const result = getServerSideProps(ctx);

            expect(result.props.showPointToPoint).toBe(false);
        });

        it('should set showPointToPoint and showHybrid to false for a scheme', () => {
            const ctx = getMockContext({
                cookies: {
                    idToken: mockSchemOpIdToken,
                },
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                    [OPERATOR_ATTRIBUTE]: { name: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                },
            });
            const result = getServerSideProps(ctx);

            expect(result.props.showPointToPoint).toBe(false);
            expect(result.props.showHybrid).toBe(false);
        });
    });
});
