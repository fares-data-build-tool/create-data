import { getMockRequestAndResponse } from '../../testData/mockData';
import SingleOperator from '../../../src/pages/api/singleOperator';
import { ServiceLists } from '../../../src/interfaces';

describe('Single Operator API', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to single operator page if there are errors', () => {
        const { req, res } = getMockRequestAndResponse({}, {}, {}, writeHeadMock);

        SingleOperator(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleOperator',
        });
    });

    it('redirects if successful', () => {
        const serviceInfo: ServiceLists = {
            selectedServices: [{ lineName: '205', startDate: '24/03/2020' }],
            error: false,
        };

        const { req, res } = getMockRequestAndResponse({}, { serviceInfo }, {}, writeHeadMock);

        SingleOperator(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodProduct',
        });
    });
});
