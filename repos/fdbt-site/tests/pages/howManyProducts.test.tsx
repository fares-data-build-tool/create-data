import * as React from 'react';
import { shallow } from 'enzyme';

import HowManyProducts, { InputCheck } from '../../src/pages/howManyProducts';
import { ErrorInfo } from '../../src/types';

describe('pages', () => {
    describe('howManyProducts', () => {
        const errorCases: InputCheck[] = [
            { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '0' },
            { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '11' },
            { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '99' },
            { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '4.65' },
            { error: 'Enter a number', numberOfProductsInput: 'some strange thing a user would type' },
            { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '' },
            { error: 'Enter a whole number between 1 and 10', numberOfProductsInput: '       ' },
        ];

        it('should render correctly', () => {
            const wrapper = shallow(<HowManyProducts inputCheck={{}} errors={[]} />);
            expect(wrapper).toMatchSnapshot();
        });

        test.each(errorCases)(
            'should render correctly when a user is redirected to the page from itself when incorrect data is entered',
            mockInputCheck => {
                const mockErrors: ErrorInfo[] = [{ errorMessage: mockInputCheck.error || '', id: 'page-heading' }];
                const tree = shallow(<HowManyProducts inputCheck={mockInputCheck} errors={mockErrors} />);
                expect(tree).toMatchSnapshot();
            },
        );
    });
});
