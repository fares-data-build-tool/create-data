import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import defineCapStart from '../../../src/pages/api/defineCapStart';
import { ErrorInfo } from '../../../src/interfaces';
import { CAP_START_ATTRIBUTE } from '../../../src/constants/attributes';
import { CapStartInfo } from '../../../src/interfaces/matchingJsonTypes';
import { isADayOfTheWeek } from '../../../src/pages/api/createCaps';

describe('defineCapStart', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, updates the CAP_START_ATTRIBUTE and then redirects to /capConfirmation if all is valid', () => {
        const mockProductInfo: CapStartInfo = {
            type: 'fixedWeekdays',
            startDay: 'monday',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capStart: 'fixedWeekdays', startDay: 'monday' },
            mockWriteHeadFn: writeHeadMock,
        });

        defineCapStart(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_START_ATTRIBUTE, mockProductInfo);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/capConfirmation' });
    });

    it('correctly generates product info, updates the CAP_START_ATTRIBUTE with startDay empty even if supplied, if fixedWeekdays is not selected', () => {
        const mockProductInfo: CapStartInfo = {
            type: 'rollingDays',
            startDay: undefined,
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capStart: 'rollingDays', startDay: '' },
        });

        defineCapStart(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_START_ATTRIBUTE, mockProductInfo);
    });

    it('produces an error when startDay is empty and fixedWeekdays is selected', () => {
        const errors: ErrorInfo[] = [
            {
                id: 'start',
                errorMessage: 'Select a start day',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: { capStart: 'fixedWeekdays', startDay: '' },
        });

        defineCapStart(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_START_ATTRIBUTE, errors);
    });

    it('correctly generates cap start error info, updates the CAP_START_ATTRIBUTE and then redirects to defineCapStart page when there is no cap validity info', () => {
        const errors: ErrorInfo[] = [
            {
                id: 'fixed-weekdays',
                errorMessage: 'Choose an option regarding your cap ticket start',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });

        defineCapStart(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, CAP_START_ATTRIBUTE, errors);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineCapStart',
        });
    });
    it.each([
        ['monday', true],
        ['tuesday', true],
        ['', false],
        [undefined, false],
        ['notMonday', false],
    ])('correctly tests days of the week', (day: string | undefined, result: boolean) => {
        const isDayOfTheWeek = isADayOfTheWeek(day);

        expect(isDayOfTheWeek).toEqual(result);
    });
});
