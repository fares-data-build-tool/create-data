import productDateInformation from '../../../src/pages/api/productDateInformation';
import * as sessions from '../../../src/utils/sessions';
import { PRODUCT_DATE_ATTRIBUTE } from '../../../src/constants';
import { getMockRequestAndResponse } from '../../testData/mockData';

describe('productDataInformation', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('it should add error to session if there is no productDates option passed in', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {},
        });

        await productDateInformation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            errors: [{ errorMessage: 'Choose one of the options below', id: 'product-dates-required' }],
            dates: {},
        });
    });

    it('it should throw an error and update the PRODUCT_DATE_ATTRIBUTE if the start and end date are not filled in', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                startDateDay: '',
                startDateMonth: '',
                startDateYear: '',
                endDateDay: '',
                endDateMonth: '',
                endDateYear: '',
                productDates: 'Yes',
            },
        });

        await productDateInformation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            errors: [
                { errorMessage: 'Enter a start date', id: 'start-date-day' },
                { errorMessage: 'Enter an end date', id: 'end-date-day' },
            ],
            dates: {
                startDateDay: '',
                startDateMonth: '',
                startDateYear: '',
                endDateDay: '',
                endDateMonth: '',
                endDateYear: '',
            },
        });
    });

    it('it should throw an error and update the PRODUCT_DATE_ATTRIBUTE if the start or end date are not filled in correctly', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                startDateDay: '12',
                startDateMonth: '12',
                startDateYear: '',
                endDateDay: '12',
                endDateMonth: '',
                endDateYear: '2020',
                productDates: 'Yes',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await productDateInformation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            errors: [
                { errorMessage: 'Start date must be a real date', id: 'start-date-day' },
                { errorMessage: 'End date must be a real date', id: 'end-date-day' },
            ],
            dates: {
                startDateDay: '12',
                startDateMonth: '12',
                startDateYear: '',
                endDateDay: '12',
                endDateMonth: '',
                endDateYear: '2020',
            },
        });

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDateInformation',
        });
    });

    it('it should validate the start and end date and error if the end date is less than the start date', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                startDateDay: '12',
                startDateMonth: '12',
                startDateYear: '2020',
                endDateDay: '12',
                endDateMonth: '12',
                endDateYear: '2019',
                productDates: 'Yes',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await productDateInformation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            errors: [
                {
                    errorMessage: 'The end date must be after the start date',
                    id: 'end-date-day',
                },
            ],
            dates: {
                startDateDay: '12',
                startDateMonth: '12',
                startDateYear: '2020',
                endDateDay: '12',
                endDateMonth: '12',
                endDateYear: '2019',
            },
        });

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/productDateInformation',
        });
    });

    it('it should set the start and end date when entered correctly and redirect to confirmation page', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                startDateDay: '12',
                startDateMonth: '12',
                startDateYear: '2020',
                endDateDay: '15',
                endDateMonth: '12',
                endDateYear: '2020',
                productDates: 'Yes',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await productDateInformation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: '2020-12-12T01:01:00.000Z',
            endDate: '2020-12-15T23:59:00.000Z',
        });

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/salesConfirmation',
        });
    });

    it('it should set the start and end date when entered correctly and redirect to confirmation page', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                startDateDay: '',
                startDateMonth: '',
                startDateYear: '',
                endDateDay: '',
                endDateMonth: '',
                endDateYear: '',
                productDates: 'No',
            },
            mockWriteHeadFn: writeHeadMock,
        });

        await productDateInformation(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, PRODUCT_DATE_ATTRIBUTE, undefined);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/salesConfirmation',
        });
    });
});
