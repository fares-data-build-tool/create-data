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
            };
            const tree = shallow(<GlobalSettings globalSettingsCounts={globalSettingsCounts} referer="hello" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
