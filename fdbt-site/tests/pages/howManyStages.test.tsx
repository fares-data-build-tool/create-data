import * as React from 'react';
import { shallow } from 'enzyme';
import HowManyStages from '../../src/pages/howManyStages';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('howManyStages', () => {
        it('should render correctly', () => {
            const tree = shallow(<HowManyStages errors={[]} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render errors correctly', () => {
            const mockError: ErrorInfo[] = [
                {
                    id: 'how-many-stages-error',
                    errorMessage: 'Choose an option regarding how many fare stages you have',
                },
            ];
            const tree = shallow(<HowManyStages errors={mockError} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
