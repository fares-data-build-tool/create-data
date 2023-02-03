import { shallow } from 'enzyme';
import * as React from 'react';
import ViewCaps from '../../src/pages/viewCaps';

describe('pages', () => {
    describe('view caps', () => {
        it('should render correctly on no cap expiry', () => {
            const tree = shallow(<ViewCaps capValidity="" fareDayEnd="" viewCapErrors={[]} />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity is 24 hr', () => {
            const tree = shallow(<ViewCaps capValidity="24hr" fareDayEnd="" viewCapErrors={[]} />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity is fare day end', () => {
            const tree = shallow(<ViewCaps capValidity="fareDayEnd" fareDayEnd="2323" viewCapErrors={[]} />);

            expect(tree).toMatchSnapshot();
        });
    });
});
