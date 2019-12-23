import { getHost } from "../../../utils";
import { getCookies, getDomain } from "../../../pages/api/apiUtils";
import { mockRequest } from "mock-req-res";
import { OPERATOR_COOKIE, SERVICE_COOKIE } from "../../../constants";

const MockReq = require('mock-req');

describe("apiUtils", () => {
    describe("getCookies", () => {
        it("should return cookies when given a request", () => {
            const operatorCookieValue = "%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D"
            const servcie
            const req = mockRequest({ 
                body: {},
                headers: {
                  host: "localhost",
                  cookie: `${OPERATOR_COOKIE}=${cookieValue}; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
                }
              });
            const result = getCookies(req);
            expect(result[OPERATOR_COOKIE]).toEqual(cookieValue);
        });
    });
})

describe("apiUtils", () => {
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
})