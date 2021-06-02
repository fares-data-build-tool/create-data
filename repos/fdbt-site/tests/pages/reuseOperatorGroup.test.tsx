import * as React from 'react';
import { shallow } from 'enzyme';
import {
    mockFieldSetForReuseOperatorGroup,
    mockFieldSetForReuseOperatorGroupWithErrorsIfRadioNotSelected,
    mockFieldSetForReuseOperatorGroupWithErrorsIfOptionNotSelected,
    getMockContext,
} from '../testData/mockData';
import { ErrorInfo } from '../../src/interfaces';
import ReuseOperatorGroup, { getFieldset, getServerSideProps } from '../../src/pages/reuseOperatorGroup';
import { getOperatorGroupsByNoc } from '../../src/data/auroradb';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('reuseOperatorGroup', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ReuseOperatorGroup errors={[]} csrfToken="" fieldset={mockFieldSetForReuseOperatorGroup} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render errors when user does not select a radio button', () => {
            const tree = shallow(
                <ReuseOperatorGroup
                    errors={[{ errorMessage: 'Choose one of the options below', id: 'conditional-form-group' }]}
                    csrfToken=""
                    fieldset={mockFieldSetForReuseOperatorGroupWithErrorsIfRadioNotSelected}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render errors when user does not provide a group name', () => {
            const tree = shallow(
                <ReuseOperatorGroup
                    errors={[
                        {
                            errorMessage: 'Choose a premade operator group from the options below',
                            id: 'premadeOperatorGroup',
                        },
                    ]}
                    csrfToken=""
                    fieldset={mockFieldSetForReuseOperatorGroupWithErrorsIfOptionNotSelected}
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getFieldset', () => {
            it('should return fieldsets with no errors when no errors are passed', () => {
                const fieldsets = getFieldset([], ['Best Ops']);
                expect(fieldsets).toEqual(mockFieldSetForReuseOperatorGroup);
            });

            it('should return fieldsets with radio errors when radio errors are passed', () => {
                const radioErrors: ErrorInfo[] = [
                    { errorMessage: 'Choose one of the options below', id: 'conditional-form-group' },
                ];
                const fieldsets = getFieldset(radioErrors, ['Best Ops']);
                expect(fieldsets).toEqual(mockFieldSetForReuseOperatorGroupWithErrorsIfRadioNotSelected);
            });

            it('should return fieldsets with input errors when input errors are passed', () => {
                const inputErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Choose a premade operator group from the options below',
                        id: 'premadeOperatorGroup',
                    },
                ];
                const fieldsets = getFieldset(inputErrors, ['Best Ops']);
                expect(fieldsets).toEqual(mockFieldSetForReuseOperatorGroupWithErrorsIfOptionNotSelected);
            });
        });

        describe('getServerSideProps', () => {
            it('redirects on to searchOperators if the user does not have any premade operator groups saved', async () => {
                (getOperatorGroupsByNoc as jest.Mock).mockImplementation(() => []);
                const writeHeadMock = jest.fn();
                const mockContext = getMockContext({
                    mockWriteHeadFn: writeHeadMock,
                });
                await getServerSideProps(mockContext);
                expect(writeHeadMock).toBeCalledWith(302, { Location: '/searchOperators' });
            });
        });
    });
});
