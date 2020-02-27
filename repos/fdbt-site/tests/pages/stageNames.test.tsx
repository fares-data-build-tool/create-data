import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';

import { StageNames, renderInputFields, InputCheck } from '../../src/pages/stageNames';
import { FARE_STAGES_COOKIE, OPERATOR_COOKIE } from '../../src/constants';

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
        const mockOperatorCookie =
            '%7B%22operator%22%3A%22HCTY%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D';
        const mockFareStagesCookie = '%7B%22fareStages%22%3A%226%22%7D';
        const mockCombinedCookie = `${OPERATOR_COOKIE}=${mockOperatorCookie}; ${FARE_STAGES_COOKIE}=${mockFareStagesCookie}`;

        it('should render correctly when a user first visits the page', () => {
            const mockNumberOfFareStages = 6;
            const mockInputChecks: InputCheck[] = [];
            const tree = shallow(
                <StageNames numberOfFareStages={mockNumberOfFareStages} inputChecks={mockInputChecks} />,
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
                <StageNames numberOfFareStages={mockNumberOfFareStages} inputChecks={mockInputChecks} />,
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
                <StageNames numberOfFareStages={mockNumberOfFareStages} inputChecks={mockinputChecks} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('displays a number of input fields which matches the number of fare stages in the fareStagesCookie ', () => {
            const res = new MockRes();
            const req = mockRequest({
                connection: {
                    encrypted: true,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: mockCombinedCookie,
                },
                cookies: {
                    FARE_STAGES_COOKIE: mockFareStagesCookie,
                    OPERATOR_COOKIE: mockOperatorCookie,
                },
            });
            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = StageNames.getInitialProps(ctx);
            expect(result).toEqual({
                numberOfFareStages: 6,
                inputChecks: [],
            });
        });
    });
});
