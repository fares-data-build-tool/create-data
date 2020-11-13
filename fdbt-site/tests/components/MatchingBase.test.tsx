import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import MatchingBase, {
    getDefaultStopItems,
    StopItem,
    renderResetAndAutoPopulateButtons,
} from '../../src/components/MatchingBase';
import { userFareStages, selectedFareStages, zoneStops, service } from '../testData/mockData';

describe('MatchingBase', () => {
    const baseProps = {
        title: 'Matching - Create Fares Data Service',
        description: 'Matching page of the Create Fares Data Service',
        hintText: 'Select a fare stage for each stop.',
        travelineHintText: 'This data has been taken from the Traveline National Dataset and NaPTAN database.',
        heading: 'Match stops to fares stages',
        apiEndpoint: '/api/matching',
    };

    describe('getDefaultStopItems', () => {
        it('should return an array of stop items each with a default dropdown value when there are no selectedFareStages', () => {
            const defaultStopItems = getDefaultStopItems(userFareStages, zoneStops, []);
            [...defaultStopItems].forEach(stopItem => {
                expect(stopItem.dropdownValue).toBe('');
            });
        });

        it('should return an array of stop items with dropdown values macthing those in selectedFareStages', () => {
            const expectedStopItems: StopItem = {
                index: expect.any(Number),
                stopName: expect.any(String),
                atcoCode: expect.any(String),
                naptanCode: expect.any(String),
                stopData: expect.any(String),
                dropdownValue: expect.stringContaining('' || 'Acomb Green Lane' || 'Holl Bank/Beech Ave'),
                dropdownOptions: expect.any(Array),
            };
            const defaultStopItems = getDefaultStopItems(userFareStages, zoneStops, selectedFareStages);
            expect([...defaultStopItems]).toContainEqual(expectedStopItems);
        });

        describe('renderResetAndAutoPopulateButtons', () => {
            it('should render the reset and auto populate buttons on the page', () => {
                const mockFn = jest.fn();
                const wrapper = shallow(renderResetAndAutoPopulateButtons(mockFn, mockFn, 'bottom'));
                expect(wrapper).toMatchSnapshot();
            });
        });
    });

    describe('javascript functionality', () => {
        const mockSetState = jest.fn();
        jest.mock('react', () => ({ useState: (initialState: unknown): unknown => [initialState, mockSetState] }));
        const mockMouseEvent = ({ preventDefault: jest.fn() } as unknown) as React.MouseEvent;

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('dropdownSelection', () => {
            const wrapper = shallow(
                <MatchingBase
                    userFareStages={userFareStages}
                    stops={zoneStops}
                    service={service}
                    error={false}
                    selectedFareStages={[]}
                    csrfToken=""
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...baseProps}
                />,
            );

            it('should update the state such that the dropdown that has been clicked has its value updated to the selected value', () => {
                const mockDropdownInfo = {
                    index: 5,
                    value: 'Acomb Green Lane',
                };
                (wrapper.find(`#option-${mockDropdownInfo.index}`).prop('onChange') as Function)({
                    target: {
                        value: mockDropdownInfo.value,
                    },
                });
                expect(wrapper.find(`#option-${mockDropdownInfo.index}`).prop('value')).toEqual(mockDropdownInfo.value);
            });
        });

        describe('resetButtonClick', () => {
            const wrapper = shallow(
                <MatchingBase
                    userFareStages={userFareStages}
                    stops={zoneStops}
                    service={service}
                    error={false}
                    selectedFareStages={selectedFareStages}
                    csrfToken=""
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...baseProps}
                />,
            );

            it('should update the state such that each dropdown on the page has its value reset to an empty string', () => {
                const dropdownValues = wrapper.find('select').map(item => item.prop('value'));
                expect(dropdownValues).toContainEqual(
                    expect.stringMatching('' || 'Acomb Green Lane' || 'Holl Bank/Beech Ave'),
                );
                (wrapper.find('#bottom-reset-all-fare-stages-button').prop('onClick') as Function)(mockMouseEvent);
                wrapper.find('select').forEach(item => {
                    expect(item.prop('value')).toEqual('');
                });
            });
        });

        describe('autoPopulateButtonClick', () => {
            let matchingBaseWrapper: ShallowWrapper;

            beforeEach(() => {
                matchingBaseWrapper = shallow(
                    <MatchingBase
                        userFareStages={userFareStages}
                        stops={zoneStops}
                        service={service}
                        error={false}
                        selectedFareStages={[]}
                        csrfToken=""
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...baseProps}
                    />,
                );
            });

            it('should update the state such that each dropdown below the one selected has its value updated to the selected value', () => {
                const optionIndex = 5;
                (matchingBaseWrapper.find(`#option-${optionIndex}`).prop('onChange') as Function)({
                    target: {
                        value: 'Acomb Green Lane',
                    },
                });
                (matchingBaseWrapper.find('#bottom-auto-populate-fares-stages-button').prop('onClick') as Function)(
                    mockMouseEvent,
                );
                matchingBaseWrapper.update();
                matchingBaseWrapper.find('select').forEach(item => {
                    const itemIndex = Number(item.prop('id')?.split('-')[1]);
                    if (itemIndex < optionIndex) {
                        expect(item.prop('value')).toEqual('');
                    } else if (itemIndex >= optionIndex) {
                        expect(item.prop('value')).toEqual('Acomb Green Lane');
                    }
                });
            });

            it('should update the state such that the dropdowns below the selected values have their value updated correctly for >1 selections', () => {
                const mockDropdownInfo = [
                    {
                        index: 5,
                        value: 'Acomb Green Lane',
                    },
                    {
                        index: 9,
                        value: 'Holl Bank/Beech Ave',
                    },
                ];
                mockDropdownInfo.forEach(selection => {
                    (matchingBaseWrapper.find(`#option-${selection.index}`).prop('onChange') as Function)({
                        target: {
                            value: selection.value,
                        },
                    });
                });
                (matchingBaseWrapper.find('#bottom-auto-populate-fares-stages-button').prop('onClick') as Function)(
                    mockMouseEvent,
                );
                matchingBaseWrapper.update();
                matchingBaseWrapper.find('select').forEach(item => {
                    const firstSelectionIndex = mockDropdownInfo[0].index;
                    const secondSelectionIndex = mockDropdownInfo[1].index;
                    const itemIndex = Number(item.prop('id')?.split('-')[1]);
                    if (itemIndex < firstSelectionIndex) {
                        expect(item.prop('value')).toEqual('');
                    } else if (itemIndex >= firstSelectionIndex && itemIndex < secondSelectionIndex) {
                        expect(item.prop('value')).toEqual('Acomb Green Lane');
                    } else if (itemIndex > secondSelectionIndex) {
                        expect(item.prop('value')).toEqual('Holl Bank/Beech Ave');
                    }
                });
            });
        });
    });
});
