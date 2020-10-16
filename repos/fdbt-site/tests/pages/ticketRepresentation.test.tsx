import * as React from 'react';
import { shallow } from 'enzyme';
import TicketRepresentation from '../../src/pages/ticketRepresentation';

describe('pages', () => {
    describe('ticketRepresentation', () => {
        it('should render correctly when the fare type is a period ticket', () => {
            const tree = shallow(<TicketRepresentation fareType="period" errors={[]} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when the fare type is a multi operator ticket', () => {
            const tree = shallow(
                <TicketRepresentation fareType="multiOperator" errors={[]} csrfToken="" pageProps={[]} />,
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
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
