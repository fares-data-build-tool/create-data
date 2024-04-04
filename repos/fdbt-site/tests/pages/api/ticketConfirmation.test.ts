import ticketConfirmation from '../../../src/pages/api/ticketConfirmation';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as index from '../../../src/utils/apiUtils';
import * as db from '../../../src/data/auroradb';
import { CapExpiryUnit, FromDb } from '../../../src/interfaces/matchingJsonTypes';
import { Cap } from '../../../src/interfaces';

describe('ticketConfirmation', () => {
    const writeHeadMock = jest.fn();
    const { req, res } = getMockRequestAndResponse({ body: {}, mockWriteHeadFn: writeHeadMock });
    const getFareTypeSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
    jest.spyOn(index, 'getAndValidateNoc').mockReturnValue('BLAC');
    jest.mock('../../../src/utils/apiUtils');
    jest.mock('../../../src/data/auroradb');
    const getCapsSpy = jest.spyOn(db, 'getCaps');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const cap: FromDb<Cap> = {
        capDetails: {
            name: 'Cap 1',
            price: '4',
            durationAmount: '2',
            durationUnits: 'month' as CapExpiryUnit,
            capExpiry: { productValidity: 'endOfCalendarDay', productEndTime: '' },
        },
        id: 2,
    };

    it('should return 302 redirect to /selectPurchaseMethods when the fareType is single and caps exist in production', async () => {
        process.env.STAGE = 'prod';
        getFareTypeSpy.mockReturnValue('single');

        getCapsSpy.mockResolvedValueOnce([cap]);
        await ticketConfirmation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });

    it('should return 302 redirect to /selectCaps when the fareType is single and caps exist in test / local', async () => {
        process.env.STAGE = 'test';
        getFareTypeSpy.mockReturnValue('single');

        getCapsSpy.mockResolvedValueOnce([cap]);
        await ticketConfirmation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCaps',
        });
    });

    it('should return 302 redirect to /selectPurchaseMethods when the fareType is single and no cap exists', async () => {
        getFareTypeSpy.mockReturnValue('single');
        getCapsSpy.mockResolvedValueOnce([]);
        await ticketConfirmation(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });

    it('should return 302 redirect to /selectPurchaseMethods when the fareType is period and no cap exists', async () => {
        getFareTypeSpy.mockReturnValue('period');
        getCapsSpy.mockResolvedValueOnce([]);
        await ticketConfirmation(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });

    it('should return 302 redirect to /selectPurchaseMethods when the fareType is period and caps exists', async () => {
        getFareTypeSpy.mockReturnValue('period');
        getCapsSpy.mockResolvedValueOnce([cap]);
        await ticketConfirmation(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });
});
