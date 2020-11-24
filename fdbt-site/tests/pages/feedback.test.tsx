import * as React from 'react';
import { shallow } from 'enzyme';
import Feedback from '../../src/pages/feedback';

describe('pages', () => {
    describe('feedback', () => {
        it('should render correctly with feedbackSubmitted false', () => {
            const tree = shallow(<Feedback feedbackSubmitted="false" csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with feedbackSubmitted submitted', () => {
            const tree = shallow(<Feedback feedbackSubmitted="submitted" csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with feedbackSubmitted not submitted', () => {
            const tree = shallow(<Feedback feedbackSubmitted="not submitted" csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });
    });
});
