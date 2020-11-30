import * as React from 'react';
import { shallow } from 'enzyme';
import PeriodValidity, { getFieldset } from '../../src/pages/periodValidity';
import {
    mockPeriodValidityFieldset,
    mockPeriodValidityFieldsetWithErrors,
    mockPeriodValidityFieldsetWithInputErrors,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('periodValidity', () => {
        it('should render correctly', () => {
            const tree = shallow(<PeriodValidity errors={[]} csrfToken="" fieldset={mockPeriodValidityFieldset} />);
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
                    fieldset={mockPeriodValidityFieldset}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getFieldset', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldset(emptyErrors);
                expect(fieldsets).toEqual(mockPeriodValidityFieldset);
            });

            it('should return fieldsets with radio errors when radio errors are passed', () => {
                const radioErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Choose one of the validity options',
                        id: 'period-end-calendar',
                    },
                ];
                const fieldsets = getFieldset(radioErrors);
                expect(fieldsets).toEqual(mockPeriodValidityFieldsetWithErrors);
            });

            it('should return fieldsets with input errors when input errors are passed', () => {
                const inputErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Specify an end time for service day',
                        id: 'service-end-time',
                    },
                ];
                const fieldsets = getFieldset(inputErrors);
                expect(fieldsets).toEqual(mockPeriodValidityFieldsetWithInputErrors);
            });
        });
    });
});
