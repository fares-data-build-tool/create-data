import * as React from 'react';
import { shallow } from 'enzyme';

import StageNames, { renderInputFields, InputCheck, getServerSideProps } from '../../src/pages/stageNames';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    describe('renderInputFields', () => {
        it('should return a list of html elements that macthes the number of fare stages and inputCheck objects', () => {
            const mockNumberOfFareStages = 4;
            const mockInputCheck: InputCheck[] = [
                { error: '', input: 'ab' },
                { error: 'Enter a name for this fare stage', input: '' },
                { error: '', input: 'cd' },
                { error: 'Enter a name for this fare stage', input: '' },
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
                { error: '', input: '' },
                { error: '', input: '' },
                { error: 'Enter a name for this fare stage', input: '' },
                { error: '', input: '' },
                { error: '', input: '' },
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
                { error: 'Enter a name for this fare stage', input: '' },
                { error: 'Enter a name for this fare stage', input: '' },
                { error: 'Enter a name for this fare stage', input: '' },
                { error: 'Enter a name for this fare stage', input: '' },
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
