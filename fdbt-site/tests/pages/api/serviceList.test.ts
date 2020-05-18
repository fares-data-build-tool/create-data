import { getMockRequestAndResponse } from '../../testData/mockData';
import serviceList from '../../../src/pages/api/serviceList';

describe('serviceList', () => {
    const selectAllFalseUrl = '/serviceList?selectAll=false';
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects back to /serviceList if there are errors', () => {
        const { req, res } = getMockRequestAndResponse({ fareType: 'period' }, {}, {}, writeHeadMock, jest.fn(), {
            referer: `http://localhost:5000${selectAllFalseUrl}`,
        });

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllFalseUrl,
        });
    });

    it('should change the query string for select all to true when select all button is selected', () => {
        const selectAllTrueUrl = '/serviceList?selectAll=true';
        const { req, res } = getMockRequestAndResponse(
            { fareType: 'period' },
            { selectAll: 'Select All' },
            {},
            writeHeadMock,
            jest.fn(),
            {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
        );

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: selectAllTrueUrl,
        });
    });

    it('redirects to /howManyProducts if input is valid and the user is entering details for a period ticket', () => {
        const serviceInfo = {
            '64': 'Leeds-Bradford#12/02/12',
            '45': 'gggggg#02/03/91',
            '47': 'hhhhhh#23/04/20',
        };

        const { req, res } = getMockRequestAndResponse(
            { fareType: 'period' },
            { ...serviceInfo },
            {},
            writeHeadMock,
            jest.fn(),
            {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
        );

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
    });

    it('redirects to /productDetails if input is valid and the user is entering details for a flat fare ticket', () => {
        const serviceInfo = {
            '64': 'Leeds-Bradford#12/02/12',
            '45': 'gggggg#02/03/91',
            '47': 'hhhhhh#23/04/20',
        };

        const { req, res } = getMockRequestAndResponse(
            { fareType: 'flatFare' },
            { ...serviceInfo },
            {},
            writeHeadMock,
            jest.fn(),
            {
                referer: `http://localhost:5000${selectAllFalseUrl}`,
            },
        );

        serviceList(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDetails',
        });
    });
});
