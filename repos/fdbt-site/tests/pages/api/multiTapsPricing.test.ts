import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/utils/apiUtils';
import { MULTI_TAPS_PRICING_ATTRIBUTE, NUMBER_OF_TAPS_ATTRIBUTE } from '../../../src/constants/attributes';
import * as sessions from '../../../src/utils/sessions';
import multiTapsPricing from '../../../src/pages/api/multiTapsPricing';

describe('multiTapsPricing', () => {
    let writeHeadMock: jest.Mock;
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    beforeEach(() => {
        writeHeadMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: any[] = [
        [
            {
                multiTapPriceInput0: '-1',
            },
            { Location: '/multiTapsPricing' },
        ],

        [
            {
                multiTapPriceInput0: '',
            },
            { Location: '/multiTapsPricing' },
            'period',
        ],
        [
            {
                multiTapPriceInput0: '0',
            },
            { Location: '/multiTapsPricing' },
            'period',
        ],
        [
            {
                multiTapPriceInput0: '2.00',
                multiTapPriceInput1: '0',
            },
            { Location: '/multiTapsPricing' },
            'period',
        ],
    ];

    it.each(cases)('given %p as request, redirects to %p', (testData, expectedLocation) => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {},
        });

        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        multiTapsPricing(req, res);
        expect(writeHeadMock).toBeCalledWith(302, expectedLocation);
    });

    it('redirects to /createCaps for a valid user input', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                multiTapPriceInput0: '2.00',
                multiTapPriceInput1: '4.00',
            },
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {},
        });

        jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        multiTapsPricing(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, NUMBER_OF_TAPS_ATTRIBUTE, 2);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTI_TAPS_PRICING_ATTRIBUTE, {
            taps: [
                {
                    tapPrice: '2.00',
                    tapPriceId: 'multi-tap-price-0',
                },
                {
                    tapPrice: '4.00',
                    tapPriceId: 'multi-tap-price-1',
                },
            ],
        });

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/createCaps' });
    });
});
