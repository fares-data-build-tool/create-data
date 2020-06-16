import * as React from 'react';
import { shallow } from 'enzyme';

import DefinePassengerType, {
    getServerSideProps,
    collectErrors,
    getFieldsets,
    ErrorCollection,
} from '../../src/pages/definePassengerType';
import {
    mockDefinePassengerTypeFieldsets,
    mockDefinePassengerTypeFieldsetsWithRadioErrors,
    mockCombinedErrorInfoForRadioErrors,
    mockDefinePassengerTypeFieldsetsWithInputErrors,
    mockCombinedErrorInfoForInputErrors,
    mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors,
    mockCombinedErrorInfoForRadioAndInputErrors,
    getMockContext,
} from '../testData/mockData';
import { ExtractedValidationError } from '../../src/pages/api/definePassengerType';

describe('pages', () => {
    describe('getFieldsets', () => {
        it('should return fieldsets with no errors when no errors are passed', () => {
            const emptyErrors: ErrorCollection = {
                combinedErrors: [],
                ageRangeRadioError: [],
                proofSelectRadioError: [],
                ageRangeInputErrors: [],
                proofSelectInputError: [],
            };
            const fieldsets = getFieldsets(emptyErrors);
            expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsets);
        });

        it('should return fieldsets with radio errors when radio errors are passed', () => {
            const radioErrors: ErrorCollection = {
                combinedErrors: [
                    {
                        errorMessage: 'Choose one of the options below',
                        id: 'define-passenger-age-range',
                    },
                    {
                        errorMessage: 'Choose one of the options below',
                        id: 'define-passenger-proof',
                    },
                ],
                ageRangeRadioError: [
                    {
                        errorMessage: 'Choose one of the options below',
                        id: 'define-passenger-age-range',
                    },
                ],
                proofSelectRadioError: [
                    {
                        errorMessage: 'Choose one of the options below',
                        id: 'define-passenger-proof',
                    },
                ],
                ageRangeInputErrors: [],
                proofSelectInputError: [],
            };
            const fieldsets = getFieldsets(radioErrors);
            expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithRadioErrors);
        });

        it('should return fieldsets with input errors when input errors are passed', () => {
            const inputErrors: ErrorCollection = {
                combinedErrors: [
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'define-passenger-age-range',
                    },
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'define-passenger-age-range',
                    },
                    {
                        errorMessage: 'Select at least one proof document',
                        id: 'define-passenger-proof',
                    },
                ],
                ageRangeRadioError: [],
                proofSelectRadioError: [],
                ageRangeInputErrors: [
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'define-passenger-age-range',
                    },
                    {
                        errorMessage: 'Enter a minimum or maximum age',
                        id: 'define-passenger-age-range',
                    },
                ],
                proofSelectInputError: [
                    {
                        errorMessage: 'Select at least one proof document',
                        id: 'define-passenger-proof',
                    },
                ],
            };
            const fieldsets = getFieldsets(inputErrors);
            expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithInputErrors);
        });
    });

    describe('collectErrors', () => {
        it('should add an error to the collectedErrors array when an error is passed', () => {
            const mockErrorCollection: ErrorCollection = {
                combinedErrors: [],
                ageRangeRadioError: [],
                proofSelectRadioError: [],
                ageRangeInputErrors: [],
                proofSelectInputError: [],
            };
            const expectedErrorCollection: ErrorCollection = {
                combinedErrors: [],
                ageRangeRadioError: [],
                proofSelectRadioError: [],
                ageRangeInputErrors: [],
                proofSelectInputError: [
                    {
                        errorMessage: 'Select at least one proof document',
                        id: 'define-passenger-proof',
                    },
                ],
            };
            const mockValidationError: ExtractedValidationError = {
                input: 'proofDocuments',
                message: 'Select at least one proof document',
            };
            collectErrors(mockValidationError, mockErrorCollection);
            expect(mockErrorCollection).toEqual(expectedErrorCollection);
        });

        it('should throw an error when the error type does not match a case', () => {
            const mockErrorCollection: ErrorCollection = {
                combinedErrors: [],
                ageRangeRadioError: [],
                proofSelectRadioError: [],
                ageRangeInputErrors: [],
                proofSelectInputError: [],
            };
            const mockValidationError: ExtractedValidationError = {
                input: 'fakeError',
                message: 'Throw an error, I dare you',
            };
            expect(() => collectErrors(mockValidationError, mockErrorCollection)).toThrow(
                'Could not match the following error with an expected input.',
            );
        });
    });

    describe('getServerSideProps', () => {
        it('should throw an error if there is no PASSENGER_TYPE_COOKIE', () => {
            const ctx = getMockContext({ cookies: { passengerType: null } });
            expect(() => getServerSideProps(ctx)).toThrow(
                'Failed to retrieve PASSENGER_TYPE_COOKIE for the define passenger type page',
            );
        });

        it('should return props containing no errors and valid fieldsets when no errors are present', () => {
            const ctx = getMockContext();
            const result = getServerSideProps(ctx);
            expect(result.props.combinedErrors).toEqual([]);
            expect(result.props.fieldsets).toEqual(mockDefinePassengerTypeFieldsets);
        });

        it('should return props containing errors and valid fieldsets when radio and input errors are present', () => {
            const mockPassengerTypeCookieValue = {
                passengerType: 'Adult',
                errors: [
                    { input: 'ageRangeMin', message: 'Enter a minimum or maximum age' },
                    { input: 'ageRangeMax', message: 'Enter a minimum or maximum age' },
                    { input: 'proof', message: 'Choose one of the options below' },
                ],
            };
            const ctx = getMockContext({ cookies: { passengerType: mockPassengerTypeCookieValue } });
            const result = getServerSideProps(ctx);
            expect(result.props.combinedErrors).toEqual(mockCombinedErrorInfoForRadioAndInputErrors);
            expect(result.props.fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors);
        });
    });

    describe('definePassengerType', () => {
        it('should render correctly', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    combinedErrors={[]}
                    fieldsets={mockDefinePassengerTypeFieldsets}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when radio errors are passed to the page', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    combinedErrors={mockCombinedErrorInfoForRadioErrors}
                    fieldsets={mockDefinePassengerTypeFieldsetsWithRadioErrors}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when input errors are passed to the page', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    combinedErrors={mockCombinedErrorInfoForInputErrors}
                    fieldsets={mockDefinePassengerTypeFieldsetsWithInputErrors}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
