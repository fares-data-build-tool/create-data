import * as React from 'react';
import { shallow } from 'enzyme';
import Footer from '../../src/layout/Footer';
import { GOVUK_LINK } from '../../src/constants';

describe('Footer', () => {
    it('should render correctly', () => {
        const tree = shallow(<Footer />);
        expect(tree).toMatchSnapshot();
    });

    it('expect govuk_link to be correct gov.uk', () => {
        const tree = shallow(<Footer />);
        expect(tree.find('#govuk_link').prop('href')).toEqual(GOVUK_LINK);
    });
});
