import { mockRequest, mockResponse } from 'mock-req-res';
import stages from '../../../src/pages/api/stages';

import * as index from '../../../src/pages/api/apiUtils/index';

describe('stages', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /confirmation when session is valid and cookies uuid match', () => {
        const spyIsSessionValid = jest
            .spyOn(index, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(index, 'isCookiesUUIDMatch')
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

    it('should return 302 redirect to /error when cookie uuid do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(index, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(index, 'isCookiesUUIDMatch')
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
            Location: '/error',
        });
    });

    it('should return 302 redirect to /error when session is not valid', () => {
        const spyIsSessionValid = jest
            .spyOn(index, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(index, 'isCookiesUUIDMatch')
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
            Location: '/error',
        });
    });

    it('should return 302 redirect to /error when session is not valid and cookies do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(index, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(index, 'isCookiesUUIDMatch')
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
            Location: '/error',
        });
    });
});
