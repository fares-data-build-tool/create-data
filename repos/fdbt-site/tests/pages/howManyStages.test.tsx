import * as React from 'react';
import { shallow } from 'enzyme';
import HowManyStages from '../../src/pages/howManyStages';

describe('pages', () => {
    describe('howManyStages', () => {
        it('should render correctly', () => {
            const tree = shallow(<HowManyStages errors={[]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
