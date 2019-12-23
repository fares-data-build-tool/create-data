import {getHost, deleteCookieOnServerSide } from "../../utils"; 
import { IncomingMessage } from "http";
import { NextPageContext } from "next";

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
            const props: NextPageContext = {
                pathname: “”,
                query: {},
                req: req,
                res: res,
                AppTree: null
              };
              const cookieName = "test";
            const result = deleteCookieOnServerSide(props, cookieName);  
            const expected = 
            expect(result).toEqual(expected);
        });
    }
