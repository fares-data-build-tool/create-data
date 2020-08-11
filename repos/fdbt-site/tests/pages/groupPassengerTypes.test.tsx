import * as React from 'react';
import { shallow } from 'enzyme';
import DefineGroupPassengers from '../../src/pages/groupPassengerTypes';

describe('pages', () => {
    describe('defineGroupPassengers', () => {
        it('should render correctly with no GroupPassengerTypes', () => {
            const tree = shallow(
                <DefineGroupPassengers
                    groupPassengerInfo={{
                        passengerTypes: [],
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with GroupPassengerTypes and errors (GroupPassengerTypesWithErrors)', () => {
            const tree = shallow(
                <DefineGroupPassengers
                    groupPassengerInfo={{
                        errors: [
                            {
                                errorMessage: 'Choose one or two passenger types - you cannot exceed this limit',
                                id: '',
                            },
                        ],
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with group info and no errors', () => {
            const tree = shallow(
                <DefineGroupPassengers
                    groupPassengerInfo={{
                        passengerTypes: ['adult', 'child'],
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
