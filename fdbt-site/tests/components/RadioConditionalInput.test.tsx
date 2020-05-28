import { shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import { ErrorInfo } from '../../src/types';
import RadioConditionalInput, {
    RadioConditionalInputFieldset,
    renderConditionalTextInput,
} from '../../src/components/RadioConditionalInput';

describe('RadioConditionalInput', () => {
    it('should render an ordinary set of radio buttons when given a base fieldset', () => {
        const fieldset: RadioConditionalInputFieldset = {
            heading: {
                id: 'define-passenger-age-range',
                content: 'Does the passenger type have an age range?',
            },
            radios: [
                { id: 'age-range-required', name: 'ageRange', value: 'Yes', label: 'Yes' },
                { id: 'age-range-not-required', name: 'ageRange', value: 'No', label: 'No' },
            ],
            radioError: [],
        };
        const wrapper = shallow(<RadioConditionalInput fieldset={fieldset} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a set of radio buttons with conditional inputs when given a fieldset referencing inputs', () => {
        const fieldset: RadioConditionalInputFieldset = {
            heading: {
                id: 'define-passenger-age-range',
                content: 'Does the passenger type have an age range?',
            },
            radios: [
                {
                    id: 'age-range-required',
                    name: 'ageRange',
                    value: 'Yes',
                    label: 'Yes',
                    dataAriaControls: 'age-range-required-conditional',
                    hint: { id: 'define-passenger-hint', content: 'Enter a minimum age for this passenger type.' },
                    inputType: 'text',
                    inputs: [{ id: 'age-range-min', name: 'ageRangeMin', label: 'Minimum age (if applicable)' }],
                    inputErrors: [],
                },
                { id: 'age-range-not-required', name: 'ageRange', value: 'No', label: 'No' },
            ],
            radioError: [],
        };
        const wrapper = shallow(<RadioConditionalInput fieldset={fieldset} />);
        expect(wrapper).toMatchSnapshot();
    });

    describe('renderConditionalTextInput', () => {
        it('should attach error messaging to an input field when an input error is present for that field', () => {
            const inputErrors: ErrorInfo[] = [
                {
                    errorMessage: 'Enter a minimum or maximum age',
                    id: 'age-range-min',
                },
            ];
            const mockRadio = {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                label: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                hint: { id: 'define-passenger-hint', content: 'Enter a minimum age for this passenger type.' },
                inputType: 'text',
                inputs: [
                    { id: 'age-range-min', name: 'ageRangeMin', label: 'Minimum age (if applicable)' },
                    { id: 'age-range-max', name: 'ageRangeMax', label: 'Maximum age (if applicable)' },
                ],
                inputErrors,
            };
            const textInputElements: ReactElement = renderConditionalTextInput(mockRadio);
            const ageRangeMinTextInput = textInputElements.props.children[1][0];
            const ageRangeMinFormElementWrapper = ageRangeMinTextInput.props.children[1];

            expect(textInputElements.props.className).toBe('govuk-radios__conditional');
            expect(ageRangeMinTextInput.props.className).toBe('govuk-form-group govuk-form-group--error');
            expect(ageRangeMinFormElementWrapper.props.errors).toBe(inputErrors);
            expect(ageRangeMinFormElementWrapper.props.errorId).toBe(inputErrors[0].id);
        });
    });
});
