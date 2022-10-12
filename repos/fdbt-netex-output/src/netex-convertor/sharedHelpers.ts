import snakeCase from 'lodash/snakeCase';
import capitalize from 'lodash/capitalize';
import parser from 'xml2json';
import fs from 'fs';
import moment from 'moment';
import {
    CoreData,
    isSchemeOperatorTicket,
    PeriodTicket,
    PointToPointTicket,
    User,
    GroupCompanion,
    FullTimeRestriction,
    Operator,
    isPointToPointTicket,
    BaseSchemeOperatorTicket,
    Ticket,
    ProductDetails,
    FlatFareProductDetails,
    isGeoZoneTicket,
    isMultiServiceTicket,
    isSchemeOperatorFlatFareTicket,
    isProductDetails,
    BaseProduct,
    PointToPointCarnetProductDetails,
    isHybridTicket,
    isReturnTicket,
    isSingleTicket,
    isPassengerType,
} from '../types';

import {
    getBaseSchemeOperatorInfo,
    getDurationElement,
    getLineRefList,
    getPeriodAvailabilityElement,
    getPeriodConditionsElement,
    getPeriodEligibilityElement,
} from './period-tickets/periodTicketNetexHelpers';
import {
    getPointToPointConditionsElement,
    getEligibilityElement,
    getLinesElement,
    getPointToPointAvailabilityElement,
} from './point-to-point-tickets/pointToPointTicketNetexHelpers';
import { FlatFareTicket, GroupDefinition } from 'fdbt-types/matchingJsonTypes';

export interface NetexObject {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const getCleanWebsite = (nocWebsite: string): string => {
    if (nocWebsite !== null) {
        const splitWebsite = nocWebsite.split('#');

        return splitWebsite.length > 1 && splitWebsite[1] ? splitWebsite[1] : splitWebsite[0];
    }
    return '';
};

export const getNetexTemplateAsJson = async (filepath: string): Promise<NetexObject> => {
    try {
        const fileData = await fs.promises.readFile(`${__dirname}/${filepath}`, { encoding: 'utf8' });
        const json = JSON.parse(parser.toJson(fileData, { reversible: true, trim: true }));

        return json;
    } catch (error) {
        throw new Error(`Error converting NeTEx template to JSON: ${error.stack}`);
    }
};

export const convertJsonToXml = (netexFileAsJsonObject: NetexObject): string => {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsonObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString, { sanitize: true, ignoreNull: true });

    return netexFileAsXmlString;
};

export const getProfileRef = (
    ticket: PeriodTicket | PointToPointTicket | FlatFareTicket | BaseSchemeOperatorTicket,
): NetexObject => {
    if (ticket.groupDefinition) {
        return {
            GroupTicketRef: {
                version: '1.0',
                ref: `op:${ticket.passengerType}`,
            },
        };
    }

    return {
        UserProfileRef: {
            version: '1.0',
            ref: `op:${ticket.passengerType}-0`,
        },
    };
};

export const getUserProfile = (user: User | GroupCompanion, index: number): NetexObject => {
    const passengerType = isPassengerType(user.passengerType) ? user.passengerType : '';
    return {
        version: '1.0',
        id: `op:${passengerType}-${index}`,
        Name: { $t: passengerType },
        TypeOfConcessionRef: {
            version: 'fxc:v1.0',
            ref: `fxc:${passengerType === 'anyone' || passengerType === 'adult' ? 'none' : snakeCase(passengerType)}`,
        },
        UserType: { $t: passengerType },
        MinimumAge: { $t: user.ageRangeMin || null },
        MaximumAge: { $t: user.ageRangeMax || null },
        ProofRequired: { $t: user.proofDocuments?.join(' ') || null },
    };
};

