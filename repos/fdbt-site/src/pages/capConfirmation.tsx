import React, { ReactElement } from 'react';
import {
    TYPE_OF_CAP_ATTRIBUTE,
    CAPS_ATTRIBUTE,
    CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE,
    CAP_EXPIRY_ATTRIBUTE,
} from '../constants/attributes';
import { NextPageContextWithSession, ConfirmationElement, Cap } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isCapExpiry } from '../interfaces/typeGuards';
import { getCsrfToken, sentenceCaseString, getAndValidateNoc } from '../utils';
import { getProductGroupByNocAndId } from '../data/auroradb';

const title = 'Cap Confirmation - Create Fares Data Service';
const description = 'Cap Confirmation page of the Create Fares Data Service';

interface CapConfirmationProps {
    typeOfCap: string;
    productGroupName: string;
    caps: Cap[];
    capValidity: string;
    csrfToken: string;
}

export const buildCapConfirmationElements = (
    typeOfCap: string,
    productGroupName: string,
    caps: Cap[],
    capValidity: string,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [
        {
            name: 'Cap type',
            content: `Pricing by ${typeOfCap.substring(2)} `,
            href: 'typeOfCap',
        },
    ];

    if (productGroupName) {
        confirmationElements.push({
            name: 'Product Group Name',
            content: productGroupName,
            href: '/selectCappedProductGroup',
        });
    }

    caps.forEach((cap) => {
        confirmationElements.push({
            name: 'Cap Details',
            content: cap.name + ' || ' + cap.price + ' || ' + cap.durationAmount + ' ' + cap.durationUnits,
            href: '/createCaps',
        });
    });

    confirmationElements.push({
        name: 'Cap Expiry',
        content: sentenceCaseString(capValidity),
        href: '/selectCapValidity',
    });
    return confirmationElements;
};

const CapConfirmation = ({
    typeOfCap,
    productGroupName,
    caps,
    capValidity,
    csrfToken,
}: CapConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/fareConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your fares information</h1>
                <ConfirmationTable
                    header="Fare Information"
                    confirmationElements={buildCapConfirmationElements(typeOfCap, productGroupName, caps, capValidity)}
                />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CapConfirmationProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const noc = getAndValidateNoc(ctx);

    const typeOfCapAttribute = getSessionAttribute(ctx.req, TYPE_OF_CAP_ATTRIBUTE);
    const capAttribute = getSessionAttribute(ctx.req, CAPS_ATTRIBUTE);
    const productGroupIdAttribute = getSessionAttribute(ctx.req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE);

    const productGroupName =
        productGroupIdAttribute && typeof productGroupIdAttribute === 'string'
            ? (await getProductGroupByNocAndId(noc, Number.parseInt(productGroupIdAttribute)))?.name
            : '';
    const caps = capAttribute ? capAttribute.caps : [];

    const capValidityAttribute = getSessionAttribute(ctx.req, CAP_EXPIRY_ATTRIBUTE);
    const capValidity =
        capValidityAttribute && isCapExpiry(capValidityAttribute) ? capValidityAttribute.productValidity : '';

    if (!typeOfCapAttribute || !('typeOfCap' in typeOfCapAttribute) || !capAttribute) {
        throw new Error('Could not extract the correct attributes for the user journey.');
    }

    return {
        props: {
            typeOfCap: typeOfCapAttribute.typeOfCap,
            productGroupName: productGroupName || '',
            caps,
            capValidity,
            csrfToken,
        },
    };
};

export default CapConfirmation;
