import * as React from 'react';
import { shallow } from 'enzyme';

import StageNames, { renderInputFields, InputCheck, getServerSideProps } from '../../src/pages/stageNames';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    describe('renderInputFields', () => {
        it('should return a list of html elements that macthes the number of fare stages and inputCheck objects', () => {
            const mockNumberOfFareStages = 4;
            const mockInputCheck: InputCheck[] = [
                { Error: '', Input: 'ab' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: '', Input: 'cd' },
                { Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const renderElements = renderInputFields(mockNumberOfFareStages, mockInputCheck);
            expect(renderElements).toHaveLength(4);
        });

        it('should return a <div> element containing <label> and <input> elements with error tags and no default value when there is an inputCheck object containing errors', () => {
            const mockNumberOfFareStages = 2;
            const mockInputCheck: InputCheck[] = [];
            const renderElements = renderInputFields(mockNumberOfFareStages, mockInputCheck);
            expect(renderElements).toHaveLength(2);
        });
    });

    describe('stageNames', () => {
        it('should render correctly when a user first visits the page', () => {
            const mockNumberOfFareStages = 6;
            const mockInputChecks: InputCheck[] = [];
            const tree = shallow(
                <StageNames
                    numberOfFareStages={mockNumberOfFareStages}
                    inputChecks={mockInputChecks}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when a user is redirected to the page from itself when incorrect data is entered', () => {
            const mockNumberOfFareStages = 5;
            const mockInputChecks: InputCheck[] = [
                { Error: '', Input: '' },
                { Error: '', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: '', Input: '' },
                { Error: '', Input: '' },
            ];
            const tree = shallow(
                <StageNames
                    numberOfFareStages={mockNumberOfFareStages}
                    inputChecks={mockInputChecks}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly when a user is redirected to the page from itself when no data is entered', () => {
            const mockNumberOfFareStages = 4;
            const mockinputChecks: InputCheck[] = [
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const tree = shallow(
                <StageNames
                    numberOfFareStages={mockNumberOfFareStages}
                    inputChecks={mockinputChecks}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('displays a number of input fields which matches the number of fare stages in the fareStagesCookie ', () => {
            const ctx = getMockContext();
            const result = getServerSideProps(ctx);
            expect(result).toEqual({
                props: {
                    numberOfFareStages: 6,
                    inputChecks: [],
                },
            });
        });
    });
});
