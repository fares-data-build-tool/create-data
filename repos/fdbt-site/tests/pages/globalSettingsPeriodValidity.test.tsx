import * as React from 'react';
import { shallow } from 'enzyme';
import PeriodValidity, { getFieldset } from '../../src/pages/selectPeriodValidity';
import {
    mockSelectPeriodValidityFieldset,
    mockSelectPeriodValidityFieldsetWithErrors,
    mockSelectPeriodValidityFieldsetWithInputErrors,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('periodValidity', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <PeriodValidity errors={[]} csrfToken="" fieldset={mockSelectPeriodValidityFieldset} backHref="" />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <PeriodValidity
                    errors={[
                        {
                            errorMessage: 'Choose an option regarding your period ticket validity',
                            id: 'period-validity-error',
                        },
                    ]}
                    csrfToken=""
                    fieldset={mockSelectPeriodValidityFieldset}
                    backHref=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getFieldset', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldset(emptyErrors, '');
                expect(fieldsets).toEqual(mockSelectPeriodValidityFieldset);
            });

            it('should return fieldsets with radio errors when radio errors are passed', () => {
                const radioErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Choose one of the validity options',
                        id: 'period-end-calendar',
                    },
                ];
                const fieldsets = getFieldset(radioErrors, '');
                expect(fieldsets).toEqual(mockSelectPeriodValidityFieldsetWithErrors);
            });

            it('should return fieldsets with input errors when input errors are passed', () => {
                const inputErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Specify an end time for service day',
                        id: 'product-end-time',
                    },
                ];
                const fieldsets = getFieldset(inputErrors, '');
                expect(fieldsets).toEqual(mockSelectPeriodValidityFieldsetWithInputErrors);
            });
        });
    });
});
