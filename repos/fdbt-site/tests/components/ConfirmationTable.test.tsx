import { shallow } from 'enzyme';
import React from 'react';
import ConfirmationTable from '../../src/components/ConfirmationTable';

describe('ConfirmationTable', () => {
    it('should render the table with options', () => {
        const wrapper = shallow(
            <ConfirmationTable
                header="Snapshot test things"
                confirmationElements={[
                    { name: 'Name', content: 'Bob', href: '/login' },
                    { name: 'House', content: 'Big', href: '/fareType' },
                ]}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
