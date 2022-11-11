import * as React from 'react';
import { shallow } from 'enzyme';
import GlobalSettings from '../../src/pages/globalSettings';
import { GlobalSettingsCounts } from '../../src/interfaces';

describe('pages', () => {
    describe('globalSettings', () => {
        it('should render correctly in test env', () => {
            const globalSettingsCounts: GlobalSettingsCounts = {
                passengerTypesCount: 0,
                timeRestrictionsCount: 3,
                purchaseMethodsCount: 7,
                fareDayEndSet: true,
                operatorDetailsSet: true,
                operatorGroupsCount: 2,
            };
            const tree = shallow(
                <GlobalSettings globalSettingsCounts={globalSettingsCounts} isDevOrTest referer="hello" />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly in a non-test env', () => {
            const globalSettingsCounts: GlobalSettingsCounts = {
                passengerTypesCount: 0,
                timeRestrictionsCount: 3,
                purchaseMethodsCount: 7,
                fareDayEndSet: true,
                operatorDetailsSet: true,
                operatorGroupsCount: 2,
            };
            const tree = shallow(
                <GlobalSettings globalSettingsCounts={globalSettingsCounts} isDevOrTest={false} referer="hello" />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
