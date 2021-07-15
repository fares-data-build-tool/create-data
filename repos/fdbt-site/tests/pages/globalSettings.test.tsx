import * as React from 'react';
import { shallow } from 'enzyme';
import GlobalSettings from '../../src/pages/globalSettings';
import { SettingsOverview } from 'src/interfaces';

describe('pages', () => {
    describe('globalSettings', () => {
        it('should render correctly with zero saved passenger types', () => {
            const mockSavedPassengerTypesDetails: SettingsOverview = {
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 0,
            };
            const tree = shallow(<GlobalSettings savedPassengerTypesDetails={mockSavedPassengerTypesDetails} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with some saved passenger types', () => {
            const mockSavedPassengerTypesDetails: SettingsOverview = {
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 4,
            };
            const tree = shallow(<GlobalSettings savedPassengerTypesDetails={mockSavedPassengerTypesDetails} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
