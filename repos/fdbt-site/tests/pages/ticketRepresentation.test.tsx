import * as React from 'react';
import { shallow } from 'enzyme';
import TicketRepresentation, { getServerSideProps } from '../../src/pages/ticketRepresentation';
import { getMockContext } from '../testData/mockData';
import { FARE_TYPE_ATTRIBUTE } from '../../src/constants/attributes';

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

        it('should set showHybrid to false when the ticket is not a multiOperator', () => {
            const ctx = getMockContext({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                },
            });
            const result = getServerSideProps(ctx);

            expect(result.props.showHybrid).toBeTruthy();
        });
    });
});
