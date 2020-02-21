import * as React from 'react';
import { shallow } from 'enzyme';
import PriceEntry from '../../src/pages/priceEntry';

const mockFareStages: string[] = [
    'Briggate',
    'Chapeltown',
    'Chapel Allerton',
    'Moortown',
    'Harrogate Road',
    'Harehills',
    'Gipton',
    'Armley',
    'Stanningley',
    'Pudsey',
    'Seacroft',
    'Rothwell',
    'Dewsbury',
    'Wakefield',
];

describe('pages', () => {
    describe('inputMethod', () => {
        it('should render correctly', () => {
            const tree = shallow(<PriceEntry fareStages={mockFareStages} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
