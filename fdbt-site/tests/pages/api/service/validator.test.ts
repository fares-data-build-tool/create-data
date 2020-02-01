import { mockRequest } from 'mock-req-res';
import { isSessionValid, isCookiesUUIDMatch } from '../../../../src/pages/api/service/validator';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../../../src/constants';

describe('validator', () => {
    describe('isSessionvalid', () => {
        it('should return a true when there is an operator cookie', () => {
            const expected = true;
            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                body: {},
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
                },
            });
            const result = isSessionValid(req);
            expect(result).toEqual(expected);
        });
        it('should return false when there is no operator cookie', () => {
            const expected = false;
            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                body: {},
                headers: {
                    host: 'localhost:5000',
                    cookie: `${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
                },
            });
            const result = isSessionValid(req);
            expect(result).toEqual(expected);
        });
    });

    describe('isCookiesUUIDMatch', () => {
        it('should return a true if uuids match', () => {
            const expected = true;
            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                body: {},
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`,
                },
            });
            const result = isCookiesUUIDMatch(req);
            expect(result).toEqual(expected);
        });

        it('should return false id uuids do not match', () => {
            const expected = false;
            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                body: {},
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8x0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
                },
            });
            const result = isCookiesUUIDMatch(req);
            expect(result).toEqual(expected);
        });
    });
});
