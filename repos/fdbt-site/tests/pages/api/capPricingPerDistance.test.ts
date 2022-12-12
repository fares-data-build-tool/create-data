import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import capPricingPerDistance, { validateInput } from '../../../src/pages/api/capPricingPerDistance';
import { CapDistancePricing, DistanceCap, ErrorInfo } from '../../../src/interfaces';
import { CAP_PRICING_PER_DISTANCE_ATTRIBUTE } from '../../../src/constants/attributes';

describe('capPricingPerDistance', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('correctly generates cap info, updates the  CAP_PRICING_PER_DISTANCE_ATTRIBUTE and then redirects to /defineCapPricingPerDistance if all is valid', () => {
        const mockCapInfo: DistanceCap = {
            maximumPrice: '4',
            minimumPrice: '3',
            capPricing: [
                {
                    distanceFrom: '0',
                    distanceTo: '2',
                    pricePerKm: '5',
                },
                {
                    distanceFrom: '3',
                    distanceTo: 'Max',
                    pricePerKm: '5',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '3',
                distanceTo0: '2',
                maximumPrice: '4',
                minimumPrice: '3',
                pricePerKm1: '5',
                pricePerKm0: '5',
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
                id: `distance-to-0`,
                errorMessage: 'Distance to is required and needs to be number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '3',
                distanceTo0: '',
                maximumPrice: '4',
                minimumPrice: '3',
                pricePerKm1: '5',
                pricePerKm0: '6',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: {
                maximumPrice: '4',
                minimumPrice: '3',
                capPricing: [
                    {
                        distanceFrom: '0',
                        distanceTo: '',
                        pricePerKm: '6',
                    },
                    {
                        distanceFrom: '3',
                        distanceTo: 'Max',
                        pricePerKm: '5',
                    },
                ],
            },
            errors,
        });
    });

    it('produces an error when distanceFrom is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: `distance-from-1`,
                errorMessage: 'Distance from is required and needs to be number',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '',
                distanceTo0: '2',
                maximumPrice: '4',
                minimumPrice: '3',
                pricePerKm1: '5',
                pricePerKm0: '5',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            errors,
            capPricePerDistances: {
                maximumPrice: '4',
                minimumPrice: '3',
                capPricing: [
                    { distanceFrom: '0', distanceTo: '2', pricePerKm: '5' },
                    {
                        distanceFrom: '',
                        distanceTo: 'Max',
                        pricePerKm: '5',
                    },
                ],
            },
        });
    });

    it('produces an error when maximumPrice is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: `maximum-price`,
                errorMessage: 'Maximum Price cannot be empty',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '2',
                distanceTo0: '2',
                maximumPrice: '',
                minimumPrice: '3',
                pricePerKm1: '5',
                pricePerKm0: '2',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: {
                maximumPrice: '',
                minimumPrice: '3',
                capPricing: [
                    {
                        distanceFrom: '0',
                        distanceTo: '2',
                        pricePerKm: '2',
                    },
                    {
                        distanceFrom: '2',
                        distanceTo: 'Max',
                        pricePerKm: '5',
                    },
                ],
            },
            errors,
        });
    });

    it('produces an error when minimumPrice is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: `minimum-price`,
                errorMessage: 'Minimum Price cannot be empty',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '2',
                distanceTo0: '2',
                maximumPrice: '3',
                minimumPrice: '',
                pricePerKm1: '5',
                pricePerKm0: '5',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: {
                maximumPrice: '3',
                minimumPrice: '',
                capPricing: [
                    {
                        distanceFrom: '0',
                        distanceTo: '2',
                        pricePerKm: '5',
                    },
                    {
                        distanceFrom: '2',
                        distanceTo: 'Max',
                        pricePerKm: '5',
                    },
                ],
            },
            errors,
        });
    });

    it('produces an error when pricePerKm is empty', () => {
        const errors: ErrorInfo[] = [
            {
                id: `price-per-km-1`,
                errorMessage: 'Price Per Km cannot be empty',
            },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                distanceFrom1: '2',
                distanceTo0: '2',
                maximumPrice: '3',
                minimumPrice: '2',
                pricePerKm0: '2',
                pricePerKm1: '',
            },
        });

        capPricingPerDistance(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE, {
            capPricePerDistances: {
                maximumPrice: '3',
                minimumPrice: '2',
                capPricing: [
                    { distanceFrom: '0', distanceTo: '2', pricePerKm: '2' },
                    {
                        distanceFrom: '2',
                        distanceTo: 'Max',
                        pricePerKm: '',
                    },
                ],
            },
            errors,
        });
    });
});

describe('validate input tests', () => {
    it('validates input for distance from', () => {
        const capPricePerDistances: CapDistancePricing[] = [
            {
                distanceFrom: '0',
                distanceTo: '2',
                pricePerKm: '5',
            },
            {
                distanceFrom: 'a',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [
            { id: `distance-from-1`, errorMessage: 'Distance from is required and needs to be number' },
        ];

        const errors = validateInput(capPricePerDistances, 1, '3', '4');

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for distance to', () => {
        const capPricePerDistances: CapDistancePricing[] = [
            {
                distanceFrom: '0',
                distanceTo: 'b',
                pricePerKm: '5',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [
            { id: `distance-to-0`, errorMessage: 'Distance to is required and needs to be number' },
        ];

        const errors = validateInput(capPricePerDistances, 1, '3', '4');

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for maximum price', () => {
        const capPricePerDistances: CapDistancePricing[] = [
            {
                distanceFrom: '0',
                distanceTo: '3',
                pricePerKm: '5',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [
            { id: `maximum-price`, errorMessage: 'This must be a valid price in pounds and pence' },
        ];

        const errors = validateInput(capPricePerDistances, 1, '2', 'a');

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for minimum price', () => {
        const capPricePerDistances: CapDistancePricing[] = [
            {
                distanceFrom: '0',
                distanceTo: '3',
                pricePerKm: '5',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: '5',
            },
        ];
        const errorsResult: ErrorInfo[] = [
            { id: `minimum-price`, errorMessage: 'This must be a valid price in pounds and pence' },
        ];

        const errors = validateInput(capPricePerDistances, 1, 'a', '2');

        expect(errors).toEqual(errorsResult);
    });

    it('validates input for price per km', () => {
        const capPricePerDistances: CapDistancePricing[] = [
            {
                distanceFrom: '0',
                distanceTo: '3',
                pricePerKm: '2',
            },
            {
                distanceFrom: '3',
                distanceTo: 'Max',
                pricePerKm: 'a',
            },
        ];
        const errorsResult: ErrorInfo[] = [
            { id: `price-per-km-1`, errorMessage: 'This must be a valid price in pounds and pence' },
        ];

        const errors = validateInput(capPricePerDistances, 1, '1', '2');

        expect(errors).toEqual(errorsResult);
    });
});
