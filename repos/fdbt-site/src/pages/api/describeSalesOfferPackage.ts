import { NextApiResponse } from 'next';
import * as yup from 'yup';
import {
    defaultSalesOfferPackageOne,
    defaultSalesOfferPackageTwo,
    defaultSalesOfferPackageThree,
    defaultSalesOfferPackageFour,
} from '../selectSalesOfferPackage';
import { SOP_ATTRIBUTE, SOP_INFO_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils';
import { NextApiRequestWithSession, ErrorInfo, SalesOfferPackage, SalesOfferPackageWithErrors } from '../../interfaces';
import { isSalesOfferPackageWithErrors } from '../describeSalesOfferPackage';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { isSalesOfferPackageInfoWithErrors } from '../salesOfferPackages';
import { insertSalesOfferPackage, getSalesOfferPackagesByNocCode } from '../../data/auroradb';

const noInputError = (input: string): string => `Enter a ${input} for your sales offer package`;
const inputTooLongError = (input: string, max: number): string => `Enter a ${input} that is ${max} characters or fewer`;

export const sopInfoSchema = yup.object({
    name: yup
        .string()
        .min(0, noInputError('name'))
        .max(20, inputTooLongError('name', 20))
        .required(noInputError('name')),
    description: yup
        .string()
        .min(0, noInputError('description'))
        .max(150, inputTooLongError('description', 150))
        .required(noInputError('description')),
});

export const checkAgainstDefaultNames = (sopName: string, errors: ErrorInfo[]): ErrorInfo[] => {
    if (
        sopName === defaultSalesOfferPackageOne.name ||
        sopName === defaultSalesOfferPackageTwo.name ||
        sopName === defaultSalesOfferPackageThree.name ||
        sopName === defaultSalesOfferPackageFour.name
    ) {
        errors.push({
            errorMessage: 'Sales offer package name cannot be the same as a default SOP name',
            id: 'sop-name',
            userInput: sopName,
        });
    }
    return errors;
};

export const checkUserInput = async (
    sopInfo: SalesOfferPackage,
): Promise<SalesOfferPackage | SalesOfferPackageWithErrors> => {
    let errors: ErrorInfo[] = [];
    try {
        await sopInfoSchema.validate(sopInfo, { abortEarly: false });
    } catch (validationErrors) {
        const validityErrors: yup.ValidationError = validationErrors;
        errors = validityErrors.inner.map(error => {
            return { errorMessage: error.message, id: `sop-${error.path}`, userInput: error.value };
        });
    }
    const updatedErrors = checkAgainstDefaultNames(sopInfo.name, errors);
    if (updatedErrors.length > 0) {
        return {
            ...sopInfo,
            errors: updatedErrors,
        };
    }
    return sopInfo;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const salesOfferPackageParams = getSessionAttribute(req, SOP_INFO_ATTRIBUTE);
        if (!salesOfferPackageParams || isSalesOfferPackageInfoWithErrors(salesOfferPackageParams)) {
            throw new Error('SOP_INFO_ATTRIBUTE is missing or in the wrong format');
        }

        const nocCode = getAndValidateNoc(req, res);
        if (!nocCode) {
            throw new Error('Could not retrieve nocCode from ID_TOKEN_COOKIE');
        }

        const { salesOfferPackageName, salesOfferPackageDescription } = req.body;
        let salesOfferPackageInfo: SalesOfferPackage = {
            name: salesOfferPackageName || '',
            description: salesOfferPackageDescription || '',
            purchaseLocations: salesOfferPackageParams.purchaseLocations,
            paymentMethods: salesOfferPackageParams.paymentMethods,
            ticketFormats: salesOfferPackageParams.ticketFormats,
        };

        salesOfferPackageInfo = await checkUserInput(salesOfferPackageInfo);

        if (isSalesOfferPackageWithErrors(salesOfferPackageInfo)) {
            updateSessionAttribute(req, SOP_ATTRIBUTE, salesOfferPackageInfo);
            redirectTo(res, '/describeSalesOfferPackage');
            return;
        }

        const savedSops = await getSalesOfferPackagesByNocCode(nocCode);
        const nameCheck = savedSops.find(sop => sop.name === salesOfferPackageInfo.name);

        if (nameCheck) {
            const sopWithError: SalesOfferPackageWithErrors = {
                ...salesOfferPackageInfo,
                errors: [
                    {
                        errorMessage: 'There is already a saved sales offer package with this name',
                        id: 'sop-name',
                        userInput: salesOfferPackageInfo.name,
                    },
                ],
            };
            updateSessionAttribute(req, SOP_ATTRIBUTE, sopWithError);
            redirectTo(res, '/describeSalesOfferPackage');
            return;
        }

        await insertSalesOfferPackage(nocCode, salesOfferPackageInfo);

        updateSessionAttribute(req, SOP_INFO_ATTRIBUTE, undefined);
        updateSessionAttribute(req, SOP_ATTRIBUTE, undefined);
        redirectTo(res, '/selectSalesOfferPackage');
    } catch (error) {
        const message = 'There was a problem on the describe sales offer package API.';
        redirectToError(res, message, 'api.describeSalesOfferPackage', error);
    }
};
