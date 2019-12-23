import { getHost } from "../../../utils";
import { getCookies, getDomain } from "../../../pages/api/apiUtils";

const MockReq = require('mock-req');

describe("apiUtils", () => {
    describe("getCookies", () => {
        it("should return cookies when given a request", () => {
            const req = new MockReq({
                headers: {
                    'Cookies': [{
                        'Cookie': 'ThisIsTheTestCookie'
                    }]
                }
            });
            const returnedObject = getCookies(req);
    
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