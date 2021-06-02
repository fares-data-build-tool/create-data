import * as React from 'react';
import { shallow } from 'enzyme';
import TermTime from '../../src/pages/termTime';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('termTime', () => {
        it('should render correctly', () => {
            const wrapper = shallow(<TermTime errors={[]} csrfToken="" />);
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly', () => {
            const mockError: ErrorInfo[] = [
                {
                    id: 'term-time-yes',
                    errorMessage: 'Choose an option below',
                },
            ];
            const wrapper = shallow(<TermTime errors={mockError} csrfToken="" />);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
