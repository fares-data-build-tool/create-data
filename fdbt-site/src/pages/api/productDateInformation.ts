import { NextApiResponse } from 'next';
import * as yup from 'yup';
import moment from 'moment';
import { updateSessionAttribute } from '../../utils/sessions';
import { PRODUCT_DATE_ATTRIBUTE } from '../../constants';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from './apiUtils';

export interface ProductDatesWithErrors {
    errors: ErrorInfo[];
    dates: ProductDateInformation;
}

export interface ProductDateInformation {
    startDateDay: string;
    startDateMonth: string;
    startDateYear: string;
    endDateDay: string;
    endDateMonth: string;
    endDateYear: string;
}

export const combinedDateSchema = yup.object({
    endDate: yup.date().min(yup.ref('startDate'), 'The end date must be after the start date'),
});

const isDatesFieldEmpty = (day: string, month: string, year: string): boolean =>
    day === '' && month === '' && year === '';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        let errors: ErrorInfo[] = [];

        const {
            startDateDay,
            startDateMonth,
            startDateYear,
            endDateDay,
            endDateMonth,
            endDateYear,
            productDates,
        } = req.body;

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
                errors.push(
                    { errorMessage: 'Enter a start date', id: 'start-date-day' },
                    { errorMessage: 'Enter an end date', id: 'end-date-day' },
                );
            }

            if (!isStartDateEmpty) {
                startDate = moment([startDateYear, startDateMonth - 1, startDateDay, '00', '01']);
            }

            if (!isEndDateEmpty) {
                endDate = moment([endDateYear, endDateMonth - 1, endDateDay, '23', '59']);
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

            try {
                await combinedDateSchema.validate({ startDate, endDate }, { abortEarly: false });
            } catch (validationErrors) {
                const validityErrors: yup.ValidationError = validationErrors;
                errors = validityErrors.inner.map(error => ({
                    id: 'end-date-day',
                    errorMessage: error.message,
                }));

                if (errors.length > 0) {
                    updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, {
                        errors,
                        dates: dateInput,
                    });
                    redirectTo(res, '/productDateInformation');
                    return;
                }
            }

            let dateInfo;

            if (startDate && endDate) {
                dateInfo = {
                    startDate: startDate.add(1, 'hours').toISOString(),
                    endDate: endDate.toISOString(),
                };
            } else if (!startDate && endDate) {
                dateInfo = {
                    endDate: endDate.toISOString(),
                };
            } else if (startDate && !endDate) {
                dateInfo = {
                    startDate: startDate.add(1, 'hours').toISOString(),
                };
            }

            updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, dateInfo);

            redirectTo(res, '/salesConfirmation');
            return;
        }
        updateSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE, undefined);
        redirectTo(res, '/salesConfirmation');
    } catch (error) {
        const message = 'There was a problem in the productDateInformation API.';
        redirectToError(res, message, 'api.productDateInformation', error);
    }
};
