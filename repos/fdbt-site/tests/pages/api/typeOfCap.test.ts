import typeOfCap from '../../../src/pages/api/typeOfCap';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import { TYPE_OF_CAP_ATTRIBUTE } from '../../../src/constants/attributes';

describe('ticketRepresentation', () => {
    const writeHeadMock = jest.fn();

    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /typeOfCap when no type of cap is selected', () => {
        const { req, res } = getMockRequestAndResponse({ body: null, mockWriteHeadFn: writeHeadMock });
        typeOfCap(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/typeOfCap',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, TYPE_OF_CAP_ATTRIBUTE, {
            errorMessage: 'Choose a type of cap',
            id: 'radio-option-byDistance',
        });
    });

    it('should return 302 redirect to /typeOfCap when an incorrect type of cap is provided', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                typeOfCap: 'anything',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        typeOfCap(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/typeOfCap',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, TYPE_OF_CAP_ATTRIBUTE, {
            errorMessage: 'Choose a type of cap',
            id: 'radio-option-byDistance',
        });
    });

    it('should return 302 redirect to /selectCappedProductGroup when type of cap is byProducts', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                typeOfCap: 'byProducts',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        typeOfCap(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/selectCappedProductGroup',
        });

        expect(updateSessionAttributeSpy).toBeCalledTimes(1);
    });
    it('should return 302 redirect to /  defineCapPricingPerDistance when type of cap is byDistance', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                typeOfCap: 'byDistance',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        typeOfCap(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/defineCapPricingPerDistance',
        });

        expect(updateSessionAttributeSpy).toBeCalledTimes(0);
    });
});
