import { getHost, deleteCookieOnServerSide } from "../../utils";
import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { OPERATOR_COOKIE, SERVICE_COOKIE } from "../../constants";
import { mockRequest, mockResponse } from "mock-req-res";

var MockReq = require('mock-req');

describe("utils", () => {
    describe("getHost", () => {
        it("should return http when host is localhost", () => {
            const expected = "http://localhost";
            const req = new MockReq({
                headers: {
                    'host': 'localhost'
                }
            });
            const result = getHost(req);
            expect(result).toEqual(expected);
        });

        it("should return https when host not localhost", () => {
            const expected = "https://a.com"
            const req = new MockReq({
                headers: {
                    'host': 'a.com'
                }
            });
            const result = getHost(req);
            console.log(result);
            expect(result).toEqual(expected);
        });
    });
    describe("deleteCookiesOnServerSide", () => {
        it("should delete cookie", () => {
            const req = mockRequest({
                connection: {
                    encrypted: false
                },
                body: {},
                headers: {
                    host: "localhost:5000",
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
                }
            });

            const mockToAssessOn = jest.fn();
            const res = mockResponse({
                writeHead: jest.fn(),
                cookies: {},
                setHeader: {
                    call: mockToAssessOn
                },
                set: undefined //important for mockToAssessOn to be used
            });

            const ctx: NextPageContext = {
                pathname: "",
                query: {},
                req: req,
                res: res,
                AppTree: null
            };

            deleteCookieOnServerSide(ctx, OPERATOR_COOKIE);
            expect(mockToAssessOn).toBeCalled();
        });
    });
});
