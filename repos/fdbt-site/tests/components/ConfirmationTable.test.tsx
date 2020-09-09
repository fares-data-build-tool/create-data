import { shallow } from 'enzyme';
import React from 'react';
import ConfirmationTable from '../../src/components/ConfirmationTable';

describe('ConfirmationTable', () => {
    it('should render the table with options', () => {
        const wrapper = shallow(
            <ConfirmationTable
                confirmationElements={[
                    {
                        header: 'Snapshot test things',
                        innerElements: [
                            { name: 'Name', content: 'Bob', href: '/login' },
                            { name: 'House', content: 'Big', href: '/fareType' },
                        ],
                    },
                    {
                        header: 'Other Snapshot test things',
                        innerElements: [{ name: 'Age', content: '21', href: '/' }],
                    },
                ]}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