export const getGroupElement = (groupDefinition: GroupDefinition): NetexObject => {
    return {
        version: '1.0',
        id: `op:Tariff@group`,
        Name: { $t: 'Eligible groups' },
        TypeOfFareStructureElementRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:groups',
        },
        GenericParameterAssignment: {
            id: `op:Tariff@group`,
            version: '1.0',
            order: '0',
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:eligible',
            },
            LimitationGroupingType: { $t: 'OR' },
            limitations: {
                GroupTicket: {
                    id: 'op:group',
                    version: '1.0',
                    MaximumNumberOfPersons: {
                        $t: groupDefinition.maxPeople,
                    },
                    companionProfiles: {
                        CompanionProfile: groupDefinition.companions.map((companion, index) => ({
                            version: '1.0',
                            id: `op:companion@${companion.passengerType}-${index}`,
                            UserProfileRef: {
                                version: '1.0',
                                ref: `op:${companion.passengerType}-${index}`,
                            },
                            MinimumNumberOfPersons: {
                                $t: companion.minNumber || null,
                            },
                            MaximumNumberOfPersons: {
                                $t: companion.maxNumber || null,
                            },
                        })),
                    },
                },
            },
        },
    };
};

const getTime = (time: string): string => moment(time, 'HHmm').format('HH:mm:ss');

export const getEarliestTime = (timeRestriction: FullTimeRestriction): string => {
    const startTimes: string[] = timeRestriction.timeBands
        .map(timeband => timeband.startTime || '')
        .filter(startTime => startTime !== '');
    return startTimes.sort()[0];
};

export const getAllTimeBands = (timeRestriction: FullTimeRestriction): NetexObject =>
    timeRestriction.timeBands
        .filter(timeBand => timeBand.startTime)
        .map((timeband, index) => {
            return {
                version: '1.0',
                id: `op:timeband_for_${timeRestriction.day}@timeband_${(index + 1).toString()}`,
                StartTime: {
                    $t: timeband.startTime ? getTime(timeband.startTime) : null,
                },
                EndTime: {
                    $t: timeband.endTime ? getTime(timeband.endTime) : null,
                },
            };
        });

export const getFareDayTypeElements = (timeRestriction: FullTimeRestriction): NetexObject => ({
    id: `op@Tariff@DayType@${timeRestriction.day}`,
    version: '1.0',
    EarliestTime: {
        $t: getEarliestTime(timeRestriction) ? getTime(getEarliestTime(timeRestriction)) : null,
    },
    properties: {
        PropertyOfDay: {
            DaysOfWeek: {
                $t: timeRestriction.day === 'bankHoliday' ? 'Everyday' : capitalize(timeRestriction.day),
            },
            HolidayTypes: {
                $t: timeRestriction.day === 'bankHoliday' ? 'NationalHoliday' : null,
            },
        },
    },
    timebands: { Timeband: getAllTimeBands(timeRestriction) },
});

export const getTimeRestrictions = (timeRestrictionData: FullTimeRestriction[]): NetexObject => {
    return {
        FareDemandFactor: {
            id: 'op@Tariff@Demand',
            version: '1.0',
            validityConditions: {
                AvailabilityCondition: {
                    id: 'op@Tariff@Condition',
                    version: '1.0',
                    IsAvailable: {
                        $t: true,
                    },
                    dayTypes: {
                        FareDayType: timeRestrictionData.map(timeRestriction =>
                            getFareDayTypeElements(timeRestriction),
                        ),
                    },
                },
            },
        },
    };
};

export const getNetexMode = (mode: string): string => {
    const modeMap: { [key: string]: string } = {
        Bus: 'bus',
        Coach: 'coach',
        Tram: 'tram',
        Ferry: 'ferry',
    };

    return modeMap[mode] ?? 'bus';
};

export const replaceIWBusCoNocCode = (nocCode: string): string => {
    if (nocCode === 'IWBusCo') {
        return 'BLAC';
    }

    return nocCode;
};

