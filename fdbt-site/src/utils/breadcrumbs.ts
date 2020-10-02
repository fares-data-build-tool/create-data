import {
    INPUT_METHOD_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    TIME_RESTRICTIONS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    JOURNEY_ATTRIBUTE,
} from '../constants/index';
import { Breadcrumb, NextPageContextWithSession } from '../interfaces';
import { getSessionAttribute } from './sessions';
import {
    isFareType,
    isPassengerType,
    inputMethodErrorsExist,
    isJourney,
    isTicketRepresentation,
} from '../interfaces/typeGuards';
import { isNumberOfProductsAttribute } from '../pages/howManyProducts';

export default (ctx: NextPageContextWithSession): { generate: () => Breadcrumb[] } => {
    const url = ctx.req?.url;

    if (!url || url === '/' || url === '/home') {
        return {
            generate: (): Breadcrumb[] => [],
        };
    }

    const inputMethod = getSessionAttribute(ctx.req, INPUT_METHOD_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);

    const numberOfProductsAttribute = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
    const timeRestrictionsAttribute = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(ctx.req, PASSENGER_TYPE_ATTRIBUTE);
    const journeyAttribute = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE);
    const ticketRepresentation = getSessionAttribute(ctx.req, TICKET_REPRESENTATION_ATTRIBUTE);

    const csvUploadUrls = ['/csvUpload'];
    const manualUploadUrls = ['/howManyStages', '/chooseStages', '/stageNames', '/priceEntry'];
    const singleProductUrls = ['/productDetails', '/chooseValidity', '/periodValidity'];
    const multiProductUrls = ['/multipleProducts', '/multipleProductValidity'];
    const salesOfferPackagesUrls = ['/selectSalesOfferPackage', '/salesOfferPackages', '/describeSalesOfferPackage'];

    const isSingle = isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'single';
    const isReturn = isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'return';
    const isPeriod = isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'period';
    const isFlatFare = isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'flatFare';
    const isMultiService =
        isTicketRepresentation(ticketRepresentation) && ticketRepresentation.name === 'multipleServices';
    const isGeoZone = isTicketRepresentation(ticketRepresentation) && ticketRepresentation.name === 'geoZone';
    const isCircular = isReturn && isJourney(journeyAttribute) && !journeyAttribute.outboundJourney;

    const isSingleProduct =
        singleProductUrls.includes(url) ||
        (isNumberOfProductsAttribute(numberOfProductsAttribute) &&
            numberOfProductsAttribute.numberOfProductsInput === '1');
    const isMultiProduct =
        multiProductUrls.includes(url) ||
        (isNumberOfProductsAttribute(numberOfProductsAttribute) &&
            Number(numberOfProductsAttribute.numberOfProductsInput) > 1);

    const isCsvUploadUrl = csvUploadUrls.includes(url);
    const isManualUploadUrl = manualUploadUrls.includes(url);
    const isSalesOfferPackageUrl = salesOfferPackagesUrls.includes(url);
    const isCsvUploadCookie =
        (!isCsvUploadUrl &&
            !isManualUploadUrl &&
            !inputMethodErrorsExist(inputMethod) &&
            inputMethod?.inputMethod === 'csv') ||
        false;
    const isManualUploadCookie =
        (!isCsvUploadUrl &&
            !isManualUploadUrl &&
            !inputMethodErrorsExist(inputMethod) &&
            inputMethod?.inputMethod === 'manual') ||
        false;
    const isCsvUploadJourney = isCsvUploadUrl || isCsvUploadCookie;
    const isManualUploadJourney = isManualUploadUrl || isManualUploadCookie;

    const getSingleAndReturnBreadcrumbs = (): Breadcrumb[] => [
        {
            name: 'Service',
            link: '/service',
            show: isSingle || isReturn,
        },
        {
            name: 'Direction',
            link: '/singleDirection',
            show: isSingle,
        },
        {
            name: 'Direction',
            link: '/returnDirection',
            show: isReturn,
        },
        {
            name: 'Input method',
            link: '/inputMethod',
            show: isSingle || isReturn,
        },
        {
            name: 'Upload CSV',
            link: '/csvUpload',
            show: isCsvUploadJourney,
        },
        {
            name: 'Stage count check',
            link: '/howManyStages',
            show: isManualUploadJourney,
        },
        {
            name: 'Number of stages',
            link: '/chooseStages',
            show: isManualUploadJourney,
        },
        {
            name: 'Stage names',
            link: '/stageNames',
            show: isManualUploadJourney,
        },
        {
            name: 'Stage prices',
            link: '/priceEntry',
            show: isManualUploadJourney,
        },
        {
            name: 'Match stops',
            link: '/matching',
            show: isSingle || isCircular,
        },
        {
            name: 'Outbound stops',
            link: '/outboundMatching',
            show: isReturn && !isCircular,
        },
        {
            name: 'Inbound stops',
            link: '/inboundMatching',
            show: isReturn && !isCircular,
        },
        {
            name: 'Ticket validity',
            link: '/returnValidity',
            show: isReturn,
        },
    ];

    const getPeriodAndFlatFareBreadcrumbs = (): Breadcrumb[] => [
        {
            name: 'Period type',
            link: '/periodType',
            show: isPeriod,
        },
        {
            name: 'Services',
            link: '/serviceList',
            show: isMultiService || isFlatFare,
        },
        {
            name: 'Upload CSV',
            link: '/csvZoneUpload',
            show: isGeoZone,
        },
        {
            name: 'Number of products',
            link: '/howManyProducts',
            show: isMultiService || isGeoZone,
        },
        {
            name: 'Product details',
            link: '/productDetails',
            show: isFlatFare || isSingleProduct,
        },
        {
            name: 'Days valid',
            link: '/chooseValidity',
            show: isSingleProduct,
        },
        {
            name: 'Product period validity',
            link: '/periodValidity',
            show: isSingleProduct,
        },
        {
            name: 'Product details',
            link: '/multipleProducts',
            show: isMultiProduct,
        },
        {
            name: 'Product period validity',
            link: '/multipleProductValidity',
            show: isMultiProduct,
        },
    ];

    const getSalesOfferPackageBreadcrumbs = (): Breadcrumb[] => [
        {
            name: 'Select sales offer packages',
            link: '/selectSalesOfferPackage',
            show: isSalesOfferPackageUrl,
        },
        {
            name: 'Define sales offer package',
            link: '/salesOfferPackages',
            show: isSalesOfferPackageUrl,
        },
        {
            name: 'Describe sales offer package',
            link: '/describeSalesOfferPackage',
            show: isSalesOfferPackageUrl,
        },
    ];

    const getFullBreadcrumbList = (): Breadcrumb[] => {
        const isNotAnyonePassengerType =
            isPassengerType(passengerTypeAttribute) && passengerTypeAttribute.passengerType !== 'anyone';
        const isTimeRestrictionDefined = timeRestrictionsAttribute?.timeRestrictions || false;

        const breadcrumbList: Breadcrumb[] = [
            {
                name: 'Home',
                link: '/home',
                show: true,
            },
            {
                name: 'Fare type',
                link: '/fareType',
                show: true,
            },
            {
                name: 'Passenger type',
                link: '/passengerType',
                show: true,
            },
            {
                name: 'Passenger type details',
                link: '/definePassengerType',
                show: isNotAnyonePassengerType,
            },
            {
                name: 'Time restrictions',
                link: '/timeRestrictions',
                show: true,
            },
            {
                name: 'Time restrictions details',
                link: '/defineTimeRestrictions',
                show: isTimeRestrictionDefined,
            },
            {
                name: 'Product Date Information',
                link: '/productDateInformation',
                show: true,
            },
        ];

        if (isSingle || isReturn) {
            breadcrumbList.push(...getSingleAndReturnBreadcrumbs());
        }

        if (isPeriod || isFlatFare) {
            breadcrumbList.push(...getPeriodAndFlatFareBreadcrumbs());
        }

        breadcrumbList.push(...getSalesOfferPackageBreadcrumbs());

        return breadcrumbList;
    };

    const generate = (): Breadcrumb[] => {
        const fullBreadcrumbList = getFullBreadcrumbList();
        const index = fullBreadcrumbList.findIndex(item => item.link === url.split('?')[0] && item.show);
        const breadcrumbsToShow = fullBreadcrumbList.slice(0, index + 1).filter(item => item.show);

        return breadcrumbsToShow;
    };

    return {
        generate,
    };
};
