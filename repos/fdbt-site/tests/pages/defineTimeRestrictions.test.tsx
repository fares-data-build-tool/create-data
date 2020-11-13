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
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../src/constants';
import { TimeRestrictionsDefinitionWithErrors } from '../../src/pages/api/defineTimeRestrictions';

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
                const fieldsets = getFieldsets(emptyErrors);
                expect(fieldsets).toEqual(mockDefineTimeRestrictionsFieldsets);
            });

            it('should return fieldsets radio errors when errors are passed', () => {
                const fieldsets = getFieldsets(mockTimeRestrictionsRadioErrors);
                expect(fieldsets).toEqual(mockDefineTimeRestrictionsFieldsetsWithRadioErrors);
            });
        });

        describe('getServerSideProps', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });

            it('should return props containing no errors and valid fieldsets when no errors are present', () => {
                const ctx = getMockContext();
                const result = getServerSideProps(ctx);
                expect(result.props.errors).toEqual([]);
                expect(result.props.fieldsets).toEqual(mockDefineTimeRestrictionsFieldsets);
            });
            it('should return props containing errors and valid fieldsets when errors are present', () => {
                const timeRestrictionsDefinition: TimeRestrictionsDefinitionWithErrors = {
                    validDays: ['monday', 'tuesday'],
                    errors: mockTimeRestrictionsInputErrors,
                };
                const ctx = getMockContext({
                    session: {
                        [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: timeRestrictionsDefinition,
                    },
                });
                const result = getServerSideProps(ctx);
                expect(result.props.errors).toEqual(mockTimeRestrictionsInputErrors);
                expect(result.props.fieldsets).toEqual(mockDefineTimeRestrictionsFieldsetsWithInputErrors);
            });
        });
    });
});
