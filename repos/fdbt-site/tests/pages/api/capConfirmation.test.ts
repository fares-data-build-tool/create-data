import capConfirmation from '../../../src/pages/api/capConfirmation';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('capConfirmation', () => {
    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should redirect on fareType when the user logged in is not a scheme operator', () => {
        const { res } = getMockRequestAndResponse({
            mockWriteHeadFn: writeHeadMock,
        });
        capConfirmation(res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });
});
