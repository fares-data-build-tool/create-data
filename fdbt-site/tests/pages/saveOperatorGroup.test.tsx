import * as React from 'react';
import { shallow } from 'enzyme';
import {
    mockFieldSetForSaveOperatorGroup,
    mockFieldSetForSaveOperatorGroupWithErrorsIfRadioNotSelected,
    mockFieldSetForSaveOperatorGroupWithErrorsIfNameMissing,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';
import SaveOperatorGroup, { getFieldset } from '../../src/pages/saveOperatorGroup';

describe('pages', () => {
    describe('saveOperatorGroup', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <SaveOperatorGroup errors={[]} csrfToken="" fieldset={mockFieldSetForSaveOperatorGroup} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render errors when user does not select a radio button', () => {
            const tree = shallow(
                <SaveOperatorGroup
                    errors={[{ errorMessage: 'Choose one of the options below', id: 'yes-save' }]}
                    csrfToken=""
                    fieldset={mockFieldSetForSaveOperatorGroupWithErrorsIfRadioNotSelected}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render errors when user does not provide a group name', () => {
            const tree = shallow(
                <SaveOperatorGroup
                    errors={[
                        { errorMessage: 'Provide a name for the operator group', id: 'operator-group-name-input' },
                    ]}
                    csrfToken=""
                    fieldset={mockFieldSetForSaveOperatorGroupWithErrorsIfNameMissing}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getFieldset', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const fieldsets = getFieldset([]);
                expect(fieldsets).toEqual(mockFieldSetForSaveOperatorGroup);
            });

            it('should return fieldsets with radio errors when radio errors are passed', () => {
                const radioErrors: ErrorInfo[] = [{ errorMessage: 'Choose one of the options below', id: 'yes-save' }];
                const fieldsets = getFieldset(radioErrors);
                expect(fieldsets).toEqual(mockFieldSetForSaveOperatorGroupWithErrorsIfRadioNotSelected);
            });

            it('should return fieldsets with input errors when input errors are passed', () => {
                const inputErrors: ErrorInfo[] = [
                    { errorMessage: 'Provide a name for the operator group', id: 'operator-group-name-input' },
                ];
                const fieldsets = getFieldset(inputErrors);
                expect(fieldsets).toEqual(mockFieldSetForSaveOperatorGroupWithErrorsIfNameMissing);
            });
        });
    });
});