export const getCoreData = async (operators: Operator[], ticket: Ticket): Promise<CoreData> => {
    const baseOperatorInfo = isSchemeOperatorTicket(ticket)
        ? await getBaseSchemeOperatorInfo(ticket)
        : operators.find(operator => operator.nocCode === replaceIWBusCoNocCode(ticket.nocCode));

    const operatorIdentifier = isSchemeOperatorTicket(ticket)
        ? `${ticket.schemeOperatorName}-${ticket.schemeOperatorRegionCode}`
        : ticket.nocCode;

    if (!baseOperatorInfo) {
        throw new Error('Could not find base operator');
    }

    const nocCodeFormat = `noc:${
        isSchemeOperatorTicket(ticket) ? operatorIdentifier : replaceIWBusCoNocCode(ticket.nocCode)
    }`;

    const productNameForXml = ticket.products[0].productName.replace(' ', '_');

    return {
        opIdNocFormat: `noc:${baseOperatorInfo.opId}`,
        nocCodeFormat,
        currentDate: new Date(Date.now()),
        url: getCleanWebsite(baseOperatorInfo.url),
        brandingId: `op:${operatorIdentifier}@brand`,
        operatorIdentifier,
        baseOperatorInfo: [baseOperatorInfo],
        placeholderGroupOfProductsName: isPointToPointTicket(ticket) ? '' : `${operatorIdentifier}_products`,
        ticketUserConcat: productNameForXml,
        productNameForPlainText: ticket.products[0].productName,
        operatorPublicNameLineNameFormat:
            'lineName' in ticket && 'operatorName' in baseOperatorInfo
                ? `${baseOperatorInfo.operatorName} ${ticket.lineName}`
                : '',
        nocCodeLineNameFormat: 'lineName' in ticket ? `${operatorIdentifier}_${ticket.lineName}` : '',
        lineIdName:
            'lineId' in ticket && ticket.lineId ? ticket.lineId : 'lineName' in ticket ? `Line_${ticket.lineName}` : '',
        lineName: 'lineName' in ticket ? ticket.lineName : '',
        operatorName: isSchemeOperatorTicket(ticket) ? ticket.schemeOperatorName : ticket.operatorName,
        ticketType: ticket.type,
        isCarnet: 'carnetDetails' in ticket.products[0],
    };
};

export const getDistributionChannel = (purchaseLocation: string): string => {
    switch (purchaseLocation) {
        case 'onBoard':
            return 'on_board';
        case 'atStop':
            return 'at_stop';
        case 'mobileDevice':
            return 'mobile_device';
        default:
            return purchaseLocation;
    }
};

export const isFlatFareType = (ticket: Ticket): boolean => ticket.type === 'flatFare';

export const isPeriodType = (ticket: Ticket): boolean => ticket.type === 'period';

export const getProductType = (ticket: Ticket): string => {
    if (isFlatFareType(ticket) || isSingleTicket(ticket)) {
        return 'singleTrip';
    } else if (isPeriodType(ticket)) {
        if (
            ticket.products &&
            ticket.products.length == 1 &&
            isProductDetails(ticket.products[0]) &&
            ticket.products[0].productDuration == '1 day'
        ) {
            return 'dayPass';
        }
        return 'periodPass';
    } else if (isReturnTicket(ticket)) {
        // Return period validity
        if (
            'returnPeriodValidity' in ticket &&
            ticket.returnPeriodValidity &&
            ticket.returnPeriodValidity.typeOfDuration === 'day'
        ) {
            return 'dayReturnTrip';
        }

        return 'periodReturnTrip';
    }

    return 'periodPass';
};

export const getCarnetElement = (ticket: Ticket): NetexObject => {
    const uniqueCarnetDenominations = new Set();
    ticket.products.forEach(product => {
        if ('carnetDetails' in product) {
            uniqueCarnetDenominations.add(product.carnetDetails.quantity);
        }
    });

    const qualityStructureFactors = [...uniqueCarnetDenominations].map(uniqueCarnetDenomination => ({
        version: '1.0',
        id: `mb:Tariff@multitrip@${uniqueCarnetDenomination}`,
        Value: { $t: uniqueCarnetDenomination },
    }));

    return {
        version: '1.0',
        id: 'mb:Tariff@multitrip@units',
        Name: { $t: 'Carnet denominations' },
        Description: { $t: `Number of ${ticket.type} units in bundle.` },
        TypeOfFareStructureElementRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:carnet_units',
        },
        qualityStructureFactors: {
            QualityStructureFactor: qualityStructureFactors,
        },
    };
};

