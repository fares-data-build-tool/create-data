import * as React from 'react';
import { shallow } from 'enzyme';
import CapExpiry, { getFieldset } from '../../src/pages/selectCapExpiry';
import {
    mockSelectCapValidityFieldset,
    mockSelectCapValidityFieldsetWithErrors,
    mockSelectCapValidityFieldsetWithInputErrors,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('capValidity', () => {
        it('should render correctly', () => {
            const tree = shallow(<CapExpiry errors={[]} csrfToken="" fieldset={mockSelectCapValidityFieldset} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <CapExpiry
                    errors={[
                        {
                            errorMessage: 'Choose an option regarding your cap ticket validity',
                            id: 'cap-validity-error',
                        },
                    ]}
                    csrfToken=""
                    fieldset={mockSelectCapValidityFieldset}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getFieldset', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const emptyErrors: ErrorInfo[] = [];
                const fieldsets = getFieldset(emptyErrors, '');
                expect(fieldsets).toEqual(mockSelectCapValidityFieldset);
            });

            it('should return fieldsets with radio errors when radio errors are passed', () => {
                const radioErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Choose one of the validity options',
                        id: 'cap-end-calendar',
                    },
                ];
                const fieldsets = getFieldset(radioErrors, '');
                expect(fieldsets).toEqual(mockSelectCapValidityFieldsetWithErrors);
            });

            it('should return fieldsets with input errors when input errors are passed', () => {
                const inputErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Specify an end time for fare day end',
                        id: 'product-end-time',
                    },
                ];
                const fieldsets = getFieldset(inputErrors, '');
                expect(fieldsets).toEqual(mockSelectCapValidityFieldsetWithInputErrors);
            });
        });
    });
});
