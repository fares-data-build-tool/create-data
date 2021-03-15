import * as sessions from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import {
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { TimeRestriction } from '../../../src/interfaces';
import defineTimeRestrictions from '../../../src/pages/api/defineTimeRestrictions';
import * as auroradb from '../../../src/data/auroradb';

describe('defineTimeRestrictions', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should set the TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE and redirect to fare confirmation when no errors are found', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const mockReqBody = {
            timeRestrictionChoice: 'Yes',
            validDays: 'tuesday',
        };
        const mockAttributeValue: TimeRestriction = {
            validDays: ['tuesday'],
        };
        const { req, res } = getMockRequestAndResponse({
            body: mockReqBody,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
            mockAttributeValue,
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/chooseTimeRestrictions',
        });
    });

    it('should set the TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE and redirect to itself (i.e. /defineTimeRestrictions) when errors are present due to saying there are valid days but not providing any', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                timeRestrictionChoice: 'Yes',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, {
            validDays: undefined,
            timeRestrictionChoice: 'Yes',
            errors: [{ errorMessage: 'Select at least one day', id: 'monday' }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });

    it('should use the selected premade time restriction if premade selected and option chosen from dropdown', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const getTimeRestrictionByNameAndNocSpy = jest.spyOn(auroradb, 'getTimeRestrictionByNameAndNoc');
        getTimeRestrictionByNameAndNocSpy.mockImplementation().mockResolvedValue([
            {
                name: 'My time restriction',
                contents: [
                    {
                        day: 'monday',
                        timeBands: [
                            {
                                startTime: '1000',
                                endTime: '1100',
                            },
                        ],
                    },
                ],
            },
        ]);
        const { req, res } = getMockRequestAndResponse({
            body: {
                timeRestrictionChoice: 'Premade',
                timeRestriction: 'My time restriction',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
            fullTimeRestrictions: [
                {
                    day: 'monday',
                    timeBands: [
                        {
                            startTime: '1000',
                            endTime: '1100',
                        },
                    ],
                },
            ],
            errors: [],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/fareConfirmation',
        });
    });

    it('redirect back to defineTimeRestrictions with errors if user does not select a premade time restriction but chose premade radio button', async () => {
        const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
        const { req, res } = getMockRequestAndResponse({
            body: {
                timeRestrictionChoice: 'Premade',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await defineTimeRestrictions(req, res);
        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, {
            validDays: [],
            timeRestrictionChoice: 'Premade',
            errors: [{ errorMessage: 'Choose one of the premade time restrictions', id: 'time-restriction' }],
        });
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineTimeRestrictions',
        });
    });
});
