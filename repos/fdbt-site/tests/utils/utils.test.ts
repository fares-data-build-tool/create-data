import MockReq from 'mock-req';
import { getHost, formatStopName } from '../../src/utils';
import { Stop } from '../../src/data/dynamodb';

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
        };

        const noLocalityName: Stop = {
            stopName: 'Test Stop',
            naptanCode: '12345',
            atcoCode: 'gvgvxgasvx',
            localityCode: 'GHS167',
            localityName: '',
            indicator: 'SE',
            street: 'Test Street',
        };

        const noStreet: Stop = {
            stopName: 'Test Stop',
            naptanCode: '12345',
            atcoCode: 'gvgvxgasvx',
            localityCode: 'GHS167',
            localityName: 'Test Town',
            indicator: 'SE',
            street: '',
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
});
