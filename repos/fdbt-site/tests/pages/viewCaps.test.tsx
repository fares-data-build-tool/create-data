import { shallow } from 'enzyme';
import * as React from 'react';
import { Cap } from 'src/interfaces';
import { ExpiryUnit, FromDb } from '../../src/interfaces/matchingJsonTypes';
import ViewCaps, { CapCardBody } from '../../src/pages/viewCaps';

describe('pages', () => {
    describe('view caps', () => {
        it('should render correctly on no cap expiry', () => {
            const tree = shallow(
                <ViewCaps caps={[]} capExpiry="" fareDayEnd="" viewCapErrors={[]} csrfToken="" referer={null} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity is 24 hr', () => {
            const tree = shallow(
                <ViewCaps caps={[]} capExpiry="24hr" fareDayEnd="" viewCapErrors={[]} csrfToken="" referer={null} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity is fare day end', () => {
            const tree = shallow(
                <ViewCaps
                    caps={[]}
                    capExpiry="fareDayEnd"
                    fareDayEnd="2323"
                    viewCapErrors={[]}
                    csrfToken=""
                    referer={null}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity and cap with duration less than 24 hour is  present', () => {
            const cap = {
                capDetails: {
                    name: 'Cap 1',
                    price: '2',
                    durationAmount: '1',
                    durationUnits: 'hour' as ExpiryUnit,
                },
                id: 1,
            };
            const tree = shallow(
                <ViewCaps
                    caps={[cap]}
                    capExpiry="fareDayEnd"
                    fareDayEnd="2323"
                    viewCapErrors={[]}
                    csrfToken=""
                    referer={null}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity and cap with more than one day duration is present', () => {
            const cap: FromDb<Cap> = {
                capDetails: {
                    name: 'Cap 1',
                    price: '2',
                    durationAmount: '1',
                    durationUnits: 'hour' as ExpiryUnit,
                },
                id: 1,
                capStart: {
                    type: 'fixedWeekdays',
                    startDay: 'friday',
                },
            };
            const tree = shallow(
                <ViewCaps
                    caps={[cap]}
                    capExpiry="fareDayEnd"
                    fareDayEnd="2323"
                    viewCapErrors={[]}
                    csrfToken=""
                    referer={null}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when cap validity and rollingDays cap start is present', () => {
            const cap: FromDb<Cap> = {
                capDetails: {
                    name: 'Cap 1',
                    price: '2',
                    durationAmount: '1',
                    durationUnits: 'hour' as ExpiryUnit,
                },
                id: 1,
                capStart: {
                    type: 'rollingDays',
                },
            };
            const tree = shallow(
                <ViewCaps
                    caps={[cap]}
                    capExpiry="fareDayEnd"
                    fareDayEnd="2323"
                    viewCapErrors={[]}
                    csrfToken=""
                    referer={null}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('cap inner component', () => {
        it('renders normally when caps are present', () => {
            const tree = shallow(
                <CapCardBody
                    cap={{
                        id: 2,
                        capDetails: {
                            name: 'cappy cap',
                            price: '2',
                            durationAmount: '24hr',
                            durationUnits: ExpiryUnit.HOUR,
                        },
                    }}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
