import * as React from 'react';
import { shallow } from 'enzyme';

import DefinePassengerType, {
    getServerSideProps,
    getFieldsets,
    getNumberOfPassengerTypeFieldset,
} from '../../src/pages/definePassengerType';
import {
    mockDefinePassengerTypeFieldsets,
    mockDefinePassengerTypeFieldsetsWithRadioErrors,
    mockCombinedErrorInfoForRadioErrors,
    mockDefinePassengerTypeFieldsetsWithInputErrors,
    mockCombinedErrorInfoForInputErrors,
    mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors,
    getMockContext,
    mockNumberOfPassengerTypeFieldset,
    mockNumberOfPassengerTypeFieldsetWithErrors,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';
import { GROUP_PASSENGER_TYPES_ATTRIBUTE, GROUP_DEFINITION_ATTRIBUTE } from '../../src/constants';

describe('pages', () => {
    describe('getFieldsets', () => {
        it('should return fieldsets with no errors when no errors are passed', () => {
            const emptyErrors: ErrorInfo[] = [];
            const fieldsets = getFieldsets(emptyErrors);
            expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsets);
        });

        it('should return fieldsets with radio errors when radio errors are passed', () => {
            const radioErrors: ErrorInfo[] = [
                {
                    errorMessage: 'Choose one of the options below',
                    id: 'define-passenger-age-range',
                },
                {
                    errorMessage: 'Choose one of the options below',
                    id: 'define-passenger-proof',
                },
            ];
            const fieldsets = getFieldsets(radioErrors);
            expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithRadioErrors);
        });

        it('should return fieldsets with input errors when input errors are passed', () => {
            const inputErrors: ErrorInfo[] = [
                {
                    errorMessage: 'Enter a minimum or maximum age',
                    id: 'age-range-min',
                },
                {
                    errorMessage: 'Enter a minimum or maximum age',
                    id: 'age-range-max',
                },
                {
                    errorMessage: 'Select at least one proof document',
                    id: 'proof-required',
                    userInput: '',
                },
            ];
            const fieldsets = getFieldsets(inputErrors);
            expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithInputErrors);
        });

        it('should alter the heading content when a passenger type is provided', () => {
            const passengerType = 'adult';
            const emptyErrors: ErrorInfo[] = [];
            const fieldsets = getFieldsets(emptyErrors, passengerType);
            expect(fieldsets[0].heading.content).toEqual('Do adult passengers have an age range?');
            expect(fieldsets[1].heading.content).toEqual('Do adult passengers require a proof document?');
        });
    });

    describe('getNumberOfPassengerTypeFieldset', () => {
        it('should return a fieldset containing two text inputs with no errors when no errors are passed', () => {
            const errors: ErrorInfo[] = [];
            const passengerType = 'child';
            const fieldset = getNumberOfPassengerTypeFieldset(errors, passengerType);
            expect(fieldset).toEqual(mockNumberOfPassengerTypeFieldset);
        });

        it('should return a fieldset containing two text inputs with errors attached when errors are passed', () => {
            const errors: ErrorInfo[] = [
                {
                    id: 'min-number-of-passengers',
                    errorMessage: 'Enter a number between 1 and 30',
                },
                {
                    id: 'max-number-of-passengers',
                    errorMessage: 'Enter a number between 1 and 30',
                },
            ];
            const passengerType = 'adult';
            const fieldset = getNumberOfPassengerTypeFieldset(errors, passengerType);
            expect(fieldset).toEqual(mockNumberOfPassengerTypeFieldsetWithErrors);
        });
    });

    describe('getServerSideProps', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should throw an error if there is no PASSENGER_TYPE_COOKIE and no GROUP_PASSENGER_TYPES_ATTRIBUTE attribute', () => {
            const ctx = getMockContext({ cookies: { passengerType: null } });
            expect(() => getServerSideProps(ctx)).toThrow(
                'Failed to retrieve passenger type details for the define passenger type page',
            );
        });

        it.each([
            ['non-group', {}, { group: false, numberOfPassengerTypeFieldset: undefined }],
            [
                'group',
                {
                    cookies: { passengerType: null },
                    session: {
                        [GROUP_PASSENGER_TYPES_ATTRIBUTE]: ['adult', 'child'],
                    },
                    query: {
                        groupPassengerType: 'child',
                    },
                },
                { group: true, numberOfPassengerTypeFieldset: mockNumberOfPassengerTypeFieldset },
            ],
        ])(
            'should return props containing no errors and valid fieldsets when no errors are present on a %s ticket user journey',
            (_journey, ctxParams, propsParams) => {
                const ctx = getMockContext(ctxParams);

                const result = getServerSideProps(ctx);
                expect(result.props.errors).toEqual([]);
                expect(result.props.fieldsets).toEqual(mockDefinePassengerTypeFieldsets);
                expect(result.props.group).toEqual(propsParams.group);
                expect(result.props.numberOfPassengerTypeFieldset).toEqual(propsParams.numberOfPassengerTypeFieldset);
            },
        );
        it('should return props containing errors and valid fieldsets when radio and input errors are present on a non-group ticket user journey', () => {
            const errors: ErrorInfo[] = [
                { errorMessage: 'Choose one of the options below', id: 'define-passenger-proof' },
                { errorMessage: 'Enter a minimum or maximum age', id: 'age-range-min' },
                { errorMessage: 'Enter a minimum or maximum age', id: 'age-range-max' },
            ];
            const ctx = getMockContext({
                cookies: {
                    passengerType: {
                        passengerType: 'adult',
                        errors,
                    },
                },
            });
            const result = getServerSideProps(ctx);
            expect(result.props.group).toEqual(false);
            expect(result.props.errors).toEqual(errors);
            expect(result.props.fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors);
        });

        it('should return props containing errors and valid fieldsets when radio and all input errors are present on a group ticket user journey', () => {
            const errors: ErrorInfo[] = [
                { errorMessage: 'Choose one of the options below', id: 'define-passenger-proof' },
                { errorMessage: 'Enter a minimum or maximum age', id: 'age-range-min' },
                { errorMessage: 'Enter a minimum or maximum age', id: 'age-range-max' },
                {
                    id: 'min-number-of-passengers',
                    errorMessage: 'Enter a number between 1 and 30',
                },
                {
                    id: 'max-number-of-passengers',
                    errorMessage: 'Enter a number between 1 and 30',
                },
            ];
            const ctx = getMockContext({
                url: '/definePassengerType?groupPassengerType=adult',
                cookies: {
                    passengerType: {
                        passengerType: 'adult',
                        errors,
                    },
                },
                session: {
                    [GROUP_PASSENGER_TYPES_ATTRIBUTE]: ['adult', 'child'],
                    [GROUP_DEFINITION_ATTRIBUTE]: {
                        maxGroupSize: 2,
                        companions: {
                            passengerType: 'child',
                            minNumber: 0,
                            maxNumber: 2,
                            minAge: 16,
                            maxAge: 150,
                            proofDocuments: [],
                        },
                        errors,
                    },
                },
                query: {
                    groupPassengerType: 'adult',
                },
            });
            const result = getServerSideProps(ctx);
            expect(result.props.group).toEqual(true);
            expect(result.props.errors).toEqual(errors);
            expect(result.props.fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors);
            expect(result.props.numberOfPassengerTypeFieldset).toEqual(mockNumberOfPassengerTypeFieldsetWithErrors);
        });
    });

    describe('definePassengerType', () => {
        it('should render correctly when on the non-group ticket user journey', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    group={false}
                    errors={[]}
                    fieldsets={mockDefinePassengerTypeFieldsets}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly when on the group ticket user journey', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    group
                    errors={[]}
                    fieldsets={mockDefinePassengerTypeFieldsets}
                    numberOfPassengerTypeFieldset={mockNumberOfPassengerTypeFieldset}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when radio errors are passed to the page', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    group={false}
                    errors={mockCombinedErrorInfoForRadioErrors}
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
                    group={false}
                    errors={mockCombinedErrorInfoForInputErrors}
                    fieldsets={mockDefinePassengerTypeFieldsetsWithInputErrors}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
