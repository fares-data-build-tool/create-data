import * as React from 'react';
import { shallow } from 'enzyme';
import PhaseBanner from '../../src/layout/PhaseBanner';
import { FEEDBACK_LINK } from '../../src/constants';

describe('PhaseBanner', () => {
    it('should render correctly', () => {
        const tree = shallow(<PhaseBanner />);
        expect(tree).toMatchSnapshot();
    });

    it('expect govuk_link to be correct gov.uk', () => {
        const tree = shallow(<PhaseBanner />);
        expect(tree.find('#feedback-link').prop('href')).toEqual(FEEDBACK_LINK);
    });
});
