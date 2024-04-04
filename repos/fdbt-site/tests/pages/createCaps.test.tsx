import { shallow } from 'enzyme';
import * as React from 'react';
import { CapExpiryUnit, ProductValidity } from '../../src/interfaces/matchingJsonTypes';
import CreateCaps from '../../src/pages/createCaps';
import { mockSelectCapValidityFieldset } from '../testData/mockData';

describe('pages', () => {
    describe('create caps', () => {
        it('should render correctly', () => {
            const tree = shallow(<CreateCaps errors={[]} csrfToken="" fieldset={mockSelectCapValidityFieldset} />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on input errors', () => {
            const tree = shallow(
                <CreateCaps
                    errors={[{ errorMessage: 'C name cannot have less than 2 characters', id: 'cap-name' }]}
                    csrfToken=""
                    fieldset={mockSelectCapValidityFieldset}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on edit mode', () => {
            const capInfo = {
                name: 'Cap 1',
                price: '2',
                durationAmount: '2',
                durationUnits: 'month' as CapExpiryUnit,
                capExpiry: {
                    productValidity: 'endOfCalendarDay' as ProductValidity,
                    productEndTime: '',
                },
            };
            const tree = shallow(
                <CreateCaps
                    errors={[]}
                    userInput={{ capDetails: capInfo }}
                    editId={1}
                    csrfToken=""
                    fieldset={mockSelectCapValidityFieldset}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
