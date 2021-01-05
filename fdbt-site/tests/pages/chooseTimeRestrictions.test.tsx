import * as React from 'react';
import { shallow } from 'enzyme';
import ChooseTimeRestrictions, { getServerSideProps } from '../../src/pages/chooseTimeRestrictions';
import { getMockContext } from '../testData/mockData';
import { FULL_TIME_RESTRICTIONS_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../src/constants';
import { ErrorInfo } from '../../src/interfaces';

describe('pages', () => {
    describe('chooseTimeRestrictions', () => {
        it('should render correctly with no prior inputs', () => {
            const tree = shallow(
                <ChooseTimeRestrictions
                    chosenDays={['monday', 'tuesday']}
                    startTimeInputs={[]}
                    endTimeInputs={[]}
                    errors={[]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with prior inputs ', () => {
            const tree = shallow(
                <ChooseTimeRestrictions
                    chosenDays={['monday', 'tuesday']}
                    startTimeInputs={[{ timeInput: '0900', day: 'monday' }]}
                    endTimeInputs={[{ timeInput: '1900', day: 'tuesday' }]}
                    errors={[]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with errors', () => {
            const tree = shallow(
                <ChooseTimeRestrictions
                    chosenDays={['monday', 'tuesday']}
                    startTimeInputs={[
                        { timeInput: '0000', day: 'monday' },
                        { timeInput: '0900', day: 'tuesday' },
                    ]}
                    endTimeInputs={[
                        { timeInput: '2400', day: 'monday' },
                        { timeInput: '7pm', day: 'tuesday' },
                    ]}
                    errors={[
                        {
                            errorMessage: '2400 is not a valid input. Use 0000.',
                            id: `end-time-monday`,
                            userInput: '2400',
                        },
                        {
                            errorMessage: 'Time must be in 2400 format',
                            id: `end-time-tuesday`,
                            userInput: '7pm',
                        },
                    ]}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            const mockDays = ['monday', 'tuesday', 'friday'];

            it('should return default props when the page is first visited', () => {
                const expectedProps = {
                    chosenDays: mockDays,
                    errors: [],
                    csrfToken: '',
                    startTimeInputs: [],
                    endTimeInputs: [],
                };
                const ctx = getMockContext({
                    session: { [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: { validDays: mockDays } },
                });
                const actualProps = getServerSideProps(ctx);
                expect(actualProps.props).toEqual(expectedProps);
            });

            it('should return props with errors when the user enters incorrect time inputs', () => {
                const expectedUserInputStructure = expect.arrayContaining([
                    expect.objectContaining({ timeInput: expect.any(String), day: expect.any(String) }),
                ]);
                const mockUserInputs = [
                    { day: 'monday', startTime: '0900', endTime: 'dad' },
                    { day: 'tuesday', startTime: 'vveaee', endTime: '2300' },
                    { day: 'wednesday', startTime: '2400', endTime: '' },
                    { day: 'thursday', startTime: '', endTime: '' },
                ];
                const mockErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Time must be in 2400 format',
                        id: 'end-time-monday',
                        userInput: 'turkey',
                    },
                    {
                        errorMessage: 'Time must be in 2400 format',
                        id: 'start-time-tuesday',
                        userInput: 'vveaee',
                    },
                    {
                        errorMessage: '2400 is not a valid input. Use 0000.',
                        id: 'start-time-wednesday',
                        userInput: '2400',
                    },
                ];
                const expectedProps = {
                    chosenDays: mockDays,
                    errors: mockErrors,
                    csrfToken: '',
                    startTimeInputs: expectedUserInputStructure,
                    endTimeInputs: expectedUserInputStructure,
                };
                const ctx = getMockContext({
                    session: {
                        [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: { validDays: mockDays },
                        [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: {
                            fullTimeRestrictions: mockUserInputs,
                            errors: mockErrors,
                        },
                    },
                });
                const actualProps = getServerSideProps(ctx);
                expect(actualProps.props).toEqual(expectedProps);
            });
        });
    });
});