export const getFareStructuresElements = (
    ticket: Ticket,
    isCarnet: boolean,
    lineName: string,
    placeholderGroupOfProductsName: string,
    groupOfLinesRef: string,
): NetexObject[] => {
    const fareStructureElements: NetexObject[] = [];

    if (isCarnet) {
        fareStructureElements.push(getCarnetElement(ticket));
    }

    if (ticket.groupDefinition) {
        fareStructureElements.push(getGroupElement(ticket.groupDefinition));
    }

    if ('lineName' in ticket) {
        fareStructureElements.push(getLinesElement(ticket, lineName));
        fareStructureElements.push(getEligibilityElement(ticket));

        // P2P Periods have one product with duration details attached
        if (ticket.type === 'period') {
            fareStructureElements.push(
                getDurationElement(ticket, ticket.products[0]),
                getPeriodConditionsElement(ticket, ticket.products[0]),
            );
        } else {
            fareStructureElements.push(getPointToPointConditionsElement(ticket));
        }

        if (ticket.timeRestriction.length > 0) {
            fareStructureElements.push(getPointToPointAvailabilityElement(ticket));
        }

        return fareStructureElements;
    }

    const productFareStructureElements = ticket.products.flatMap(product => {
        let availabilityElementId = '';
        let validityParametersObject = {};
        const hasTimeRestriction = !!ticket.timeRestriction && ticket.timeRestriction.length > 0;

        if (isGeoZoneTicket(ticket)) {
            availabilityElementId = `Tariff@${product.productName}@access_zones`;
            validityParametersObject = {
                FareZoneRef: {
                    version: '1.0',
                    ref: `op:${placeholderGroupOfProductsName}@${ticket.zoneName}`,
                },
            };
        } else if (isMultiServiceTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
            availabilityElementId = `Tariff@${product.productName}@access_lines`;
            validityParametersObject = { LineRef: getLineRefList(ticket) };
        }

        if (isHybridTicket(ticket) && isProductDetails(product)) {
            const zonalAvailabilityElementId = `Tariff@${product.productName}@access_zones`;
            const zonalValidityParametersObject = {
                FareZoneRef: {
                    version: '1.0',
                    ref: `op:${placeholderGroupOfProductsName}@${ticket.zoneName}`,
                },
            };

            return [
                getPeriodAvailabilityElement(
                    zonalAvailabilityElementId,
                    zonalValidityParametersObject,
                    hasTimeRestriction,
                    product.productName,
                    groupOfLinesRef,
                ),
                getDurationElement(ticket, product),
                getPeriodConditionsElement(ticket, product),
            ];
        }

        if ('productDuration' in product) {
            return [
                getPeriodAvailabilityElement(availabilityElementId, validityParametersObject, hasTimeRestriction),
                getDurationElement(ticket, product),
                getPeriodConditionsElement(ticket, product),
            ];
        }

        return [
            getPeriodAvailabilityElement(availabilityElementId, validityParametersObject, hasTimeRestriction),
            getPeriodConditionsElement(ticket, product),
        ];
    });

    fareStructureElements.push(...productFareStructureElements);

    fareStructureElements.push(...getPeriodEligibilityElement(ticket));

    return fareStructureElements;
};

export const getCarnetQualityStructureFactorRef = (
    product: ProductDetails | BaseProduct | PointToPointCarnetProductDetails | FlatFareProductDetails,
): NetexObject =>
    'carnetDetails' in product
        ? {
              QualityStructureFactorRef: {
                  version: '1.0',
                  ref: `mb:Tariff@multitrip@${product.carnetDetails?.quantity}`,
              },
          }
        : {};
