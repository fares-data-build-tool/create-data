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
    mockPassengerTypeInputErrors,
    mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors,
    getMockContext,
    mockNumberOfPassengerTypeFieldset,
    mockNumberOfPassengerTypeFieldsetWithErrors,
    mockAdultServerSideProps,
    mockAdultDefinePassengerTypeFieldsetsWithRadioAndInputErrors,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';
import {
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    GROUP_DEFINITION_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
} from '../../src/constants/attributes';

describe('pages', () => {
    const defaultPassengerType = 'child';

    describe('definePassengerType', () => {
        it('should render correctly when on the non-group ticket user journey', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    group={false}
                    errors={[]}
                    fieldsets={mockDefinePassengerTypeFieldsets}
                    passengerType="adult"
                    csrfToken=""
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
                    passengerType="senior"
                    csrfToken=""
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
                    passengerType="infant"
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when input errors are passed to the page', () => {
            const wrapper = shallow(
                <DefinePassengerType
                    group={false}
                    errors={mockPassengerTypeInputErrors}
                    fieldsets={mockDefinePassengerTypeFieldsetsWithInputErrors}
                    passengerType="child"
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        describe('getFieldsets', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldsets(emptyErrors, defaultPassengerType);
                expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsets);
            });

            it('should return fieldsets with radio errors when radio errors are passed', () => {
                const radioErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Choose one of the options below',
                        id: 'age-range-required',
                    },
                    {
                        errorMessage: 'Choose one of the options below',
                        id: 'proof-required',
                    },
                ];
                const fieldsets = getFieldsets(radioErrors, defaultPassengerType);
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
                        id: 'membership-card',
                    },
                ];
                const fieldsets = getFieldsets(inputErrors, defaultPassengerType);
                expect(fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithInputErrors);
            });

            it('should alter the heading content when a passenger type is provided', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldsets(emptyErrors, defaultPassengerType);
                expect(fieldsets[0].heading.content).toEqual('Do child passengers have an age range?');
                expect(fieldsets[1].heading.content).toEqual('Do child passengers require a proof document?');
            });

            it('should not render the proof documents if the passenger type is adult', () => {
                const passengerType = 'adult';
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldsets(emptyErrors, passengerType);

                expect(fieldsets).toEqual([
                    {
                        heading: {
                            id: expect.any(String),
                            content: expect.any(String),
                        },
                        radios: expect.any(Array),
                        radioError: expect.any(Array),
                    },
                ]);
            });
        });

        describe('getNumberOfPassengerTypeFieldset', () => {
            it('should return a fieldset containing two text inputs with no errors when no errors are passed', () => {
                const errors: ErrorInfo[] = [];
                const fieldset = getNumberOfPassengerTypeFieldset(errors, defaultPassengerType);
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
                const fieldset = getNumberOfPassengerTypeFieldset(errors, defaultPassengerType);
                expect(fieldset).toEqual(mockNumberOfPassengerTypeFieldsetWithErrors);
            });
        });

        describe('getServerSideProps', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });

            it('should throw an error if there is no PASSENGER_TYPE_ATTRIBUTE and no GROUP_PASSENGER_TYPES_ATTRIBUTE attribute', () => {
                const ctx = getMockContext({ session: { [PASSENGER_TYPE_ATTRIBUTE]: undefined } });
                expect(() => getServerSideProps(ctx)).toThrow(
                    'Failed to retrieve passenger type details for the define passenger type page',
                );
            });

            it.each([
                ['non-group', {}, { group: false, numberOfPassengerTypeFieldset: undefined }],
                [
                    'group',
                    {
                        cookies: {},
                        session: {
                            [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
                            [GROUP_PASSENGER_TYPES_ATTRIBUTE]: { passengerTypes: ['adult', 'child'] },
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
                    expect(result.props.numberOfPassengerTypeFieldset).toEqual(
                        propsParams.numberOfPassengerTypeFieldset,
                    );
                },
            );
            it('should not render the proof fieldset if user type is adult', () => {
                const ctx = getMockContext({
                    session: {
                        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'adult' },
                    },
                });

                const result = getServerSideProps(ctx);
                expect(result.props.fieldsets).toEqual(mockAdultServerSideProps);
            });
            it('should not render the last group page section if not a group', () => {
                const ctx = getMockContext({
                    session: {
                        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'adult' },
                    },
                });

                const result = getServerSideProps(ctx);
                expect(result.props.isLast).toBe(false);
            });
            it('should render the last group page section if a group on the last page', () => {
                const ctx = getMockContext({
                    url: '/definePassengerType?groupPassengerType=child',
                    session: {
                        [GROUP_PASSENGER_TYPES_ATTRIBUTE]: { passengerTypes: ['adult', 'child'] },
                        [GROUP_PASSENGER_INFO_ATTRIBUTE]: [{ passengerType: 'adult' }, { passengerType: 'child' }],
                        [GROUP_DEFINITION_ATTRIBUTE]: {
                            maxGroupSize: 2,
                        },
                        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
                    },
                    query: {
                        groupPassengerType: 'child',
                    },
                });

                const result = getServerSideProps(ctx);
                expect(result.props.isLast).toBe(true);
            });
            it('should not render the last group page section if a group on a page other than the last', () => {
                const ctx = getMockContext({
                    url: '/definePassengerType?groupPassengerType=adult',
                    session: {
                        [GROUP_PASSENGER_TYPES_ATTRIBUTE]: { passengerTypes: ['adult', 'child'] },
                        [GROUP_PASSENGER_INFO_ATTRIBUTE]: [{ passengerType: 'adult' }, { passengerType: 'child' }],
                        [GROUP_DEFINITION_ATTRIBUTE]: {
                            maxGroupSize: 2,
                        },
                        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
                    },
                    query: {
                        groupPassengerType: 'adult',
                    },
                });

                const result = getServerSideProps(ctx);
                expect(result.props.isLast).toBe(false);
            });
            it('should return props containing errors and valid fieldsets when radio and input errors are present on a non-group ticket user journey', () => {
                const errors: ErrorInfo[] = [
                    { errorMessage: 'Enter a minimum or maximum age', id: 'age-range-min' },
                    { errorMessage: 'Enter a minimum or maximum age', id: 'age-range-max' },
                ];
                const ctx = getMockContext({
                    session: {
                        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'adult' },
                        [DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE]: { passengerType: 'adult', errors },
                    },
                });
                const result = getServerSideProps(ctx);
                expect(result.props.group).toEqual(false);
                expect(result.props.errors).toEqual(errors);
                expect(result.props.fieldsets).toEqual(mockAdultDefinePassengerTypeFieldsetsWithRadioAndInputErrors);
            });

            it('should return props containing errors and valid fieldsets when radio and all input errors are present on a group ticket user journey', () => {
                const errors: ErrorInfo[] = [
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
                    session: {
                        [GROUP_PASSENGER_TYPES_ATTRIBUTE]: { passengerTypes: ['adult', 'child'] },
                        [GROUP_DEFINITION_ATTRIBUTE]: {
                            maxGroupSize: 2,
                            companions: [
                                {
                                    passengerType: 'child',
                                    minNumber: 0,
                                    maxNumber: 2,
                                    minAge: 16,
                                    maxAge: 150,
                                    proofDocuments: [],
                                },
                            ],
                        },
                        [PASSENGER_TYPE_ATTRIBUTE]: { passengerType: 'group' },
                        [DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE]: { errors, passengerType: 'child' },
                    },
                    query: {
                        groupPassengerType: 'child',
                    },
                });
                const result = getServerSideProps(ctx);
                expect(result.props.group).toEqual(true);
                expect(result.props.errors).toEqual(errors);
                expect(result.props.fieldsets).toEqual(mockDefinePassengerTypeFieldsetsWithRadioAndInputErrors);
                expect(result.props.numberOfPassengerTypeFieldset).toEqual(mockNumberOfPassengerTypeFieldsetWithErrors);
            });
        });
    });
});
