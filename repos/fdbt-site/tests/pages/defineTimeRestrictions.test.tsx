import * as React from 'react';
import { shallow } from 'enzyme';

import DefineTimeRestrictions, { getServerSideProps, getFieldsets } from '../../src/pages/defineTimeRestrictions';
import {
    mockDefineTimeRestrictionsFieldsets,
    mockDefineTimeRestrictionsFieldsetsWithRadioErrors,
    mockDefineTimeRestrictionsFieldsetsWithInputErrors,
    mockDefineTimeRestrictionsFieldsetsWithRadioAndInputErrors,
    mockTimeRestrictionsRadioErrors,
    mockTimeRestrictionsInputErrors,
    mockTimeRestrictionsRadioAndInputErrors,
    getMockContext,
    mockDefineTimeRestrictionsFieldsetsWithoutPremade,
    mockIdTokenMultiple,
} from '../testData/mockData';
import { ErrorInfo, TimeRestrictionsDefinitionWithErrors } from '../../src/interfaces';
import { OPERATOR_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../src/constants/attributes';
import { getTimeRestrictionByNocCode } from '../../src/data/auroradb';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('defineTimeRestrictions', () => {
        it('should render correctly when no errors are passed', () => {
            const wrapper = shallow(
                <DefineTimeRestrictions errors={[]} fieldsets={mockDefineTimeRestrictionsFieldsets} csrfToken="" />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when radio errors are passed to the page', () => {
            const wrapper = shallow(
                <DefineTimeRestrictions
                    errors={mockTimeRestrictionsRadioErrors}
                    fieldsets={mockDefineTimeRestrictionsFieldsetsWithRadioErrors}
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when input errors are passed to the page', () => {
            const wrapper = shallow(
                <DefineTimeRestrictions
                    errors={mockTimeRestrictionsInputErrors}
                    fieldsets={mockDefineTimeRestrictionsFieldsetsWithInputErrors}
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render errors correctly when both radio and input errors are passed to the page', () => {
            const wrapper = shallow(
                <DefineTimeRestrictions
                    errors={mockTimeRestrictionsRadioAndInputErrors}
                    fieldsets={mockDefineTimeRestrictionsFieldsetsWithRadioAndInputErrors}
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        describe('getFieldsets', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldsets(emptyErrors, []);
                expect(fieldsets).toEqual(mockDefineTimeRestrictionsFieldsetsWithoutPremade);
            });

            it('should return fieldsets radio errors when errors are passed', () => {
                const fieldsets = getFieldsets(mockTimeRestrictionsRadioErrors, []);
                expect(fieldsets).toEqual(mockDefineTimeRestrictionsFieldsetsWithRadioErrors);
            });

            it('should return fieldsets with time restrictions when some are found', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldsets(emptyErrors, ['Test Time restriction']);
                expect(fieldsets).toEqual(mockDefineTimeRestrictionsFieldsets);
            });
        });

        describe('getServerSideProps', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });

            it('should return props containing a premade time restriction when one is found in the DB', async () => {
                (getTimeRestrictionByNocCode as jest.Mock).mockImplementation(() => [
                    {
                        name: 'Test Time restriction',
                        contents: [
                            {
                                day: 'monday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '1000',
                                    },
                                ],
                            },
                        ],
                    },
                ]);
                const ctx = getMockContext({
                    cookies: {
                        idToken: mockIdTokenMultiple,
                    },
                    session: {
                        [OPERATOR_ATTRIBUTE]: { name: 'test', nocCode: 'HELLO', uuid: 'blah' },
                    },
                });
                const result = await getServerSideProps(ctx);
                expect(result.props.errors).toEqual([]);
                expect(result.props.fieldsets).toEqual(mockDefineTimeRestrictionsFieldsets);

                expect(getTimeRestrictionByNocCode).toBeCalledWith('HELLO');
            });
            it('should return props containing errors and valid fieldsets when errors are present', async () => {
                (getTimeRestrictionByNocCode as jest.Mock).mockImplementation(() => []);
                const timeRestrictionsDefinition: TimeRestrictionsDefinitionWithErrors = {
                    validDays: ['monday', 'tuesday'],
                    errors: mockTimeRestrictionsInputErrors,
                };
                const ctx = getMockContext({
                    session: {
                        [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: timeRestrictionsDefinition,
                    },
                });
                const result = await getServerSideProps(ctx);
                expect(result.props.errors).toEqual(mockTimeRestrictionsInputErrors);
                expect(result.props.fieldsets).toEqual(mockDefineTimeRestrictionsFieldsetsWithInputErrors);
            });
        });
    });
});
