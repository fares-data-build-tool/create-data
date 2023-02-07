import * as session from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as index from '../../../src/utils/apiUtils';
import { CREATE_CAPS_ATTRIBUTE } from '../../../src/constants/attributes';
import createCaps from '../../../src/pages/api/createCaps';

describe('createCaps', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
    jest.spyOn(index, 'getAndValidateNoc').mockReturnValue('BLAC');

    beforeEach(jest.resetAllMocks);

    it('redirects back to /createCaps if there is no user entry', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: '',
                capName: '',
                capPriceInput0: '',
                capDurationInput0: '',
                capDurationUnitsInput0: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            cap: { durationAmount: '', durationUnits: '', name: '', price: '' },
            errors: [
                { errorMessage: 'Cap name cannot have less than 2 characters', id: 'cap-name' },
                { errorMessage: 'Cap price cannot be empty', id: 'cap-price' },
                { errorMessage: 'Cap duration cannot be empty', id: 'cap-period-duration-quantity' },
                { errorMessage: 'Choose an option from the dropdown', id: 'cap-duration-unit' },
            ],
        });
    });

    it('redirects back to /createCaps if the user entry contains mistakes', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'hello',
                capPrice: '',
                capDuration: '2',
                capDurationUnits: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            cap: { durationAmount: '2', durationUnits: '', name: 'hello', price: '' },
            errors: [
                { errorMessage: 'Cap price cannot be empty', id: 'cap-price' },
                { errorMessage: 'Choose an option from the dropdown', id: 'cap-duration-unit' },
            ],
        });
    });

    it('redirects back to /createCaps if the user enters 0 as an input', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capName: 'Name',
                capPrice: '0',
                capDuration: '2',
                capDurationUnits: 'week',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            cap: { durationAmount: '2', durationUnits: 'week', name: 'Name', price: '0' },
            errors: [{ errorMessage: 'Cap prices cannot be zero', id: 'cap-price' }],
        });
    });

    it('redirects back to /createCaps if the user enters 000 as an input', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: 'Product',
                capName: 'Name',
                capPrice: '000',
                capDuration: '2',
                capDurationUnits: 'week',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CREATE_CAPS_ATTRIBUTE, {
            cap: { durationAmount: '2', durationUnits: 'week', name: 'Name', price: '000' },
            errors: [{ errorMessage: 'Cap prices cannot be zero', id: 'cap-price' }],
        });
    });
});
