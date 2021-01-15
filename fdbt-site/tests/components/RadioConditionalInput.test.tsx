import { shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import { ErrorInfo } from '../../src/interfaces';
import RadioConditionalInput, {
    RadioConditionalInputFieldset,
    renderConditionalTextInput,
    RadioWithConditionalInputs,
    renderConditionalTextWithUnitsInput,
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

    it('should hide the radio button heading when the fieldset has a hidden flag set', () => {
        const fieldset: RadioConditionalInputFieldset = {
            heading: {
                id: 'define-passenger-age-range',
                content: 'Does the passenger type have an age range?',
                hidden: true,
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
                    inputHint: { id: 'define-passenger-hint', content: 'Enter a minimum age for this passenger type.' },
                    inputType: 'text',
                    inputs: [
                        {
                            id: 'age-range-min',
                            name: 'ageRangeMin',
                            label: 'Minimum age (if applicable)',
                            defaultValue: '',
                        },
                    ],
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
            const mockRadio: RadioWithConditionalInputs = {
                id: 'age-range-required',
                name: 'ageRange',
                value: 'Yes',
                label: 'Yes',
                dataAriaControls: 'age-range-required-conditional',
                inputHint: { id: 'define-passenger-hint', content: 'Enter a minimum age for this passenger type.' },
                inputType: 'text',
                inputs: [
                    { id: 'age-range-min', name: 'ageRangeMin', label: 'Minimum age (if applicable)' },
                    { id: 'age-range-max', name: 'ageRangeMax', label: 'Maximum age (if applicable)' },
                ],
                inputErrors,
            };
            const textInputElements: ReactElement = renderConditionalTextInput(mockRadio);
            const ageRangeMinTextInput = textInputElements.props.children.props.children[1][0];
            const ageRangeMinFormElementWrapper = ageRangeMinTextInput.props.children[1];

            expect(textInputElements.props.className).toBe('govuk-radios__conditional');
            expect(ageRangeMinTextInput.props.className).toBe('govuk-form-group govuk-form-group--error');
            expect(ageRangeMinFormElementWrapper.props.errors).toBe(inputErrors);
            expect(ageRangeMinFormElementWrapper.props.errorId).toBe(inputErrors[0].id);
        });
    });

    describe('renderConditionalTextWithUnitsInput', () => {
        it("should render a text input when the input id contains 'amount'", () => {
            const mockRadio: RadioWithConditionalInputs = {
                id: 'return-validity-defined',
                name: 'validity',
                value: 'Yes',
                dataAriaControls: 'return-validity-defined-conditional',
                label: 'Yes',
                inputHint: {
                    id: 'define-return-validity-hint',
                    content: 'Enter an amount and select a duration from the dropdown',
                },
                inputType: 'textWithUnits',
                inputs: [
                    {
                        id: 'return-validity-amount',
                        name: 'amount',
                        label: 'Amount',
                    },
                ],
                inputErrors: [],
            };
            const textInputElements: ReactElement = renderConditionalTextWithUnitsInput(mockRadio);
            const inputFormGroup = textInputElements.props.children.props.children[1][0];
            const inputFormElementWrapper = inputFormGroup.props.children[1];
            expect(inputFormElementWrapper.props.children.type).toEqual('input');
        });

        it('should render a text input and a dropdown when two inputs are present', () => {
            const mockRadio: RadioWithConditionalInputs = {
                id: 'return-validity-defined',
                name: 'validity',
                value: 'Yes',
                dataAriaControls: 'return-validity-defined-conditional',
                label: 'Yes',
                inputHint: {
                    id: 'define-return-validity-hint',
                    content: 'Enter an amount and select a duration from the dropdown',
                },
                inputType: 'textWithUnits',
                inputs: [
                    {
                        id: 'return-validity-amount',
                        name: 'amount',
                        label: 'Amount',
                    },
                    {
                        id: 'return-validity-units',
                        name: 'duration',
                        label: 'Duration',
                        options: ['days', 'weeks', 'months', 'years'],
                    },
                ],
                inputErrors: [],
            };
            const textInputElements: ReactElement = renderConditionalTextWithUnitsInput(mockRadio);
            const textInputFormGroup = textInputElements.props.children.props.children[1][0];
            const selectInputFormGroup = textInputElements.props.children.props.children[1][1];
            const textInputFormElementWrapper = textInputFormGroup.props.children[1];
            const selectInputFormElementWrapper = selectInputFormGroup.props.children[1];

            expect(textInputFormElementWrapper.props.children.type).toEqual('input');
            expect(selectInputFormElementWrapper.props.children.type).toEqual('select');
        });

        it('should add error highlighting to the text input and dropdown when errors are present', () => {
            const inputErrors: ErrorInfo[] = [
                {
                    errorMessage: 'Choose one of the options from the dropdown list',
                    id: 'return-validity-units',
                },
                {
                    errorMessage: 'Enter a whole number',
                    id: 'return-validity-amount',
                },
            ];
            const mockRadio: RadioWithConditionalInputs = {
                id: 'return-validity-defined',
                name: 'validity',
                value: 'Yes',
                dataAriaControls: 'return-validity-defined-conditional',
                label: 'Yes',
                inputHint: {
                    id: 'define-return-validity-hint',
                    content: 'Enter an amount and select a duration from the dropdown',
                },
                inputType: 'textWithUnits',
                inputs: [
                    {
                        id: 'return-validity-amount',
                        name: 'amount',
                        label: 'Amount',
                    },
                    {
                        id: 'return-validity-units',
                        name: 'duration',
                        label: 'Duration',
                        options: ['days', 'weeks', 'months', 'years'],
                    },
                ],
                inputErrors,
            };
            const textInputElements: ReactElement = renderConditionalTextWithUnitsInput(mockRadio);
            const textInputFormGroup = textInputElements.props.children.props.children[1][0];
            const selectInputFormGroup = textInputElements.props.children.props.children[1][1];
            const textInputFormElementWrapper = textInputFormGroup.props.children[1];
            const selectInputFormElementWrapper = selectInputFormGroup.props.children[1];

            expect(textInputFormGroup.props.className).toEqual('govuk-form-group govuk-form-group--error');
            expect(selectInputFormGroup.props.className).toEqual('govuk-form-group govuk-form-group--error');
            expect(textInputFormElementWrapper.props.errors).toBe(inputErrors);
            expect(selectInputFormElementWrapper.props.errors).toBe(inputErrors);
        });
    });
});
