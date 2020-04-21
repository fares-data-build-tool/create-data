import { getMockRequestAndResponse } from '../../testData/mockData';
import SingleOperator from '../../../src/pages/api/singleOperator';
import { ServiceLists } from '../../../src/interfaces';

const url = '/singleOperator?selectAll=false';

describe('Single Operator API', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to single operator page if there are errors', () => {
        const { req, res } = getMockRequestAndResponse({}, {}, {}, writeHeadMock, jest.fn(), {
            referer: 'http://localhost:5000/singleOperator?selectAll=false',
        });

        SingleOperator(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: url,
        });
    });

    it('should change the query string for select all to true when select all button is selected', () => {
        const { req, res } = getMockRequestAndResponse({}, { selectAll: 'Select All' }, {}, writeHeadMock, jest.fn(), {
            referer: 'http://localhost:5000/singleOperator?selectAll=false',
        });

        SingleOperator(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/singleOperator?selectAll=true',
        });
    });

    it('redirects if successful', () => {
        const serviceInfo: ServiceLists = {
            selectedServices: [
                {
                    lineName: '205',
                    startDate: '24/03/2020',
                    serviceDescription: 'service for line number 205',
                    checked: false,
                },
            ],
            error: false,
        };

        const { req, res } = getMockRequestAndResponse({}, { serviceInfo }, {}, writeHeadMock, jest.fn(), {
            referer: 'http://localhost:5000/singleOperator?selectAll=false',
        });

        SingleOperator(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
    });
});
