import http from 'http';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { STAGE_NAMES_COOKIE, STAGE_NAME_VALIDATION_COOKIE } from '../../../src/constants';
import stageNames, { isStageNameValid } from '../../../src/pages/api/stageNames';
import { getMockRequestAndResponse } from '../../testData/mockData';

http.OutgoingMessage.prototype.setHeader = jest.fn();

describe('stageNames', () => {
    let setCookieSpy: any;
    let deleteCookieSpy: any;

    beforeEach(() => {
        setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        deleteCookieSpy = jest.spyOn(apiUtils, 'deleteCookieOnResponseObject');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('isStageNameValid', () => {
        it('should return an array of invalid input checks when the user enters no data', () => {
            const mockBody = { stageNameInput: ['', '', '', ''] };
            const { req } = getMockRequestAndResponse({}, mockBody);
            const expectedArray = [
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
                { Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const inputCheck = isStageNameValid(req);
            expect(inputCheck).toEqual(expectedArray);
        });
        it('should return an array of valid input checks when the user enters correct data', () => {
            const mockBody = { stageNameInput: ['abcd', 'efg', 'hijkl', 'mn'] };
            const { req } = getMockRequestAndResponse({}, mockBody);
            const expectedArray = [
                { Error: '', Input: 'abcd' },
                { Error: '', Input: 'efg' },
                { Error: '', Input: 'hijkl' },
                { Error: '', Input: 'mn' },
            ];
            const inputCheck = isStageNameValid(req);
            expect(inputCheck).toEqual(expectedArray);
        });
        it('should return an array of invalid and valid input checks when the user enters incorrect data', () => {
            const mockBody = { stageNameInput: ['abcde', '   ', 'xyz', ''] };
            const { req } = getMockRequestAndResponse({}, mockBody);
            const expectedArray = [
                { Error: '', Input: 'abcde' },
                { Error: 'Enter a name for this fare stage', Input: '   ' },
                { Error: '', Input: 'xyz' },
                { Error: 'Enter a name for this fare stage', Input: '' },
            ];
            const inputCheck = isStageNameValid(req);
            expect(inputCheck).toEqual(expectedArray);
        });
    });

    it('should return 302 redirect to /stageNames (i.e. itself) when the session is valid, but there is no request body', () => {
        const mockBody = { stageNameInput: ['', '', '', ''] };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, mockBody, {}, mockWriteHeadFn);
        stageNames(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/stageNames',
        });
    });

    it('should return 302 redirect to /priceEntry when session is valid and request body is present', () => {
        const mockBody = { stageNameInput: ['a', 'b', 'c', 'd'] };
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, mockBody, {}, mockWriteHeadFn);
        stageNames(req, res);
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/priceEntry',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const mockBody = {};
        const mockWriteHeadFn = jest.fn();
        const { req, res } = getMockRequestAndResponse({}, mockBody, {}, mockWriteHeadFn);
        expect(() => stageNames(req, res)).toThrow();
        expect(mockWriteHeadFn).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should set the STAGE_NAMES_COOKIE and STAGE_NAME_VALIDATION_COOKIE with values matching the valid data entered by the user ', () => {
        const mockBody = { stageNameInput: ['a', 'b', 'c', 'd'] };
        const { req, res } = getMockRequestAndResponse({}, mockBody);
        const mockStageNamesCookieValue = '["a","b","c","d"]';
        stageNames(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith('', STAGE_NAMES_COOKIE, mockStageNamesCookieValue, req, res);
        expect(deleteCookieSpy).toHaveBeenCalledWith('', STAGE_NAME_VALIDATION_COOKIE, req, res);
    });

    it('should set the STAGE_NAME_VALIDATION_COOKIE with a value matching the invalid data entered by the user', () => {
        const mockBody = { stageNameInput: [' ', 'abcdefghijklmnopqrstuvwxyzabcdefgh', '   ', 'b'] };
        const { req, res } = getMockRequestAndResponse({}, mockBody);
        const mockInputCheck =
            '[{"Input":" ","Error":"Enter a name for this fare stage"},{"Input":"abcdefghijklmnopqrstuvwxyzabcdefgh","Error":"The name for Fare Stage 2 needs to be less than 30 characters"},{"Input":"   ","Error":"Enter a name for this fare stage"},{"Input":"b","Error":""}]';
        stageNames(req, res);
        expect(setCookieSpy).toBeCalledWith('', STAGE_NAME_VALIDATION_COOKIE, mockInputCheck, req, res);
    });
});
