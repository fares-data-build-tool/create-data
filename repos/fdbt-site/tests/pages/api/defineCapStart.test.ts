import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import defineCapStart from '../../../src/pages/api/defineCapStart';
import { ErrorInfo } from '../../../src/interfaces';
import { CAP_START_ATTRIBUTE } from '../../../src/constants/attributes';
import { CapStartInfo } from '../../../src/interfaces/matchingJsonTypes';

describe('defineCapStart', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates product info, updates the CAP_START_ATTRIBUTE and then redirects to /defineCapStart if all is valid', () => {
        const mockProductInfo: CapStartInfo = {
            type: 'fixedWeekdays',
            start: 'monday',
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capStart: 'fixedWeekdays', start: 'monday' },
            mockWriteHeadFn: writeHeadMock,
        });

        defineCapStart(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_START_ATTRIBUTE, mockProductInfo);

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/defineCapStart' });
    });

    it('correctly generates product info, updates the CAP_START_ATTRIBUTE with start empty even if supplied, if fixedWeekdays is not selected', () => {
        const mockProductInfo: CapStartInfo = {
            type: 'rollingDays',
            start: undefined,
        };

        const { req, res } = getMockRequestAndResponse({
            body: { capStart: 'rollingDays', start: '' },
        });

        defineCapStart(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_START_ATTRIBUTE, mockProductInfo);
    });

    it('correctly generates cap expiry error info, updates the CAP_START_ATTRIBUTE and then redirects to defineCapStart page when there is no cap validity info', () => {
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
});
