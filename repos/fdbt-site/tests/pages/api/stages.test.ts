import { mockRequest, mockResponse } from 'mock-req-res';
import stages from '../../../src/pages/api/stages';

import * as validator from '../../../src/pages/api/service/validator';
import * as businessLogic from '../../../src/pages/api/service/businessLogic';

describe('stages', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /confirmation when session is valid and cookies uuid match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(true);

        const spyStagesBusinessLogic = jest.spyOn(businessLogic, 'stagesBusinessLogic').mockImplementation();

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).toBeCalled();
        expect(spyStagesBusinessLogic).toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmation',
        });
    });

    it('should return 302 redirect to /error when stagesBusinessLogic throws an error', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(true);

        const spyStagesBusinessLogic = jest.spyOn(businessLogic, 'stagesBusinessLogic').mockImplementation(() => {
            throw new Error();
        });

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).toBeCalled();
        expect(spyStagesBusinessLogic).toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /error when cookie uuid do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(false);
        const spyStagesBusinessLogic = jest.spyOn(businessLogic, 'stagesBusinessLogic').mockImplementation();

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).toBeCalled();
        expect(spyStagesBusinessLogic).not.toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(true);
        const spyStagesBusinessLogic = jest.spyOn(businessLogic, 'stagesBusinessLogic').mockImplementation();

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).not.toBeCalled();
        expect(spyStagesBusinessLogic).not.toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /error when session is not valid and cookies do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(false);
        const spyStagesBusinessLogic = jest.spyOn(businessLogic, 'stagesBusinessLogic').mockImplementation();

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).not.toBeCalled();
        expect(spyStagesBusinessLogic).not.toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });
});
