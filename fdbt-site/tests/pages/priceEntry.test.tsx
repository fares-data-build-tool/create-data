import * as React from 'react';
import { shallow } from 'enzyme';
import { getMockContext } from '../testData/mockData';
import PriceEntry, { getServerSideProps } from '../../src/pages/priceEntry';
import { STAGE_NAMES_ATTRIBUTE } from '../../src/constants/attributes';

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
        const tree = shallow(<PriceEntry stageNamesArray={mockFareStages} csrfToken="" />);
        expect(tree).toMatchSnapshot();
    });

    it('throws error if stage names session attribute does not exist', () => {
        const ctx = getMockContext({
            session: {
                [STAGE_NAMES_ATTRIBUTE]: undefined,
            },
        });

        expect(() => getServerSideProps(ctx)).toThrowError('Necessary stage names not found to show price entry page');
    });

    it('throws error if no stage names can be found', () => {
        const ctx = getMockContext({
            session: {
                [STAGE_NAMES_ATTRIBUTE]: [],
            },
        });

        expect(() => getServerSideProps(ctx)).toThrowError('Necessary stage names not found to show price entry page');
    });

    it('does not throw an error if stage names can be found', () => {
        const ctx = getMockContext();

        expect(() => getServerSideProps(ctx)).not.toThrowError();
    });
});
