import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';

import { StageNames, defineInputFields, InputCheck } from '../../src/pages/stageNames';
import { FARE_STAGES_COOKIE, OPERATOR_COOKIE } from '../../src/constants';

describe('pages', () => {
    describe('defineInputFields', () => {
        it('should return a base React fragment with no error tags when there is no validation object', () => {
            const mockIndex = 4;
            const mockInputTags = {
                outerDivFormGroupError: '',
                outerDivInputError: '',
                errorSpan: <div />,
                inputFieldError: '',
                fareStageNameError: '',
                defaultValue: '',
            };
            const expectedInputField = (
                <React.Fragment key={mockIndex}>
                    <div
                        className={`govuk-form-group ${mockInputTags.outerDivFormGroupError} ${mockInputTags.outerDivInputError}`}
                    >
                        <label className="govuk-label" htmlFor={`fareStageName${mockIndex}`}>
                            Fare Stage {mockIndex}
                        </label>
                        {mockInputTags.errorSpan}
                        <input
                            className={`govuk-input govuk-input--width-30 ${mockInputTags.inputFieldError} stage-name-input-field`}
                            id={`fareStageName${mockIndex}`}
                            name="stageNameInput"
                            type="text"
                            maxLength={30}
                            defaultValue={mockInputTags.defaultValue}
                            aria-describedby={mockInputTags.fareStageNameError}
                        />
                    </div>
                </React.Fragment>
            );
            const inputField = defineInputFields(mockIndex, mockInputTags);
            expect(inputField).toEqual(expectedInputField);
        });

        it('should return a React fragment containing error tags and no default value when there is a validation object containing errors', () => {
            const mockIndex = 2;
            const mockValidationObject = [
                { Valid: true, Error: '', Input: '' },
                { Valid: false, Error: 'Enter a name for this fare stage', Input: '   ' },
            ];
            const mockInputTags = {
                outerDivFormGroupError: 'govuk-form-group--error',
                outerDivInputError: 'input-error',
                errorSpan: (
                    <span id={`fareStageName${mockIndex}-error`} className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span>{' '}
                        {mockValidationObject[mockIndex - 1].Error}
                    </span>
                ),
                inputFieldError: 'govuk-input--error',
                fareStageNameError: `fareStageName${mockIndex}-error`,
                defaultValue: '',
            };
            const expectedInputField = (
                <React.Fragment key={mockIndex}>
                    <div
                        className={`govuk-form-group ${mockInputTags.outerDivFormGroupError} ${mockInputTags.outerDivInputError}`}
                    >
                        <label className="govuk-label" htmlFor={`fareStageName${mockIndex}`}>
                            Fare Stage {mockIndex}
                        </label>
                        {mockInputTags.errorSpan}
                        <input
                            className={`govuk-input govuk-input--width-30 ${mockInputTags.inputFieldError} stage-name-input-field`}
                            id={`fareStageName${mockIndex}`}
                            name="stageNameInput"
                            type="text"
                            maxLength={30}
                            defaultValue={mockInputTags.defaultValue}
                            aria-describedby={mockInputTags.fareStageNameError}
                        />
                    </div>
                </React.Fragment>
            );
            const inputFields = defineInputFields(mockIndex, mockInputTags);
            expect(inputFields).toEqual(expectedInputField);
        });
    });

    describe('stageNames', () => {
        it('should render correctly when a user first visits the page', () => {
            const mockNumberOfFareStages = '6';
            const mockValidationObject: InputCheck[] = [];
            const tree = shallow(
                <StageNames numberOfFareStages={mockNumberOfFareStages} validationObject={mockValidationObject} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when a user is redirected to the page from itself when incorrect data is entered', () => {
            const mockNumberOfFareStages = '5';
            const mockValidationObject: InputCheck[] = [
                { Valid: true, Error: '', Input: '' },
                { Valid: true, Error: '', Input: '' },
                { Valid: false, Error: 'Enter a name for this fare stage', Input: '' },
                { Valid: true, Error: '', Input: '' },
                { Valid: true, Error: '', Input: '' },
            ];
            const tree = shallow(
                <StageNames numberOfFareStages={mockNumberOfFareStages} validationObject={mockValidationObject} />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly when a user is redirected to the page from itself when no data is entered', () => {
            const mockNumberOfFareStages = '4';
            const mockValidationObject: InputCheck[] = [
                { Valid: false, Error: 'Enter a name for this fare stage', Input: '' },
                { Valid: false, Error: 'Enter a name for this fare stage', Input: '' },
                { Valid: false, Error: 'Enter a name for this fare stage', Input: '' },
                { Valid: false, Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const tree = shallow(
                <StageNames numberOfFareStages={mockNumberOfFareStages} validationObject={mockValidationObject} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('displays a number of input fields which matches the number of fare stages in the fareStagesCookie ', () => {
            const mockNumberOfFareStages = '6';
            const operator = 'HCTY';
            const res = new MockRes();
            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; ${FARE_STAGES_COOKIE}=%7B%22fareStages%22%3A%22${mockNumberOfFareStages}%22%7D`,
                },
                cookies: {
                    FARE_STAGES_COOKIE: `%7B%22fareStages%22%3A%22${mockNumberOfFareStages}%22%7D`,
                    OPERATOR_COOKIE:
                        '%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D',
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
                numberOfFareStages: '6',
                validationObject: [],
            });
        });
    });
});
