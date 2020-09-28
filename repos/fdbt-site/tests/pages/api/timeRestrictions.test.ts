import { timeRestrictionsErrorId } from '../../../src/pages/timeRestrictions';
import timeRestrictions from '../../../src/pages/api/timeRestrictions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { isSessionValid } from '../../../src/pages/api/apiUtils/validator';
import * as sessionUtils from '../../../src/utils/sessions';
import { FARE_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_ATTRIBUTE } from '../../../src/constants';

describe('timeRestrictions', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessionUtils, 'updateSessionAttribute');
    beforeEach(() => {
        (isSessionValid as {}) = jest.fn().mockReturnValue(true);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('redirects', () => {
        it('should throw an error and redirect to the error page when the FARE_TYPE_ATTRIBUTE is missing', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: { fareType: null },
                body: {},
                uuid: {},
                session: { [FARE_TYPE_ATTRIBUTE]: null },
            });
            timeRestrictions(req, res);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/error',
            });
        });

        it('should 302 redirect to /timeRestrictions and add errors to cookie, when there is no body in the request', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: {},
                uuid: {},
            });
            timeRestrictions(req, res);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/timeRestrictions',
            });
            expect(updateSessionAttributeSpy).toHaveBeenLastCalledWith(req, TIME_RESTRICTIONS_ATTRIBUTE, {
                timeRestrictions: false,
                errors: [{ errorMessage: 'Choose either yes or no', id: timeRestrictionsErrorId }],
            });
        });

        it('should 302 redirect to /error when session is not valid', () => {
            (isSessionValid as {}) = jest.fn().mockReturnValue(false);
            const { req, res } = getMockRequestAndResponse({
                cookieValues: { operator: null },
                body: null,
                uuid: {},
            });
            timeRestrictions(req, res);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/error',
            });
        });

        it('should 302 redirect to /defineTimeRestrictions when yes is selected for time restrictions', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: {
                    timeRestrictions: 'yes',
                },
                uuid: {},
            });
            timeRestrictions(req, res);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/defineTimeRestrictions',
            });
        });
    });
});
