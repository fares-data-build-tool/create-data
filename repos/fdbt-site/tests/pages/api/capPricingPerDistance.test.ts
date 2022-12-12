import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import capPricingPerDistance, { validateInput } from '../../../src/pages/api/capPricingPerDistance';
import { CapPricePerDistances, ErrorInfo } from '../../../src/interfaces';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../../src/constants/attributes';

describe('capPricingPerDistance', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates cap info, updates the  CAP_PRICING_PER_DISTANCE_ATTRIBUTE and then redirects to /defineCapPricingPerDistance if all is valid', () => {
        const mockCapInfo: CapPricePerDistances[] = [
            {
                distanceFrom: '0',
                distanceTo: '2',
                maximumPrice: '4',
                minimumPrice: '3',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '3',
                distanceTo0: '2',
                maximumPrice0: '4',
                minimumPrice0: '3',
                pricePerKm1: '5',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: mockCapInfo,
            errors: [],
        });

        expect(writeHeadMock).toBeCalledWith(302, { Location: '/defineCapPricingPerDistance' });
    });

    it('produces an error when distanceTo is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: '',
                errorMessage: 'Distance to must be defined and a number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '3',
                distanceTo0: '',
                maximumPrice0: '4',
                minimumPrice0: '3',
                pricePerKm1: '5',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: [
                {
                    distanceFrom: '0',
                    distanceTo: '',
                    maximumPrice: '4',
                    minimumPrice: '3',
                    pricePerKm: undefined,
                },
                {
                    distanceFrom: '3',
                    distanceTo: 'Max',
                    maximumPrice: undefined,
                    minimumPrice: undefined,
                    pricePerKm: '5',
                },
            ],
            errors,
        });
    });

    it('produces an error when distanceFrom is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: '',
                errorMessage: 'Distance from must be defined and a number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '',
                distanceTo0: '2',
                maximumPrice0: '4',
                minimumPrice0: '3',
                pricePerKm1: '5',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            errors,
            capPricePerDistances: [
                { distanceFrom: '0', distanceTo: '2', maximumPrice: '4', minimumPrice: '3', pricePerKm: undefined },
                {
                    distanceFrom: '',
                    distanceTo: 'Max',
                    maximumPrice: undefined,
                    minimumPrice: undefined,
                    pricePerKm: '5',
                },
            ],
        });
    });

    it('produces an error when maximumPrice is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: '',
                errorMessage: 'Maximum price to must be defined and a number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '2',
                distanceTo0: '2',
                maximumPrice0: '',
                minimumPrice0: '3',
                pricePerKm1: '5',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: [
                {
                    distanceFrom: '0',
                    distanceTo: '2',
                    maximumPrice: '',
                    minimumPrice: '3',
                    pricePerKm: undefined,
                },
                {
                    distanceFrom: '2',
                    distanceTo: 'Max',
                    maximumPrice: undefined,
                    minimumPrice: undefined,
                    pricePerKm: '5',
                },
            ],
            errors,
        });
    });

    it('produces an error when minimumPrice is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: '',
                errorMessage: 'Minimum price to must be defined and a number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '2',
                distanceTo0: '2',
                maximumPrice0: '3',
                minimumPrice0: '',
                pricePerKm1: '5',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: [
                {
                    distanceFrom: '0',
                    distanceTo: '2',
                    maximumPrice: '3',
                    minimumPrice: '',
                    pricePerKm: undefined,
                },
                {
                    distanceFrom: '2',
                    distanceTo: 'Max',
                    maximumPrice: undefined,
                    minimumPrice: undefined,
                    pricePerKm: '5',
                },
            ],
            errors,
        });
    });

    it('produces an error when pricePerKm is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: '',
                errorMessage: 'Price per km price to must be defined and a number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '2',
                distanceTo0: '2',
                maximumPrice0: '3',
                minimumPrice0: '2',
                pricePerKm1: '',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: [
                { distanceFrom: '0', distanceTo: '2', maximumPrice: '3', minimumPrice: '2', pricePerKm: undefined },
                {
                    distanceFrom: '2',
                    distanceTo: 'Max',
                    maximumPrice: undefined,
                    minimumPrice: undefined,
                    pricePerKm: '',
                },
            ],
            errors,
        });
    });
});

describe('validate input tests', () => {
    it('validates input for distance from', () => {
        const capPricePerDistances: CapPricePerDistances[] = [
            {
                distanceFrom: '0',
                distanceTo: '2',
                maximumPrice: '4',
                minimumPrice: '3',
            },
            {
                distanceFrom: 'a',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [{ id: '', errorMessage: 'Distance from must be defined and a number' }];

        const errors = validateInput(capPricePerDistances, 1);

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for distance to', () => {
        const capPricePerDistances: CapPricePerDistances[] = [
            {
                distanceFrom: '0',
                distanceTo: 'b',
                maximumPrice: '4',
                minimumPrice: '3',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [{ id: '', errorMessage: 'Distance to must be defined and a number' }];

        const errors = validateInput(capPricePerDistances, 1);

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for maximum price', () => {
        const capPricePerDistances: CapPricePerDistances[] = [
            {
                distanceFrom: '0',
                distanceTo: '3',
                maximumPrice: 'a',
                minimumPrice: '3',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [{ id: '', errorMessage: 'Maximum price to must be defined and a number' }];

        const errors = validateInput(capPricePerDistances, 1);

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for minimum price', () => {
        const capPricePerDistances: CapPricePerDistances[] = [
            {
                distanceFrom: '0',
                distanceTo: '3',
                maximumPrice: '2',
                minimumPrice: 'a',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [{ id: '', errorMessage: 'Minimum price to must be defined and a number' }];

        const errors = validateInput(capPricePerDistances, 1);

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for price per km', () => {
        const capPricePerDistances: CapPricePerDistances[] = [
            {
                distanceFrom: '0',
                distanceTo: '3',
                maximumPrice: '2',
                minimumPrice: '1',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: 'a',
            },
        ];
        const errorsResult: ErrorInfo[] = [
            { id: '', errorMessage: 'Price per km price to must be defined and a number' },
        ];

        const errors = validateInput(capPricePerDistances, 1);

        expect(errors).toEqual(errorsResult);
    });
});
