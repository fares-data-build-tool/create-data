import { getHost, deleteCookieOnServerSide, isSessionValid } from "../../utils";
import { NextPageContext } from "next";
import { OPERATOR_COOKIE, SERVICE_COOKIE } from "../../constants";
import { mockRequest, mockResponse } from "mock-req-res";
import moxios from 'moxios'

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

    describe("isSessionValid", () => {

        beforeEach(function () {
            moxios.install()
        });

        afterEach(function () {
            moxios.uninstall()
        });

        it("should return true when axios returns true", async () => {
            const url = "/test"
            const responseBoolean = true;
            moxios.stubRequest(url, {
                status: 200,
                response:
                    { Valid: responseBoolean }
            });
            const req = mockRequest({
                headers: {
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
                }
            });
            const result = await isSessionValid(url, req);
            expect(result).toEqual(responseBoolean);
        });

        it("should return false when axios returns false", async () => {
            const url = "/test"
            const responseBoolean = false;
            moxios.stubRequest(url, {
                status: 200,
                response:
                    { Valid: responseBoolean }
            });
            const req = mockRequest({
                headers: {
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
                }
            });
            const result = await isSessionValid(url, req);
            expect(result).toEqual(responseBoolean);
        });

        it("should return false when axios throws error", async () => {
            const url = "/test"
            const responseBoolean = false;
            moxios.stubRequest(url, {
                status: 500
            });
            const req = mockRequest({
                headers: {
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
                }
            });
            const result = await isSessionValid(url, req);
            expect(result).toEqual(responseBoolean);
        });

    });



});
