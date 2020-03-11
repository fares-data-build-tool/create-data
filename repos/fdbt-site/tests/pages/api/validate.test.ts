/* eslint-disable @typescript-eslint/no-explicit-any */

import { mockRequest } from 'mock-req-res';
import validateHandler from '../../../src/pages/api/validate';
import * as validator from '../../../src/pages/api/service/validator';

describe('validate handler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return a 200 with valid = true when session is valid and uuids match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(true);

        const req = mockRequest();

        const mockJson = jest.fn();
        const val = {
            json: mockJson,
        };

        const mockStatus = jest.fn().mockReturnValue(val);
        const res: any = {
            status: mockStatus,
        };
        validateHandler(req, res);

        expect(spyIsSessionValid).toHaveBeenCalled();
        expect(spyIsCookiesUUIDMatch).toHaveBeenCalled();

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ Valid: true });
    });

    it('should return a 401 with valid = false when session is not valid', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(true);

        const req = mockRequest();

        const mockJson = jest.fn();
        const val = {
            json: mockJson,
        };

        const mockStatus = jest.fn().mockReturnValue(val);
        const res: any = {
            status: mockStatus,
        };
        validateHandler(req, res);

        expect(spyIsSessionValid).toHaveBeenCalled();
        expect(spyIsCookiesUUIDMatch).not.toHaveBeenCalled();

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ Valid: false });
    });

    it('should return a 401 with valid = false when session is valid but uuids do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(true);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(false);

        const req = mockRequest();

        const mockJson = jest.fn();
        const val = {
            json: mockJson,
        };

        const mockStatus = jest.fn().mockReturnValue(val);
        const res: any = {
            status: mockStatus,
        };
        validateHandler(req, res);

        expect(spyIsSessionValid).toHaveBeenCalled();
        expect(spyIsCookiesUUIDMatch).toHaveBeenCalled();

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ Valid: false });
    });

    it('should return a 401 with valid = false when session is not valid and uuids do not match', () => {
        const spyIsSessionValid = jest
            .spyOn(validator, 'isSessionValid')
            .mockImplementation()
            .mockReturnValue(false);
        const spyIsCookiesUUIDMatch = jest
            .spyOn(validator, 'isCookiesUUIDMatch')
            .mockImplementation()
            .mockReturnValue(false);

        const req = mockRequest();

        const mockJson = jest.fn();
        const val = {
            json: mockJson,
        };

        const mockStatus = jest.fn().mockReturnValue(val);
        const res: any = {
            status: mockStatus,
        };
        validateHandler(req, res);

        expect(spyIsSessionValid).toHaveBeenCalled();
        expect(spyIsCookiesUUIDMatch).not.toHaveBeenCalled();

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ Valid: false });
    });
});
