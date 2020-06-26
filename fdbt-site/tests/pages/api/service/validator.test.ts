import { isSessionValid, isCookiesUUIDMatch } from '../../../../src/pages/api/service/validator';
import { getMockRequestAndResponse } from '../../../testData/mockData';

describe('validator', () => {
    describe('isSessionvalid', () => {
        it('should return true when there is an operator cookie', () => {
            const { req, res } = getMockRequestAndResponse();
            const result = isSessionValid(req, res);
            expect(result).toBeTruthy();
        });

        it('should return false when there is no operator cookie', () => {
            const { req, res } = getMockRequestAndResponse({ cookieValues: { operator: null } });
            const result = isSessionValid(req, res);
            expect(result).toBeFalsy();
        });
    });

    describe('isCookiesUUIDMatch', () => {
        it('should return true if uuids match', () => {
            const { req, res } = getMockRequestAndResponse();
            const result = isCookiesUUIDMatch(req, res);
            expect(result).toBeTruthy();
        });

        it('should return false id uuids do not match', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: null,
                uuid: {
                    operatorUuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
                    serviceUuid: '1e0459b3-1234-4e70-89db-96e8ae173e10',
                },
            });
            const result = isCookiesUUIDMatch(req, res);
            expect(result).toBeFalsy();
        });
    });
});
