import MockReq from 'mock-req';
import { NextPageContext } from 'next';
import {
    getHost,
    formatStopName,
    getAttributeFromIdToken,
    getAndValidateSchemeOpRegion,
    isSchemeOperator,
} from '../../src/utils';
import { Stop } from '../../src/data/auroradb';
import { getMockContext, mockSchemOpIdToken } from '../testData/mockData';

describe('utils', () => {
    describe('getHost', () => {
        it('should return http when host is localhost', () => {
            const expected = 'http://localhost';
            const req = new MockReq({
                headers: {
                    host: 'localhost',
                    origin: 'localhost',
                },
            });
            const result = getHost(req);
            expect(result).toEqual(expected);
        });

        it('should return https when host not localhost', () => {
            const expected = 'https://a.com';
            const req = new MockReq({
                headers: {
                    host: 'a.com',
                    origin: 'https://a.com',
                },
            });
            const result = getHost(req);
            expect(result).toEqual(expected);
        });
    });

    describe('formatStopName', () => {
        const allFields: Stop = {
            stopName: 'Test Stop',
            naptanCode: '12345',
            atcoCode: 'gvgvxgasvx',
            localityCode: 'GHS167',
            localityName: 'Test Town',
            indicator: 'SE',
            street: 'Test Street',
            parentLocalityName: 'Another town',
        };

        const noLocalityName: Stop = {
            stopName: 'Test Stop',
            naptanCode: '12345',
            atcoCode: 'gvgvxgasvx',
            localityCode: 'GHS167',
            localityName: '',
            indicator: 'SE',
            street: 'Test Street',
            parentLocalityName: 'different town',
        };

        const noStreet: Stop = {
            stopName: 'Test Stop',
            naptanCode: '12345',
            atcoCode: 'gvgvxgasvx',
            localityCode: 'GHS167',
            localityName: 'Test Town',
            indicator: 'SE',
            street: '',
            parentLocalityName: 'yorkshire town',
        };

        const testCases = [
            [allFields, 'Test Town, SE Test Stop (on Test Street)'],
            [noLocalityName, 'SE Test Stop (on Test Street)'],
            [noStreet, 'Test Town, SE Test Stop'],
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        it.each(testCases)('correctly formats stop name for given naptan data', (naptanData: any, expected) => {
            const formattedName = formatStopName(naptanData);

            expect(formattedName).toBe(expected);
        });
    });

    describe('getAttributeFromIdToken', () => {
        let emailJwt: string;
        let ctx: NextPageContext;

        beforeEach(() => {
            // This JWT encodes an email of test@example.com
            emailJwt =
                'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.pwd0gdkeSRBqRpoNKxC8lK3SuydPKqKPRRdEE-eNEc0';
            ctx = getMockContext({
                cookies: {
                    idToken: emailJwt,
                },
            });
        });

        it('should retrieve given attribute if present', () => {
            const email = getAttributeFromIdToken(ctx, 'email');

            expect(email).toBe('test@example.com');
        });

        it('should return null if not present', () => {
            const email = getAttributeFromIdToken(ctx, 'custom:noc');

            expect(email).toBeNull();
        });
    });

    describe('getAndValidateSchemeOpRegion', () => {
        it('should return the scheme operator region code when the logged in user is a scheme operator', () => {
            const ctx = getMockContext({
                cookies: {
                    operator: { operator: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                    idToken: mockSchemOpIdToken,
                },
            });
            const region = getAndValidateSchemeOpRegion(ctx);
            expect(region).toBe('SCHEME_REGION');
        });

        it('should return null when the logged in user is not a scheme operator', () => {
            const ctx = getMockContext();
            const region = getAndValidateSchemeOpRegion(ctx);
            expect(region).toEqual(null);
        });

        it('should throw an error when the idToken and OPERATOR_COOKIE do not match', () => {
            const ctx = getMockContext({ cookies: { idToken: mockSchemOpIdToken } });
            expect(() => getAndValidateSchemeOpRegion(ctx)).toThrow();
        });
    });

    describe('isSchemeOperator', () => {
        it('should return true when the user logged in is a scheme operator', () => {
            const ctx = getMockContext({
                cookies: {
                    operator: { operator: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                    idToken: mockSchemOpIdToken,
                },
            });
            const res = isSchemeOperator(ctx);
            expect(res).toEqual(true);
        });

        it('should return false when the user logged in is not a scheme operator', () => {
            const ctx = getMockContext();
            const res = isSchemeOperator(ctx);
            expect(res).toEqual(false);
        });
    });
});
