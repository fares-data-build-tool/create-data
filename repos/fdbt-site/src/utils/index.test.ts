import { checkIfMultiOperatorProductIsIncomplete } from '../../src/utils';
import { getProductsAdditionalOperatorInfo } from '../../src/data/s3';
import logger from '../../src/utils/logger';

jest.mock('../../src/data/s3');
jest.mock('../../src/utils/logger');

describe('checkIfMultiOperatorProductIsIncomplete', () => {
    const mockProductMatchingJsonLink = 'path/to/matchingJson.json';

    it('should return true if secondaryOperatorFareInfo has no stops', async () => {
        (getProductsAdditionalOperatorInfo as jest.Mock).mockResolvedValue({ stops: [] });

        const result = await checkIfMultiOperatorProductIsIncomplete(mockProductMatchingJsonLink, 'NOC');

        expect(result).toBe(true);
    });

    it('should return true if secondaryOperatorFareInfo has no selectedServices', async () => {
        (getProductsAdditionalOperatorInfo as jest.Mock).mockResolvedValue({ selectedServices: [] });

        const result = await checkIfMultiOperatorProductIsIncomplete(mockProductMatchingJsonLink, 'NOC');

        expect(result).toBe(true);
    });

    it('should return false if secondaryOperatorFareInfo has stops', async () => {
        (getProductsAdditionalOperatorInfo as jest.Mock).mockResolvedValue({
            zoneName: 'Test Town Centre',
            stops: [
                {
                    stopName: 'Campbell Avenue',
                    naptanCode: '32900357',
                    atcoCode: '3290YYA00357',
                    localityCode: 'E0043596',
                    localityName: 'Holgate',
                    parentLocalityName: 'York',
                    indicator: 'opp',
                    street: 'Hamilton Drive',
                },
            ],
        });

        const result = await checkIfMultiOperatorProductIsIncomplete(mockProductMatchingJsonLink, 'NOC');

        expect(result).toBe(false);
    });

    it('should return false if secondaryOperatorFareInfo has selectedServices', async () => {
        (getProductsAdditionalOperatorInfo as jest.Mock).mockResolvedValue({
            selectedServices: [
                {
                    lineId: '3h3vsergesrhg',
                    lineName: '343',
                    serviceCode: '11-444-_-y08-1',
                    serviceDescription: 'Test Under Lyne - Glossop',
                    startDate: '07/04/2020',
                },
                {
                    lineId: '3h3vtrhtherhed',
                    lineName: '444',
                    serviceCode: 'NW_01_MCT_391_1',
                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                    startDate: '23/04/2019',
                },
                {
                    lineId: '3h3vb32ik',
                    lineName: '543',
                    serviceCode: 'NW_04_MCTR_232_1',
                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                    startDate: '06/04/2020',
                },
            ],
        });

        const result = await checkIfMultiOperatorProductIsIncomplete(mockProductMatchingJsonLink, 'NOC');

        expect(result).toBe(false);
    });

    it('should log an error and return true if an exception is thrown', async () => {
        (getProductsAdditionalOperatorInfo as jest.Mock).mockRejectedValue(new Error('Test error'));

        const result = await checkIfMultiOperatorProductIsIncomplete(mockProductMatchingJsonLink, 'NOC');

        expect(logger.error).toHaveBeenCalledWith(`Couldn't get additional operator info for noc: NOC`);
        expect(result).toBe(true);
    });
});
