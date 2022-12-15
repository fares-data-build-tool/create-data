import React, { ReactElement } from 'react';
import {
    TYPE_OF_CAP_ATTRIBUTE,
    CAPS_ATTRIBUTE,
    CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE,
    CAP_EXPIRY_ATTRIBUTE,
    CAP_START_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    MULTI_TAPS_PRICING_ATTRIBUTE,
    CAP_PRICING_PER_DISTANCE_ATTRIBUTE,
} from '../constants/attributes';
import { NextPageContextWithSession, ConfirmationElement, Cap } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import { isCapExpiry, isCapStartInfo, isWithErrors } from '../interfaces/typeGuards';
import { getCsrfToken, sentenceCaseString, getAndValidateNoc } from '../utils';
import { getProductGroupByNocAndId } from '../data/auroradb';
import { isServiceListAttributeWithErrors } from '../../src/pages/serviceList';

const title = 'Cap Confirmation - Create Fares Data Service';
const description = 'Cap Confirmation page of the Create Fares Data Service';

interface CapConfirmationProps {
    typeOfCap: string;
    productGroupName: string;
    caps: Cap[];
    capValidity: string;
    capStartInfoContent: string;
    services: string[];
    tapsPricingContents: string[];
    capDistancePricingContents: string[];
    distanceBands: string[];
    csrfToken: string;
}

export const buildCapConfirmationElements = (
    typeOfCap: string,
    productGroupName: string,
    caps: Cap[],
    capValidity: string,
    capStartInfoContent: string,
    services: string[],
    tapsPricingContents: string[],
    capDistancePricingContents: string[],
    distanceBands: string[],
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [
        {
            name: 'Cap type',
            content: `Pricing by ${typeOfCap.toLowerCase().substring(2)} `,
            href: 'typeOfCap',
        },
    ];

    if (productGroupName) {
        confirmationElements.push({
            name: 'Product group name',
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

    if (capValidity) {
        confirmationElements.push({
            name: 'Cap expiry',
            content: sentenceCaseString(capValidity),
            href: '/selectCapValidity',
        });
    }

    if (capStartInfoContent) {
        confirmationElements.push({
            name: 'Cap starts',
            content: capStartInfoContent,
            href: '/defineCapStart',
        });
    }

    if (services.length > 0) {
        confirmationElements.push({
            name: 'Services',
            content: services.join(', '),
            href: '/serviceList',
        });
    }

    if (tapsPricingContents.length > 0) {
        confirmationElements.push({
            name: 'Prices by taps',
            content: tapsPricingContents,
            href: '/multiTapsPricing',
        });
    }

    if (capDistancePricingContents.length > 0) {
        confirmationElements.push({
            name: 'Prices',
            content: capDistancePricingContents,
            href: '/defineCapPricingPerDistance',
        });
    }

    if (distanceBands.length > 0) {
        distanceBands.forEach((distanceBandContent, index) => {
            confirmationElements.push({
                name: `Distance band ${index + 1}`,
                content: distanceBandContent,
                href: '/defineCapPricingPerDistance',
            });
        });
    }

    return confirmationElements;
};

const CapConfirmation = ({
    typeOfCap,
    productGroupName,
    caps,
    capValidity,
    capStartInfoContent,
    services,
    tapsPricingContents,
    capDistancePricingContents,
    distanceBands,
    csrfToken,
}: CapConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/capConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before submitting your fares information</h1>
                <ConfirmationTable
                    header="Cap Information"
                    confirmationElements={buildCapConfirmationElements(
                        typeOfCap,
                        productGroupName,
                        caps,
                        capValidity,
                        capStartInfoContent,
                        services,
                        tapsPricingContents,
                        capDistancePricingContents,
                        distanceBands,
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

    if (!typeOfCapAttribute || !('typeOfCap' in typeOfCapAttribute)) {
        throw new Error('Could not extract the correct attributes for the user journey.');
    }

    const capAttribute = getSessionAttribute(ctx.req, CAPS_ATTRIBUTE);
    const capStartAttribute = getSessionAttribute(ctx.req, CAP_START_ATTRIBUTE);

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

    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);

    const multiTapsPricingAttribute = getSessionAttribute(ctx.req, MULTI_TAPS_PRICING_ATTRIBUTE);

    const capDistancePricingAttribute = getSessionAttribute(ctx.req, CAP_PRICING_PER_DISTANCE_ATTRIBUTE);

    const tapsPricingContents: string[] = [];
    if (multiTapsPricingAttribute && !isWithErrors(multiTapsPricingAttribute)) {
        Object.entries(multiTapsPricingAttribute.tapDetails).forEach((tap) => {
            tapsPricingContents.push(`Tap number - ${Number(tap[0]) + 1}, Price - £${tap[1]}`);
        });
    }

    let capDistancePricingContents: string[] = [];
    const distanceBands: string[] = [];

    if (capDistancePricingAttribute && !isWithErrors(capDistancePricingAttribute)) {
        capDistancePricingContents = [
            `Min price - £${capDistancePricingAttribute.minimumPrice}`,
            `Max price - £${capDistancePricingAttribute.maximumPrice}`,
        ];

        capDistancePricingAttribute.capPricing.forEach((capDistance, index) => {
            distanceBands.push(
                `${capDistance.distanceFrom} km  - ${
                    index === capDistancePricingAttribute.capPricing.length - 1
                        ? 'End of journey'
                        : `${capDistance.distanceTo} km`
                }, Price - £${capDistance.pricePerKm} per km`,
            );
        });
    }

    const capStartInfoContent =
        capStartAttribute && isCapStartInfo(capStartAttribute)
            ? capStartAttribute.type === 'fixedWeekdays' && capStartAttribute.startDay
                ? `Fixed days - ${sentenceCaseString(capStartAttribute.startDay)}`
                : 'Rolling days'
            : '';

    return {
        props: {
            typeOfCap: typeOfCapAttribute.typeOfCap,
            productGroupName: productGroupName || '',
            caps,
            capValidity,
            capStartInfoContent,
            services:
                serviceListAttribute && !isServiceListAttributeWithErrors(serviceListAttribute)
                    ? serviceListAttribute.selectedServices.map((service) => service.lineName)
                    : [],
            tapsPricingContents,
            capDistancePricingContents,
            distanceBands,
            csrfToken,
        },
    };
};

export default CapConfirmation;
