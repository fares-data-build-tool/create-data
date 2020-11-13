import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { FARE_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../../src/constants';
import { TimeRestriction } from '../../../src/interfaces';
import defineTimeRestrictions from '../../../src/pages/api/defineTimeRestrictions';

describe('defineTimeRestrictions', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should throw an error and redirect to the error page when the session is invalid', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { operator: null },
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        defineTimeRestrictions(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should throw an error and redirect to the error page when the FARE_TYPE_ATTRIBUTE is missing', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: { [FARE_TYPE_ATTRIBUTE]: null },
        });
        defineTimeRestrictions(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE and redirect to fare confirmation when no errors are found', () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const mockReqBody = {
            validDaysSelected: 'Yes',
            validDays: 'tuesday',
        };
        const mockAttributeValue: TimeRestriction = {
            validDays: ['tuesday'],
        };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'single' },
            body: mockReqBody,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
            mockAttributeValue,
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/chooseTimeRestrictions',
        });
    });

    it('should set the TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE and redirect to itself (i.e. /defineTimeRestrictions) when errors are present due to saying there are valid days but not providing any', () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                validDaysSelected: 'Yes',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, {
            validDays: undefined,
            validDaysSelected: 'Yes',
            errors: [{ errorMessage: 'Select at least one day', id: 'monday' }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });
});
