import * as React from 'react';
import { shallow } from 'enzyme';
import { mockDataOperatorGroup } from '../testData/mockData';
import ReuseOperatorGroup from '../../src/pages/reuseOperatorGroup';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('reuseOperatorGroup', () => {
        it('should render correctly', () => {
            const tree = shallow(<ReuseOperatorGroup errors={[]} csrfToken="" operatorGroups={[]} backHref="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render coorectly when one operator group is specified', () => {
            const tree = shallow(
                <ReuseOperatorGroup errors={[]} csrfToken="" operatorGroups={[mockDataOperatorGroup]} backHref="" />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render errors when user does not select a radio button', () => {
            const tree = shallow(
                <ReuseOperatorGroup
                    errors={[
                        {
                            errorMessage: 'Choose an operator group from the options below',
                            id: 'operatorGroup-0',
                        },
                    ]}
                    csrfToken=""
                    operatorGroups={[mockDataOperatorGroup]}
                    backHref=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
