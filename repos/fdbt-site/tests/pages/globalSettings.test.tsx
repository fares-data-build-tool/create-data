import * as React from 'react';
import { shallow } from 'enzyme';
import GlobalSettings from '../../src/pages/globalSettings';
import { GlobalSettingsCounts } from 'src/interfaces';

describe('pages', () => {
    describe('globalSettings', () => {
        it('should render correctly', () => {
            const globalSettingsCounts: GlobalSettingsCounts = {
                passengerTypesCount: 0,
                timeRestrictionsCount: 3,
                purchaseMethodsCount: 7,
                fareDayEndSet: true,
                operatorDetailsSet: true,
            };
            const tree = shallow(
                <GlobalSettings globalSettingsCounts={globalSettingsCounts} referer="hello" exportEnabled={false} />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
