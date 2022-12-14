import React, { ReactElement } from 'react';
import {
    TYPE_OF_CAP_ATTRIBUTE,
    CAPS_ATTRIBUTE,
    CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE,
    CAP_EXPIRY_ATTRIBUTE,
    CAP_START_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    MULTI_TAPS_PRICING_ATTRIBUTE,
} from '../constants/attributes';
import { NextPageContextWithSession, ConfirmationElement, Cap, MultiTapPricing } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isCapExpiry, isCapStartInfo, isWithErrors } from '../interfaces/typeGuards';
import { getCsrfToken, sentenceCaseString, getAndValidateNoc } from '../utils';
import { getProductGroupByNocAndId } from '../data/auroradb';
import { CapStartInfo } from 'src/interfaces/matchingJsonTypes';
import { isServiceListAttributeWithErrors } from './serviceList';

const title = 'Cap Confirmation - Create Fares Data Service';
const description = 'Cap Confirmation page of the Create Fares Data Service';

interface CapConfirmationProps {
    typeOfCap: string;
    productGroupName: string;
    caps: Cap[];
    capValidity: string;
    capStartInfo: CapStartInfo;
    services: string[];
    tapsPricing: MultiTapPricing | undefined;
    csrfToken: string;
}

export const buildCapConfirmationElements = (
    typeOfCap: string,
    productGroupName: string,
    caps: Cap[],
    capValidity: string,
    capStartInfo: CapStartInfo,
    services: string[],
    tapsPricing: MultiTapPricing | undefined,
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
        const durationText = cap.durationUnits
            ? `${cap.durationAmount} ${cap.durationUnits}${cap.durationAmount === '1' ? '' : 's'}`
            : `${cap.durationAmount}`;

        confirmationElements.push({
            name: cap.name,
            content: [`Price - £${cap.price}`, `Duration - ${durationText}`],
            href: '/createCaps',
        });
    });

    confirmationElements.push({
        name: 'Cap Expiry',
        content: sentenceCaseString(capValidity),
        href: '/selectCapValidity',
    });

    confirmationElements.push({
        name: 'Cap Starts',
        content:
            capStartInfo.type === 'fixedWeekdays' && capStartInfo.startDay
                ? `Fixed Days - ${sentenceCaseString(capStartInfo.startDay)}`
                : 'Rolling Days',
        href: '/defineCapStart',
    });

    if (services.length > 0) {
        confirmationElements.push({
            name: 'Services',
            content: services.join(', '),
            href: '/serviceList',
        });
    }

    if (tapsPricing) {
        const content: string[] = [];

        Object.entries(tapsPricing.tapDetails).forEach((tap) => {
            content.push(`Tap Number: ${Number(tap[0]) + 1}, Price: ${tap[1]}`);
        });

        confirmationElements.push({
            name: 'Prices by Taps',
            content: content,
            href: '/multiTapsPricing',
        });
    }

    return confirmationElements;
};

const CapConfirmation = ({
    typeOfCap,
    productGroupName,
    caps,
    capValidity,
    capStartInfo,
    services,
    tapsPricing,
    csrfToken,
}: CapConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/fareConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your fares information</h1>
                <ConfirmationTable
                    header="Fare Information"
                    confirmationElements={buildCapConfirmationElements(
                        typeOfCap,
                        productGroupName,
                        caps,
                        capValidity,
                        capStartInfo,
                        services,
                        tapsPricing,
                    )}
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
        capValidityAttribute && isCapExpiry(capValidityAttribute)
            ? `${capValidityAttribute.productValidity}${
                  capValidityAttribute.productEndTime ? ` - ${capValidityAttribute.productEndTime}` : ''
              }`
            : '';

    const capStartAttribute = getSessionAttribute(ctx.req, CAP_START_ATTRIBUTE);

    if (
        !typeOfCapAttribute ||
        !('typeOfCap' in typeOfCapAttribute) ||
        !capAttribute ||
        !capStartAttribute ||
        !isCapStartInfo(capStartAttribute)
    ) {
        throw new Error('Could not extract the correct attributes for the user journey.');
    }

    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);

    const multiTapsPricingAttribute = getSessionAttribute(ctx.req, MULTI_TAPS_PRICING_ATTRIBUTE);

    return {
        props: {
            typeOfCap: typeOfCapAttribute.typeOfCap,
            productGroupName: productGroupName || '',
            caps,
            capValidity,
            capStartInfo: capStartAttribute,
            services:
                serviceListAttribute && !isServiceListAttributeWithErrors(serviceListAttribute)
                    ? serviceListAttribute.selectedServices.map((service) => service.lineName)
                    : [],
            tapsPricing:
                multiTapsPricingAttribute && !isWithErrors(multiTapsPricingAttribute)
                    ? multiTapsPricingAttribute
                    : undefined,
            csrfToken,
        },
    };
};

export default CapConfirmation;
