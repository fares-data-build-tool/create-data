import * as React from 'react';
import { shallow } from 'enzyme';
import Banner from '../../src/layout/Banner';
import { FEEDBACK_LINK } from '../../src/constants';

describe('Banner', () => {
    it('should render correctly', () => {
        const tree = shallow(<Banner />);
        expect(tree).toMatchSnapshot();
    });

    it('expect govuk_link to be correct gov.uk', () => {
        const tree = shallow(<Banner />);
        expect(tree.find('#feedback-link').prop('href')).toEqual(FEEDBACK_LINK);
    });
});
