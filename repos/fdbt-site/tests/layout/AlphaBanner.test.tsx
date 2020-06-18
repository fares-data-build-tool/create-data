import * as React from 'react';
import { shallow } from 'enzyme';
import AlphaBanner from '../../src/layout/AlphaBanner';
import { FEEDBACK_LINK } from '../../src/constants';

describe('AlphaBanner', () => {
    it('should render correctly', () => {
        const tree = shallow(<AlphaBanner />);
        expect(tree).toMatchSnapshot();
    });

    it('expect govuk_link to be correct gov.uk', () => {
        const tree = shallow(<AlphaBanner />);
        expect(tree.find('#feedback-link').prop('href')).toEqual(FEEDBACK_LINK);
    });
});
