import capConfirmation from '../../../src/pages/api/capConfirmation';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('capConfirmation', () => {
    const writeHeadMock = jest.fn();

    it('should redirect on selectPurchaseMethods', () => {
        const { req, res } = getMockRequestAndResponse({
            mockWriteHeadFn: writeHeadMock,
        });
        capConfirmation(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectPurchaseMethods',
        });
    });
});
