import * as React from 'react';
import { shallow } from 'enzyme';
import GlobalSettings, { buildPassengerTypesDetails } from '../../src/pages/globalSettings';
import { SettingsOverview } from 'src/interfaces';
import * as db from '../../src/data/auroradb';

jest.mock('../../src/data/auroradb');

const dbSpy = jest.spyOn(db, 'getPassengerTypesByNocCode');

describe('pages', () => {
    describe('globalSettings', () => {
        it('should render correctly with zero saved passenger types', () => {
            const mockSavedPassengerTypesDetails: SettingsOverview = {
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 0,
            };
            const tree = shallow(<GlobalSettings savedPassengerTypesDetails={mockSavedPassengerTypesDetails} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with some saved passenger types', () => {
            const mockSavedPassengerTypesDetails: SettingsOverview = {
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 4,
            };
            const tree = shallow(<GlobalSettings savedPassengerTypesDetails={mockSavedPassengerTypesDetails} />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('buildPassengerTypesDetails', () => {
        it('returns a count which is the total of the saved groups and saved passengers when there are some of each', async () => {
            dbSpy
                .mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            passengerType: '',
                            ageRange: '',
                            ageRangeMin: '',
                            ageRangeMax: '',
                            proof: '',
                            proofDocuments: ['', ''],
                        },
                    ]),
                )
                .mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            name: '',
                            maxGroupSize: '',
                            companions: [],
                        },
                        {
                            name: '',
                            maxGroupSize: '',
                            companions: [],
                        },
                        {
                            name: '',
                            maxGroupSize: '',
                            companions: [],
                        },
                    ]),
                );
            const result = await buildPassengerTypesDetails('testNoc');
            expect(result).toStrictEqual({
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 4,
            });
        });

        it('returns a count which is the total of the saved groups and saved passengers when there are some passengers but no groups', async () => {
            dbSpy
                .mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            passengerType: '',
                            ageRange: '',
                            ageRangeMin: '',
                            ageRangeMax: '',
                            proof: '',
                            proofDocuments: ['', ''],
                        },
                    ]),
                )
                .mockImplementationOnce(() => Promise.resolve([]));
            const result = await buildPassengerTypesDetails('testNoc');
            expect(result).toStrictEqual({
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 1,
            });
        });

        it('returns a count which is the total of the saved groups and saved passengers when there are none of each.', async () => {
            dbSpy.mockImplementationOnce(() => Promise.resolve([])).mockImplementationOnce(() => Promise.resolve([]));
            const result = await buildPassengerTypesDetails('testNoc');
            expect(result).toStrictEqual({
                name: 'Passenger types',
                description:
                    'Define age range and required proof documents of your passengers as well as passenger groups',
                count: 0,
            });
        });
    });
});
