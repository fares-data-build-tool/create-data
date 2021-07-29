import * as React from 'react';
import { shallow } from 'enzyme';
import ViewTimeRestrictions from '../../src/pages/viewTimeRestrictions';
import { PremadeTimeRestriction } from 'src/interfaces';

describe('pages', () => {
    describe('view passenger types', () => {
        it('should render correctly when no individual or group passenger types', () => {
            const tree = shallow(<ViewTimeRestrictions timeRestrictions={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when time restrictions exist', () => {
            const timeRestrictions: PremadeTimeRestriction[] = [
                {
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

            const tree = shallow(<ViewTimeRestrictions timeRestrictions={timeRestrictions} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
