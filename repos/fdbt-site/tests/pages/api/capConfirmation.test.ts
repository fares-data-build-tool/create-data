import capConfirmation from '../../../src/pages/api/capConfirmation';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('capConfirmation', () => {
    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should redirect on selectPurchaseMethods', () => {
        const { res } = getMockRequestAndResponse({
            mockWriteHeadFn: writeHeadMock,
        });
        capConfirmation(res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });
});
