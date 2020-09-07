import * as React from 'react';
import { shallow } from 'enzyme';
import ChooseStages from '../../src/pages/chooseStages';

describe('pages', () => {
    describe('chooseStages', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ChooseStages fareStage={{ fareStages: '' }} errors={[]} csrfToken="" pageProps={[]} />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
