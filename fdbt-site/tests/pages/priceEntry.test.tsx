import * as React from 'react';
import { shallow } from 'enzyme';
import { getMockContext } from '../testData/mockData';
import PriceEntry, { getServerSideProps } from '../../src/pages/priceEntry';

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

describe('Price Entry Page', () => {
    it('should render correctly', () => {
        const tree = shallow(<PriceEntry stageNamesArray={mockFareStages} csrfToken="" pageProps={[]} />);
        expect(tree).toMatchSnapshot();
    });

    it('throws error if stage names cookie does not exist', () => {
        const ctx = getMockContext({
            cookies: {
                stageNames: null,
            },
        });
        expect(() => getServerSideProps(ctx)).toThrowError();
    });
});
