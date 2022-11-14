import { shallow } from 'enzyme';
import * as React from 'react';
import { OperatorGroup } from '../../src/interfaces';
import ViewOperatorGroups from '../../src/pages/viewOperatorGroups';

describe('pages', () => {
    describe('view operator groups', () => {
        it('should render correctly when no operator groups', () => {
            const tree = shallow(
                <ViewOperatorGroups operatorGroups={[]} csrfToken={''} referer={null} viewOperatorGroupErrors={[]} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on operator group', () => {
            const operatorGroup: OperatorGroup = {
                id: 1,
                name: 'first operator group',
                operators: [
                    {
                        name: 'First operator',
                        nocCode: 'FOP',
                    },
                ],
            };

            const tree = shallow(
                <ViewOperatorGroups
                    operatorGroups={[operatorGroup]}
                    csrfToken={''}
                    referer={'hello'}
                    viewOperatorGroupErrors={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
