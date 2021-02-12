import chooseValidity from '../../../src/pages/api/chooseValidity';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import { DURATION_VALID_ATTRIBUTE } from '../../../src/constants/attributes';

describe('chooseValidity', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const cases: {}[] = [
        [{}, { Location: '/chooseValidity' }],
        [{ validityInput: 'abcdefghijk', duration: 'day' }, { Location: '/chooseValidity' }],
        [{ duration: 'day' }, { Location: '/chooseValidity' }],
        [{ validityInput: '1.2' }, { Location: '/chooseValidity' }],
        [{ validityInput: 1.2 }, { Location: '/chooseValidity' }],
        [{ validityInput: '367' }, { Location: '/chooseValidity' }],
        [{ validityInput: 367 }, { Location: '/chooseValidity' }],
        [{ validityInput: '0' }, { Location: '/chooseValidity' }],
        [{ validityInput: 0 }, { Location: '/chooseValidity' }],
        [{ validityInput: "[]'l..33" }, { Location: '/chooseValidity' }],
        [{ validityInput: '-1' }, { Location: '/chooseValidity' }],
        [{ validityInput: '2', duration: 'day' }, { Location: '/periodValidity' }],
        [{ validityInput: '3', duration: 'hour' }, { Location: '/periodValidity' }],
        [{ validityInput: '2', duration: 'fortnights' }, { Location: '/chooseValidity' }],
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
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: { validityInput: '6', duration: 'day' },
        });

        chooseValidity(req, res);

        expect(updateSessionAttributeSpy).toBeCalledTimes(1);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, DURATION_VALID_ATTRIBUTE, {
            amount: '6',
            duration: 'day',
            errors: [],
        });
    });
});
