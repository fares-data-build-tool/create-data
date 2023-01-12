import * as session from '../../../src/utils/sessions';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as index from '../../../src/utils/apiUtils';
import { CAPS_ATTRIBUTE } from '../../../src/constants/attributes';
import createCaps from '../../../src/pages/api/createCaps';

describe('createCaps', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');
    jest.spyOn(index, 'getAndValidateNoc').mockReturnValue('BLAC');

    beforeEach(jest.resetAllMocks);

    it('redirects back to /createCaps if there is no user entry', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: '',
                capNameInput0: '',
                capPriceInput0: '',
                capDurationInput0: '',
                capDurationUnitsInput0: '',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPS_ATTRIBUTE, {
            caps: [{ durationAmount: '', durationUnits: '', name: '', price: '' }],
            errors: [
                { errorMessage: 'Product name cannot have less than 2 characters', id: 'capped-product-name' },
                { errorMessage: 'Cap name cannot have less than 2 characters', id: 'cap-name-0' },
                { errorMessage: 'Cap price cannot be empty', id: 'cap-price-0' },
                { errorMessage: 'Cap duration cannot be empty', id: 'cap-period-duration-quantity-0' },
                { errorMessage: 'Choose an option from the dropdown', id: 'cap-duration-unit-0' },
            ],
            productName: '',
        });
    });

    it('redirects back to /createCaps if the user entry contains mistakes', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: 'Product',
                capNameInput0: 'hello',
                capPriceInput0: '',
                capDurationInput0: '2',
                capDurationUnitsInput0: 'fortnights',
                capNameInput1: 's',
                capPriceInput1: '2',
                capDurationInput1: '1',
                capDurationUnitsInput1: 'week',
                capNameInput2: 'wfewfwfewfwefxewxdx edxex   1e  qd  qwdqcwddafwfwrfwefwefwefew',
                capPriceInput2: '2',
                capDurationInput2: '3',
                capDurationUnitsInput2: 'month',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPS_ATTRIBUTE, {
            caps: [
                { durationAmount: '2', durationUnits: 'fortnights', name: 'hello', price: '' },
                { durationAmount: '1', durationUnits: 'week', name: 's', price: '2' },
                {
                    durationAmount: '3',
                    durationUnits: 'month',
                    name: 'wfewfwfewfwefxewxdx edxex 1e qd qwdqcwddafwfwrfwefwefwefew',
                    price: '2',
                },
            ],
            errors: [
                { errorMessage: 'Cap price cannot be empty', id: 'cap-price-0' },
                { errorMessage: 'Choose an option from the dropdown', id: 'cap-duration-unit-0' },
                { errorMessage: 'Cap name cannot have less than 2 characters', id: 'cap-name-1' },
                { errorMessage: 'Cap name cannot have more than 50 characters', id: 'cap-name-2' },
            ],
            productName: 'Product',
        });
    });

    it('redirects to /createCaps if two caps have the same name', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: 'Product',
                capNameInput0: 'hello',
                capPriceInput0: '22',
                capDurationInput0: '2',
                capDurationUnitsInput0: 'day',
                capNameInput1: 'hello',
                capPriceInput1: '2',
                capDurationInput1: '1',
                capDurationUnitsInput1: 'week',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPS_ATTRIBUTE, {
            caps: [
                { durationAmount: '2', durationUnits: 'day', name: 'hello', price: '22' },
                { durationAmount: '1', durationUnits: 'week', name: 'hello', price: '2' },
            ],
            errors: [
                { errorMessage: 'Cap names must be unique', id: 'cap-name-0' },
                { errorMessage: 'Cap names must be unique', id: 'cap-name-1' },
            ],
            productName: 'Product',
        });
    });

    it('redirects back to /createCaps if the user enters 0 as an input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: 'Product',
                capNameInput0: 'Name',
                capPriceInput0: '0',
                capDurationInput0: '2',
                capDurationUnitsInput0: 'week',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPS_ATTRIBUTE, {
            caps: [{ durationAmount: '2', durationUnits: 'week', name: 'Name', price: '0' }],
            errors: [{ errorMessage: 'Cap prices cannot be zero', id: 'cap-price-0' }],
            productName: 'Product',
        });
    });

    it('redirects back to /createCaps if the user enters 000 as an input', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                cappedProductName: 'Product',
                capNameInput0: 'Name',
                capPriceInput0: '000',
                capDurationInput0: '2',
                capDurationUnitsInput0: 'week',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPS_ATTRIBUTE, {
            caps: [{ durationAmount: '2', durationUnits: 'week', name: 'Name', price: '000' }],
            errors: [{ errorMessage: 'Cap prices cannot be zero', id: 'cap-price-0' }],
            productName: 'Product',
        });
    });

    it('redirects back to /createCaps if the user doesnt provide a product name', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                capNameInput0: 'Name',
                capPriceInput0: '2',
                capDurationInput0: '2',
                capDurationUnitsInput0: 'week',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        createCaps(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/createCaps',
        });

        expect(updateSessionAttributeSpy).toBeCalledWith(req, CAPS_ATTRIBUTE, {
            caps: [{ durationAmount: '2', durationUnits: 'week', name: 'Name', price: '2' }],
            errors: [{ errorMessage: 'Product name cannot have less than 2 characters', id: 'capped-product-name' }],
            productName: undefined,
        });
    });
});
