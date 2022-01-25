import * as React from 'react';
import { shallow } from 'enzyme';
import ViewTimeRestrictions, { TimeRestrictionCardBody } from '../../src/pages/viewTimeRestrictions';
import { PremadeTimeRestriction } from 'src/interfaces';

const timeRestrictions: PremadeTimeRestriction[] = [
    {
        id: 1,
        name: 'Restriction 1',
        contents: [
            {
                day: 'monday',
                timeBands: [
                    {
                        startTime: '0400',
                        endTime: '2300',
                    },
                ],
            },
            {
                day: 'tuesday',
                timeBands: [
                    {
                        startTime: '0400',
                        endTime: '',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Restriction 2',
        contents: [
            {
                day: 'bankHoliday',
                timeBands: [],
            },
            {
                day: 'sunday',
                timeBands: [
                    {
                        startTime: '0400',
                        endTime: '1200',
                    },
                    {
                        startTime: '1300',
                        endTime: '2200',
                    },
                ],
            },
        ],
    },
];

describe('pages', () => {
    describe('view time restrictions', () => {
        it('should render correctly when no time restrictions', () => {
            const tree = shallow(
                <ViewTimeRestrictions csrfToken={''} timeRestrictions={[]} referer={null} deleteEnabled={false} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when time restrictions exist', () => {
            const tree = shallow(
                <ViewTimeRestrictions
                    csrfToken={''}
                    timeRestrictions={timeRestrictions}
                    referer={'hello'}
                    deleteEnabled={false}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('time restrictions inner component', () => {
        it('renders normally when time restrictions are present', () => {
            const tree = shallow(<TimeRestrictionCardBody entity={timeRestrictions[0]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
