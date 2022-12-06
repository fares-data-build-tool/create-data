import * as React from 'react';
import { shallow } from 'enzyme';
import SelectCappedProductGroup from '../../src/pages/selectCappedProductGroup';

describe('pages', () => {
    describe('selectCappedProductGroup', () => {
        it('should render correctly with saved product groups and none selected', () => {
            const tree = shallow(
                <SelectCappedProductGroup
                    errors={[]}
                    csrfToken=""
                    savedGroups={[
                        {
                            id: 1,
                            productIds: ['1', '2', '3', '4'],
                            name: 'The capped products',
                        },
                        {
                            id: 2,
                            productIds: ['1', '2', '3', '4', '5'],
                            name: 'Other products',
                        },
                    ]}
                    selectedId={null}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with saved product groups and one selected', () => {
            const tree = shallow(
                <SelectCappedProductGroup
                    errors={[]}
                    csrfToken=""
                    savedGroups={[
                        {
                            id: 1,
                            productIds: ['1', '2', '3', '4'],
                            name: 'The capped products',
                        },
                        {
                            id: 2,
                            productIds: ['1', '2', '3', '4', '5'],
                            name: 'Other products',
                        },
                    ]}
                    selectedId={2}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with no saved product groups', () => {
            const tree = shallow(
                <SelectCappedProductGroup errors={[]} csrfToken="" savedGroups={[]} selectedId={null} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with saved product groups and an error because one was not selected', () => {
            const tree = shallow(
                <SelectCappedProductGroup
                    errors={[
                        {
                            errorMessage: 'Choose a group of products',
                            id: 'product-group-0-radio',
                        },
                    ]}
                    csrfToken=""
                    savedGroups={[
                        {
                            id: 1,
                            productIds: ['1', '2', '3', '4'],
                            name: 'The capped products',
                        },
                        {
                            id: 2,
                            productIds: ['1', '2', '3', '4', '5'],
                            name: 'Other products',
                        },
                    ]}
                    selectedId={null}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
