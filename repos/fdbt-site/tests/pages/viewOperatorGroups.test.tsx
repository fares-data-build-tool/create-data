import { shallow } from 'enzyme';
import * as React from 'react';
import { ErrorInfo, OperatorGroup } from '../../src/interfaces';
import ViewOperatorGroups from '../../src/pages/viewOperatorGroups';

describe('pages', () => {
    describe('view operator groups', () => {
        it('should render correctly when no operator groups', () => {
            const tree = shallow(
                <ViewOperatorGroups
                    operatorGroups={[]}
                    csrfToken={''}
                    referer={null}
                    isDevOrTest={false}
                    viewOperatorGroupErrors={[]}
                />,
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
                    isDevOrTest={false}
                    viewOperatorGroupErrors={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when there is some error', () => {
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

            const errorMessage = 'You cannot delete Operator operator group because it is used in a product(s).';

            const errors: ErrorInfo[] = [{ id: '/viewOperatorGroups', errorMessage }];

            const tree = shallow(
                <ViewOperatorGroups
                    operatorGroups={[operatorGroup]}
                    csrfToken={''}
                    referer={'hello'}
                    isDevOrTest={false}
                    viewOperatorGroupErrors={errors}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
