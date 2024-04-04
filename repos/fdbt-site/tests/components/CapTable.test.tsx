import { shallow } from 'enzyme';
import React from 'react';
import CapTable from '../../src/components/CapTable';
import { CapExpiryUnit, ProductValidity } from '../../src/interfaces/matchingJsonTypes';

describe('CapTable', () => {
    it('should render the table upon first opening of page', () => {
        const wrapper = shallow(<CapTable errors={[]} userInputtedCaps={[]} numberOfEntitesByDistancesToDisplay={1} />);
        expect(wrapper).toMatchSnapshot();
    });
    it('should render the table with no errors', () => {
        const wrapper = shallow(
            <CapTable
                errors={[]}
                userInputtedCaps={[
                    {
                        name: 'First cap',
                        price: '2.33',
                        durationAmount: '2',
                        durationUnits: CapExpiryUnit.WEEK,
                        capExpiry: {
                            productValidity: 'endOfCalendarDay' as ProductValidity,
                            productEndTime: '',
                        },
                    },
                    {
                        name: 'Second cap',
                        price: '3.33',
                        durationAmount: '2',
                        durationUnits: CapExpiryUnit.DAY,
                        capExpiry: {
                            productValidity: 'endOfCalendarDay' as ProductValidity,
                            productEndTime: '',
                        },
                    },
                ]}
                numberOfEntitesByDistancesToDisplay={2}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the table with errors', () => {
        const wrapper = shallow(
            <CapTable
                errors={[{ errorMessage: 'Cap names must be unique', id: 'cap-name-0' }]}
                userInputtedCaps={[
                    {
                        name: 'First cap',
                        price: '2.33',
                        durationAmount: '2',
                        durationUnits: CapExpiryUnit.WEEK,
                        capExpiry: {
                            productValidity: 'endOfCalendarDay' as ProductValidity,
                            productEndTime: '',
                        },
                    },
                    {
                        name: 'First cap',
                        price: '3.33',
                        durationAmount: '2',
                        durationUnits: CapExpiryUnit.DAY,
                        capExpiry: {
                            productValidity: 'endOfCalendarDay' as ProductValidity,
                            productEndTime: '',
                        },
                    },
                ]}
                numberOfEntitesByDistancesToDisplay={2}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
