import ticketConfirmation from '../../../src/pages/api/ticketConfirmation';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as index from '../../../src/utils/apiUtils';
import * as db from '../../../src/data/auroradb';
import { ExpiryUnit, FromDb } from '../../../src/interfaces/matchingJsonTypes';
import { CapInfo } from '../../../src/interfaces';

jest.mock('../../../src/utils/apiUtils');
jest.mock('../../../src/data/auroradb');

describe('ticketConfirmation', () => {
    const writeHeadMock = jest.fn();
    const getFareTypeSpy = jest.spyOn(index, 'getFareTypeFromFromAttributes');
    jest.spyOn(index, 'getAndValidateNoc').mockReturnValue('BLAC');
    const getCapsSpy = jest.spyOn(db, 'getCaps');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /selectCaps when the fareType if single and caps exist', async () => {
        const { req, res } = getMockRequestAndResponse({ body: null, mockWriteHeadFn: writeHeadMock });
        getFareTypeSpy.mockReturnValue('single');
        const cap: FromDb<CapInfo> = {
            cap: {
                name: 'Cap 1',
                price: '4',
                durationAmount: '2',
                durationUnits: 'hour' as ExpiryUnit,
            },
            id: 2,
        };

        getCapsSpy.mockImplementation(() => Promise.resolve([cap]));
        await ticketConfirmation(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCaps',
        });
    });
});
