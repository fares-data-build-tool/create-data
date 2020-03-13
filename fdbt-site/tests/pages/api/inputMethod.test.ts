import inputMethod from '../../../src/pages/api/inputMethod';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('inputMethod', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /inputMethod when no input method is selected', () => {
        const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
        inputMethod(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/inputMethod',
        });
    });

    it('should return 302 redirect to /error when an input method value we dont expect is passed', () => {
        const { req, res } = getMockRequestAndResponse({}, { inputMethod: 'pdf' }, {}, writeHeadMock);

        inputMethod(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it('should return 302 redirect to /csvUpload when csv is the passed input method', () => {
        const { req, res } = getMockRequestAndResponse({}, { inputMethod: 'csv' }, {}, writeHeadMock);

        inputMethod(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
    });
});
