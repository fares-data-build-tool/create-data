import { updateSessionAttribute } from '../../../src/utils/sessions';
import chooseValidity from '../../../src/pages/api/chooseValidity';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('chooseValidity', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const cases: {}[] = [
        [{}, { Location: '/chooseValidity' }],
        [{ validityInput: 'abcdefghijk' }, { Location: '/chooseValidity' }],
        [{ validityInput: '1.2' }, { Location: '/chooseValidity' }],
        [{ validityInput: 1.2 }, { Location: '/chooseValidity' }],
        [{ validityInput: '367' }, { Location: '/chooseValidity' }],
        [{ validityInput: 367 }, { Location: '/chooseValidity' }],
        [{ validityInput: '0' }, { Location: '/chooseValidity' }],
        [{ validityInput: 0 }, { Location: '/chooseValidity' }],
        [{ validityInput: "[]'l..33" }, { Location: '/chooseValidity' }],
        [{ validityInput: '-1' }, { Location: '/chooseValidity' }],
    ];

    test.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
        });
        chooseValidity(req, res);
        expect(res.writeHead).toBeCalledWith(302, expectedLocation);
    });

    it('should set the validity stages session according to the specified number of fare stages', () => {
        const { req, res } = getMockRequestAndResponse({ cookieValues: {}, body: { validityInput: '6' } });

        const mockSetSession = jest.fn();

        (updateSessionAttribute as {}) = jest.fn().mockImplementation(() => {
            mockSetSession();
        });

        chooseValidity(req, res);

        expect(mockSetSession).toBeCalledTimes(1);
    });
});
