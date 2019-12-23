import { getCookies, getDomain, setCookiOnResponseObject } from "../../../pages/api/apiUtils";
import { mockRequest, mockResponse } from "mock-req-res";
import { OPERATOR_COOKIE, SERVICE_COOKIE } from "../../../constants";
import * as libraryObject from 'set-cookie';

const MockReq = require('mock-req');

describe("apiUtils", () => {
    describe("getCookies", () => {
        it("should return cookies when given a request", () => {
            const operatorCookieValue = "%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D"
            const req = mockRequest({ 
                body: {},
                headers: {
                  host: "localhost",
                  cookie: `${OPERATOR_COOKIE}=${operatorCookieValue}; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
                }
              });
            const result = getCookies(req);
            expect(result[OPERATOR_COOKIE]).toEqual(operatorCookieValue);
        });
    });

    describe("getDomain", () => {
        it("should return the domain without a port number", () => {
            const expected = "localhost";
            const req = new MockReq({
                headers: {
                    'host': 'localhost:3000'
                }
            });
            const result = getDomain(req);
            expect(result).toEqual(expected);
        });
    });

    describe("setCookiOnResponseObject", () => {
        it("to call set cookie library", () => {
            const domain = "localhost";
            const cookieName = "test";
            const cookieValue = "cookieValue";
            const res = mockResponse();
            jest.mock('set-cookie');
            const mockSetCookie = require('set-cookie');
            mockSetCookie.mockImplementation();
            setCookiOnResponseObject(domain, cookieName, cookieValue, res);
            expect(mockSetCookie).toBeCalled();
            expect(mockSetCookie).toBeCalledWith(cookieName, cookieValue, {
                domain: domain,
                path: "/",
                maxAge: (3600 * 24),
                res: res
            });
        });
    });
    
})