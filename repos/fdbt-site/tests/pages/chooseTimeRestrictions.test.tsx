import * as React from 'react';
import { shallow } from 'enzyme';
import ChooseTimeRestrictions from '../../src/pages/chooseTimeRestrictions';

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
    });
});
