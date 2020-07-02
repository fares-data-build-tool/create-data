import * as React from 'react';
import { shallow } from 'enzyme';

import StageNames, {
    renderInputFields,
    InputCheck,
    getServerSideProps,
    filterErrors,
} from '../../src/pages/stageNames';
import { getMockContext } from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('renderInputFields', () => {
        it('should return a list of html elements that matches the number of fare stages and inputCheck objects', () => {
            const mockNumberOfFareStages = 4;
            const mockInputCheck: InputCheck[] = [
                { error: '', input: 'ab', id: 'fare-stage-name-1' },
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-2' },
                { error: '', input: 'cd', id: 'fare-stage-name-3' },
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-4' },
            ];
            const renderElements = renderInputFields(mockNumberOfFareStages, mockInputCheck, []);
            expect(renderElements).toHaveLength(4);
        });

        it('should return a <div> element containing <label> and <input> elements with error tags and no default value when there is an inputCheck object containing errors', () => {
            const mockNumberOfFareStages = 2;
            const mockInputCheck: InputCheck[] = [];
            const renderElements = renderInputFields(mockNumberOfFareStages, mockInputCheck, []);
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
                    errors={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when a user is redirected to the page from itself when incorrect data is entered', () => {
            const mockNumberOfFareStages = 5;
            const mockInputChecks: InputCheck[] = [
                { error: '', input: '', id: 'fare-stage-name-1' },
                { error: '', input: '', id: 'fare-stage-name-2' },
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-3' },
                { error: '', input: '', id: 'fare-stage-name-4' },
                { error: '', input: '', id: 'fare-stage-name-5' },
            ];
            const tree = shallow(
                <StageNames
                    numberOfFareStages={mockNumberOfFareStages}
                    inputChecks={mockInputChecks}
                    csrfToken=""
                    pageProps={[]}
                    errors={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly when a user is redirected to the page from itself when no data is entered', () => {
            const mockNumberOfFareStages = 4;
            const mockinputChecks: InputCheck[] = [
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-1' },
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-2' },
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-3' },
                { error: 'Enter a name for this fare stage', input: '', id: 'fare-stage-name-4' },
            ];
            const tree = shallow(
                <StageNames
                    numberOfFareStages={mockNumberOfFareStages}
                    inputChecks={mockinputChecks}
                    csrfToken=""
                    pageProps={[]}
                    errors={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('displays a number of input fields which matches the number of fare stages in the fareStagesCookie ', () => {
            const ctx = getMockContext();
            const result = getServerSideProps(ctx);
            expect(result).toEqual({
                props: {
                    errors: [],
                    numberOfFareStages: 6,
                    inputChecks: [],
                },
            });
        });
        describe('filter errors', () => {
            it('changes an error info array into a unique error info array, as it removes duplicates', () => {
                const arrayOfErrors: ErrorInfo[] = [
                    { errorMessage: 'Message One', id: 'id1' },
                    { errorMessage: 'Message One', id: 'id2' },
                    { errorMessage: 'Message Two', id: 'id3' },
                ];
                const result = filterErrors(arrayOfErrors);

                expect(result).toStrictEqual([
                    { errorMessage: 'Message One', id: 'id1' },
                    { errorMessage: 'Message Two', id: 'id3' },
                ]);
            });
            it('does not alter arrays with no duplicates', () => {
                const arrayOfErrors: ErrorInfo[] = [
                    { errorMessage: 'Message One', id: 'id1' },
                    { errorMessage: 'Message Two', id: 'id2' },
                    { errorMessage: 'Message Three', id: 'id3' },
                ];
                const result = filterErrors(arrayOfErrors);

                expect(result).toStrictEqual([
                    { errorMessage: 'Message One', id: 'id1' },
                    { errorMessage: 'Message Two', id: 'id2' },
                    { errorMessage: 'Message Three', id: 'id3' },
                ]);
            });
            it('only removes duplicate error messages, not ids', () => {
                const arrayOfErrors: ErrorInfo[] = [
                    { errorMessage: 'Message One', id: 'id1' },
                    { errorMessage: 'Message Two', id: 'id1' },
                    { errorMessage: 'Message Three', id: 'id1' },
                ];
                const result = filterErrors(arrayOfErrors);

                expect(result).toStrictEqual([
                    { errorMessage: 'Message One', id: 'id1' },
                    { errorMessage: 'Message Two', id: 'id1' },
                    { errorMessage: 'Message Three', id: 'id1' },
                ]);
            });
        });
    });
});
