import { NextApiResponse } from 'next';
import * as yup from 'yup';
import moment from 'moment';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
} from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession, ProductDateInformation } from '../../interfaces';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { invalidCharactersArePresent } from '../../../src/utils/apiUtils/validator';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';

export const combinedDateSchema = yup.object({
    endDate: yup.date().min(yup.ref('startDate'), 'The end date must be after the start date'),
});

const isDatesFieldEmpty = (day: string, month: string, year: string): boolean =>
    day === '' && month === '' && year === '';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        let errors: ErrorInfo[] = [];

        const { startDateDay, startDateMonth, startDateYear, endDateDay, endDateMonth, endDateYear, productDates } =
            req.body;

        const dateInput: ProductDateInformation = {
            startDateDay,
            startDateMonth,
            startDateYear,
            endDateDay,
            endDateMonth,
            endDateYear,
        };

        if (!productDates) {
            errors.push({ errorMessage: 'Choose one of the options below', id: 'product-dates-required' });
            updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, { errors, dates: dateInput });
            redirectTo(res, '/productDateInformation');
            return;
        }

        let startDate;
        let endDate;

        if (productDates === 'Yes') {
            const isStartDateEmpty = isDatesFieldEmpty(startDateDay, startDateMonth, startDateYear);
            const isEndDateEmpty = isDatesFieldEmpty(endDateDay, endDateMonth, endDateYear);

            if (isStartDateEmpty && isEndDateEmpty) {
                errors.push({ errorMessage: 'Enter a start date and/or end date', id: 'product-dates-required' });
            }

            if (!isStartDateEmpty) {
                startDate = moment.utc([startDateYear, startDateMonth - 1, startDateDay]);

                const startDateDayHasInvalidCharacters = invalidCharactersArePresent(startDateDay);

                if (startDateDayHasInvalidCharacters) {
                    errors.push({
                        id: 'product-dates-required',
                        errorMessage: 'Start date day has an invalid character',
                    });
                }

                const startDateMonthHasInvalidCharacters = invalidCharactersArePresent(startDateMonth);

                if (startDateMonthHasInvalidCharacters) {
                    errors.push({
                        id: 'product-dates-required',
                        errorMessage: 'Start date month has an invalid character',
                    });
                }

                const startDateYearHasInvalidCharacters = invalidCharactersArePresent(startDateYear);

                if (startDateYearHasInvalidCharacters) {
                    errors.push({
                        id: 'product-dates-required',
                        errorMessage: 'Start date year has an invalid character',
                    });
                }
            }

            if (!isEndDateEmpty) {
                endDate = moment.utc([endDateYear, endDateMonth - 1, endDateDay, 23, 59, 59]);

                const endDateDayHasInvalidCharacters = invalidCharactersArePresent(endDateDay);

                if (endDateDayHasInvalidCharacters) {
                    errors.push({
                        id: 'product-dates-required',
                        errorMessage: 'End date day has an invalid character',
                    });
                }

                const endDateMonthHasInvalidCharacters = invalidCharactersArePresent(endDateMonth);

                if (endDateMonthHasInvalidCharacters) {
                    errors.push({
                        id: 'product-dates-required',
                        errorMessage: 'End date month has an invalid character',
                    });
                }

                const endDateYearHasInvalidCharacters = invalidCharactersArePresent(endDateYear);

                if (endDateYearHasInvalidCharacters) {
                    errors.push({
                        id: 'product-dates-required',
                        errorMessage: 'End date year has an invalid character',
                    });
                }
            }

            if (startDate && !startDate.isValid() && !isStartDateEmpty) {
                errors.push({ errorMessage: 'Start date must be a real date', id: 'start-date-day' });
            }

            if (endDate && !endDate.isValid() && !isEndDateEmpty) {
                errors.push({ errorMessage: 'End date must be a real date', id: 'end-date-day' });
            }

            if (errors.length > 0) {
                updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, { errors, dates: dateInput });
                redirectTo(res, '/productDateInformation');
                return;
            }

            if (!startDate && endDate) {
                try {
                    await combinedDateSchema.validate({ startDate: moment(), endDate }, { abortEarly: false });
                } catch (validationErrors) {
                    errors.push({
                        id: 'end-date-day',
                        errorMessage: 'End date cannot be before today',
                    });

                    updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, {
                        errors,
                        dates: dateInput,
                    });
                    redirectTo(res, '/productDateInformation');
                    return;
                }
            }

            if (startDate && endDate) {
                try {
                    await combinedDateSchema.validate({ startDate, endDate }, { abortEarly: false });
                } catch (validationErrors) {
                    const validityErrors: yup.ValidationError = validationErrors;
                    errors = validityErrors.inner.map((error) => ({
                        id: 'end-date-day',
                        errorMessage: error.message,
                    }));

                    updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, {
                        errors,
                        dates: dateInput,
                    });
                    redirectTo(res, '/productDateInformation');
                    return;
                }
            }
        }

        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);
        if (ticket && matchingJsonMetaData) {
            const updatedTicket = {
                ...ticket,
                ticketPeriod: {
                    startDate: startDate?.toISOString() ?? moment.utc().startOf('day').toISOString(),
                    endDate: endDate?.toISOString(),
                },
            };
            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
            redirectTo(
                res,
                `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                    matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                }`,
            );
            return;
        }

        updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, {
            startDate: startDate?.toISOString() ?? moment.utc().startOf('day').toISOString(),
            endDate: endDate?.toISOString(),
            dateInput,
        });

        redirectTo(res, '/salesConfirmation');
    } catch (error) {
        const message = 'There was a problem in the productDateInformation API.';
        redirectToError(res, message, 'api.productDateInformation', error);
    }
};
