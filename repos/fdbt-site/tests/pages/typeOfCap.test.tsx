import * as React from 'react';
import { shallow } from 'enzyme';
import TypeOfCap from '../../src/pages/typeOfCap';

describe('pages', () => {
    describe('typeOfCap', () => {
        it('should render correctly', () => {
            const tree = shallow(<TypeOfCap errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed to the page', () => {
            const tree = shallow(
                <TypeOfCap
                    errors={[
                        {
                            errorMessage: 'Choose a type of cap',
                            id: 'radio-option-byDistance',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
