import * as React from 'react';
import { shallow } from 'enzyme';
import HowManyProducts from '../../src/pages/howManyProducts';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('howManyProducts', () => {
        const errorCases: ErrorInfo[][] = [
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '0' }],
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '11' }],
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '99' }],
            [
                {
                    id: 'how-many-products-error',
                    errorMessage: 'Enter a whole number between 1 and 10',
                    userInput: '4.65',
                },
            ],
            [
                {
                    id: 'how-many-products-error',
                    errorMessage: 'Enter a whole number between 1 and 10',
                    userInput: 'some strange thing a user would type',
                },
            ],
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '' }],
            [
                {
                    id: 'how-many-products-error',
                    errorMessage: 'Enter a whole number between 1 and 10',
                    userInput: '       ',
                },
            ],
        ];

        it('should render correctly for non multi op', () => {
            const wrapper = shallow(<HowManyProducts multiOp errors={[]} csrfToken="" pageProps={[]} />);
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly for multi op', () => {
            const wrapper = shallow(<HowManyProducts multiOp={false} errors={[]} csrfToken="" pageProps={[]} />);
            expect(wrapper).toMatchSnapshot();
        });

        test.each(errorCases)(
            'should render correctly when a user is redirected to the page from itself when incorrect data is entered (non-multiOp)',
            mockError => {
                const tree = shallow(
                    <HowManyProducts multiOp={false} errors={[mockError]} csrfToken="" pageProps={[]} />,
                );
                expect(tree).toMatchSnapshot();
            },
        );
        test.each(errorCases)(
            'should render correctly when a user is redirected to the page from itself when incorrect data is entered (multiOp)',
            mockError => {
                const tree = shallow(<HowManyProducts multiOp errors={[mockError]} csrfToken="" pageProps={[]} />);
                expect(tree).toMatchSnapshot();
            },
        );
    });
});
