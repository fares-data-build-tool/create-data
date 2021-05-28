import * as React from 'react';
import { shallow } from 'enzyme';
import PassengerType from '../../src/pages/passengerType';

describe('pages', () => {
    describe('operator', () => {
        it('should render correctly', () => {
            const tree = shallow(<PassengerType errors={[]} csrfToken="" savedGroups={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
