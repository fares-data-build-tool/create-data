import priceEntry, { numberOfInputsIsValid, putDataInS3 } from '../../../src/pages/api/priceEntry';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('Price Entry API', () => {
    describe('API validation of number of price inputs', () => {
        it('should return true if number of price inputs matches implied number of price inputs in cookie', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: [
                    ['Acomb Lane-Canning', '100'],
                    ['BewBush-Canning', '120'],
                    ['BewBush-Acomb Lane', '1120'],
                    ['Chorlton-Canning', '140'],
                    ['Chorlton-Acomb Lane', '160'],
                    ['Chorlton-BewBush', '100'],
                    ['Crawley-Canning', '120'],
                    ['Crawley-Acomb Lane', '140'],
                    ['Crawley-BewBush', '160'],
                    ['Crawley-Chorlton', '100'],
                    ['Cranfield-Canning', '120'],
                    ['Cranfield-Acomb Lane', '140'],
                    ['Cranfield-BewBush', '160'],
                    ['Cranfield-Chorlton', '140'],
                    ['Cranfield-Crawley', '120'],
                ],
            });
            const result = numberOfInputsIsValid(req, res);
            expect(result).toBeTruthy();
        });

        it('should return false if number of price inputs matches implied number of price inputs in cookie', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: [
                    ['Acomb Lane-Canning', '100'],
                    ['BewBush-Canning', '120'],
                    ['BewBush-Acomb Lane', '1120'],
                    ['Chorlton-Canning', '140'],
                    ['Chorlton-Acomb Lane', '160'],
                    ['Chorlton-BewBush', '100'],
                    ['Crawley-Canning', '120'],
                ],
            });
            const result = numberOfInputsIsValid(req, res);
            expect(result).toBe(false);
        });
    });

    describe('API validation of format of price inputs', () => {
        const writeHeadMock = jest.fn();

        afterEach(() => {
            jest.resetAllMocks();
        });

        const cases: {}[] = [
            [{}, { Location: '/priceEntry' }],
            [{ ChorltonBewbush: 'abcdefghijk' }, { Location: '/priceEntry' }],
            [{ ChorltonBewbush: '1.2' }, { Location: '/priceEntry' }],
            [{ ChorltonBewbush: 1.2 }, { Location: '/priceEntry' }],
            [{ ChorltonBewbush: '0' }, { Location: '/priceEntry' }],
            [{ ChorltonBewbush: 0 }, { Location: '/priceEntry' }],
            [{ ChorltonBewbush: "[]'l..33" }, { Location: '/priceEntry' }],
        ];

        test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: testData,
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });
            priceEntry(req, res);
            expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
        });
    });

    describe('S3 bucket name validation', () => {
        it('should throw an error when there there is no S3 bucket name variable set', () => {
            const uuid = '780e3459-6305-4ae5-9082-b925b92cb46c';
            const text =
                '{"fareStages":[{"stageName":"Bewbush","prices":[{"price":"1.00","fareZones":["Chorlton"]},{"price":"1.20","fareZones":["Dewsbury"]}]},{"stageName":"Chorlton","prices":[{"price":"1.40","fareZones":["Dewsbury"]}]}]}';
            try {
                putDataInS3(uuid, text);
            } catch {
                expect(putDataInS3(uuid, text)).toThrow('No Bucket name environment variable not set.');
            }
        });
    });
});
