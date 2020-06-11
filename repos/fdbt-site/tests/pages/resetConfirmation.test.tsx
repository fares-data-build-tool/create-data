import * as React from 'react';
import { shallow } from 'enzyme';
import ResetConfirmation from '../../src/pages/resetConfirmation';

describe('pages', () => {
    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<ResetConfirmation email="test@email.com" csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
