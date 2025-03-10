import { processSecondaryOperatorFareZone, processSecondaryOperatorServices, removeDuplicates } from '../lib/handler';
import { SelectedService, Stop } from 'fdbt-types/matchingJsonTypes';
import * as s3 from '../lib/s3';
import { AWSError } from 'aws-sdk';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import resetAllMocks = jest.resetAllMocks;

const mockStops: Partial<Stop>[] = [
    {
        stopName: 'Main Street',
        atcoCode: '123456',
    },
    {
        stopName: 'High Street',
        atcoCode: '654321',
    },
    {
        stopName: 'Park Avenue',
        atcoCode: '112233',
    },
    {
        stopName: 'Broadway',
        atcoCode: '445566',
    },
];

const mockServices: SelectedService[] = [
    {
        lineName: 'Route 1',
        lineId: 'R1',
        serviceCode: 'SC123',
        startDate: '2023-01-01',
        serviceDescription: 'Main route from downtown to uptown',
    },
    {
        lineName: 'Route 2',
        lineId: 'R2',
        serviceCode: 'SC456',
        startDate: '2023-01-01',
        serviceDescription: 'Main route from station to town hall',
    },
];

describe('removeDuplicates', () => {
    it('should remove duplicate objects based on a specified key', () => {
        const result = removeDuplicates(mockStops.concat(mockStops), 'atcoCode');

        expect(result).toEqual(mockStops);
    });

    it('should return the same array if there are no duplicates', () => {
        const result = removeDuplicates(mockStops, 'atcoCode');

        expect(result).toEqual(mockStops);
    });

    it('should handle an empty array', () => {
        const result = removeDuplicates([], 'atcoCode');

        expect(result).toEqual([]);
    });

    it('should handle an array with one element', () => {
        const result = removeDuplicates([mockStops[0]], 'atcoCode');

        expect(result).toEqual([mockStops[0]]);
    });
});

describe('processSecondaryOperatorServices', () => {
    const mockNocCodes = ['TEST1', 'TEST2', 'TEST3'];
    const getObjectSpy = jest.spyOn(s3, 'getS3Object');

    afterEach(() => {
        resetAllMocks();
    });

    it('should return process additionalOperators and exempt stops if they exist', async () => {
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST1',
                selectedServices: mockServices,
                exemptStops: mockStops.slice(0, 2),
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({ nocCode: 'TEST2', selectedServices: mockServices }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST3',
                selectedServices: mockServices,
                exemptStops: mockStops.slice(2, 4),
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        const result = await processSecondaryOperatorServices(
            mockNocCodes,
            'testMatchingJson/link',
            'TEST_PRODUCT_BUCKET',
        );

        expect(result).toEqual({
            additionalOperators: [
                {
                    nocCode: 'TEST1',
                    selectedServices: mockServices,
                },
                {
                    nocCode: 'TEST2',
                    selectedServices: mockServices,
                },
                {
                    nocCode: 'TEST3',
                    selectedServices: mockServices,
                },
            ],
            exemptStops: mockStops,
        });
        expect(getObjectSpy).toBeCalledTimes(3);
    });

    it('should return an empty array for additionalOperators and exemptStops if there is no S3 file for a secondary operator', async () => {
        getObjectSpy.mockRejectedValueOnce(new Error());
        const result = await processSecondaryOperatorServices(
            [mockNocCodes[0]],
            'testMatchingJson/link',
            'TEST_PRODUCT_BUCKET',
        );
        expect(result).toEqual({ additionalOperators: [], exemptStops: [] });
        expect(getObjectSpy).toBeCalledTimes(1);
    });

    it('should handle if one operator had not provided info but the other operators have', async () => {
        getObjectSpy.mockRejectedValueOnce(new Error());
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({ nocCode: 'TEST2', selectedServices: mockServices }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });

        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST3',
                selectedServices: mockServices,
                exemptStops: mockStops.slice(2, 4),
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        const result = await processSecondaryOperatorServices(
            mockNocCodes,
            'testMatchingJson/link',
            'TEST_PRODUCT_BUCKET',
        );
        expect(result).toEqual({
            additionalOperators: [
                {
                    nocCode: 'TEST2',
                    selectedServices: mockServices,
                },
                {
                    nocCode: 'TEST3',
                    selectedServices: mockServices,
                },
            ],
            exemptStops: mockStops.slice(2, 4),
        });
        expect(getObjectSpy).toBeCalledTimes(3);
    });
});

describe('processSecondaryOperatorFareZone', () => {
    const mockNocCodes = ['TEST1', 'TEST2', 'TEST3'];
    const getObjectSpy = jest.spyOn(s3, 'getS3Object');

    afterEach(() => {
        resetAllMocks();
    });

    it('should return stops and exemptedServices if they exist', async () => {
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST1',
                stops: mockStops,
                exemptedServices: mockServices.slice(0, 1),
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST2',
                stops: mockStops,
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST3',
                stops: mockStops,
                exemptedServices: mockServices.slice(1, 2),
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        const result = await processSecondaryOperatorFareZone(
            mockNocCodes,
            'testMatchingJson/link',
            'TEST_PRODUCT_BUCKET',
        );

        expect(result).toEqual({
            secondaryOperatorStops: [...mockStops, ...mockStops, ...mockStops],
            exemptedServices: mockServices,
        });
        expect(getObjectSpy).toBeCalledTimes(3);
    });

    it('should return an empty array for additionalOperators and exemptStops if there is no S3 file for a secondary operator', async () => {
        getObjectSpy.mockRejectedValueOnce(new Error());
        const result = await processSecondaryOperatorFareZone(
            [mockNocCodes[0]],
            'testMatchingJson/link',
            'TEST_PRODUCT_BUCKET',
        );
        expect(result).toEqual({ secondaryOperatorStops: [], exemptedServices: [] });
        expect(getObjectSpy).toBeCalledTimes(1);
    });

    it('should handle if one operator had not provided info but the other operators have', async () => {
        getObjectSpy.mockRejectedValueOnce(new Error());
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST2',
                stops: mockStops,
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        getObjectSpy.mockResolvedValueOnce({
            Body: JSON.stringify({
                nocCode: 'TEST3',
                stops: mockStops,
                exemptedServices: mockServices.slice(1, 2),
            }),
            $response: {} as AWS.Response<GetObjectOutput, AWSError>,
        });
        const result = await processSecondaryOperatorFareZone(
            mockNocCodes,
            'testMatchingJson/link',
            'TEST_PRODUCT_BUCKET',
        );
        expect(result).toEqual({
            secondaryOperatorStops: [...mockStops, ...mockStops],
            exemptedServices: mockServices.slice(1, 2),
        });
        expect(getObjectSpy).toBeCalledTimes(3);
    });
});
