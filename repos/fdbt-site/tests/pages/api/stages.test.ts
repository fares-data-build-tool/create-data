import { mockRequest, mockResponse } from 'mock-req-res';
import stages from '../../../src/pages/api/stages';

import * as validator from '../../../src/pages/api/service/validator';

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

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/confirmation',
        });
    });

    it('should return 302 redirect to /_error when cookie uuid do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(false);

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });
    });

    it('should return 302 redirect to /_error when session is not valid', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(true);

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).not.toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });
    });

    it('should return 302 redirect to /_error when session is not valid and cookies do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(false);

        const writeHeadMock = jest.fn();
        const req = mockRequest();

        const res = mockResponse({
            writeHead: writeHeadMock,
        });

        stages(req, res);

        expect(spyIsSessionValid).toBeCalled();
        expect(spyIsCookiesUUIDMatch).not.toBeCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/_error',
        });
    });
});
