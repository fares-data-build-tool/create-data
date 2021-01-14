import snakeCase from 'lodash/snakeCase';
import capitalize from 'lodash/capitalize';
import parser from 'xml2json';
import fs from 'fs';
import moment from 'moment';
import {
    CoreData,
    SchemeOperatorTicket,
    isSchemeOperatorTicket,
    FlatFareTicket,
    PeriodTicket,
    PointToPointTicket,
    GroupTicket,
    User,
    GroupCompanion,
    FullTimeRestriction,
    Operator,
    isPointToPointTicket,
} from '../types/index';

import { getBaseSchemeOperatorInfo } from './period-tickets/periodTicketNetexHelpers';

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

export const isGroupTicket = (ticket: PeriodTicket | PointToPointTicket | FlatFareTicket): ticket is GroupTicket =>
    (ticket as GroupTicket).groupDefinition !== undefined;

export const getProfileRef = (ticket: PeriodTicket | PointToPointTicket | FlatFareTicket): NetexObject => {
    if (isGroupTicket(ticket)) {
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
            ref: `op:${ticket.passengerType}`,
        },
    };
};

export const getUserProfile = (user: User | GroupCompanion): NetexObject => ({
    version: '1.0',
    id: `op:${user.passengerType}`,
    Name: { $t: user.passengerType },
    TypeOfConcessionRef: {
        version: 'fxc:v1.0',
        ref: `fxc:${
            user.passengerType === 'anyone' || user.passengerType === 'adult' ? 'none' : snakeCase(user.passengerType)
        }`,
    },
    MinimumAge: { $t: user.ageRangeMin || null },
    MaximumAge: { $t: user.ageRangeMax || null },
    ProofRequired: { $t: user.proofDocuments?.join(' ') || null },
});

export const getGroupElement = (userPeriodTicket: GroupTicket): NetexObject => {
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
                        $t: userPeriodTicket.groupDefinition.maxPeople,
                    },
                    companionProfiles: {
                        CompanionProfile: userPeriodTicket.groupDefinition.companions.map(companion => ({
                            version: '1.0',
                            id: `op:companion@${companion.passengerType}`,
                            UserProfileRef: {
                                version: '1.0',
                                ref: `op:${companion.passengerType}`,
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

const getDayLength = (startTime: string, endTime: string): string => {
    const startMoment = moment(startTime, 'HHmm');
    const endMoment = moment(endTime, 'HHmm');
    const diff = endMoment.diff(startMoment, 'minute');

    return moment.duration(diff, 'minute').toISOString();
};

export const getFareDayTypeElements = (timeRestriction: FullTimeRestriction): NetexObject => ({
    id: `op@Tariff@DayType@${timeRestriction.day}`,
    version: '1.0',
    EarliestTime: {
        $t: timeRestriction.startTime ? getTime(timeRestriction.startTime) : null,
    },
    DayLength: {
        $t:
            timeRestriction.startTime && timeRestriction.endTime
                ? getDayLength(timeRestriction.startTime, timeRestriction.endTime)
                : null,
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
        return 'WBTR';
    }

    return nocCode;
};

export const getCoreData = (
    operators: Operator[],
    ticket: PointToPointTicket | PeriodTicket | FlatFareTicket | SchemeOperatorTicket,
): CoreData => {
    if (isPointToPointTicket(ticket)) {
        const baseOperatorInfo = operators.find(operator => operator.nocCode === ticket.nocCode);
        if (!baseOperatorInfo) {
            throw new Error('Could not find base operator information for point to point ticket.');
        }
        return {
            opIdNocFormat: `noc:${operators[0].opId}`,
            nocCodeFormat: `noc:${ticket.nocCode}`,
            currentDate: new Date(Date.now()),
            website: getCleanWebsite(operators[0].website),
            brandingId: `op:${ticket.nocCode}@brand`,
            operatorIdentifier: ticket.nocCode,
            baseOperatorInfo: [baseOperatorInfo],
            placeholderGroupOfProductsName: '',
            ticketUserConcat: `${ticket.type}_${ticket.passengerType}`,
            operatorPublicNameLineNameFormat: `${operators[0].operatorPublicName} ${ticket.lineName}`,
            nocCodeLineNameFormat: `${ticket.nocCode}_${ticket.lineName}`,
            lineIdName: `Line_${ticket.lineName}`,
            lineName: ticket.lineName,
            operatorName: ticket.operatorShortName,
            ticketType: ticket.type,
        };
    }
    const periodTicket: PeriodTicket | FlatFareTicket | SchemeOperatorTicket = ticket;
    const baseOperatorInfo = isSchemeOperatorTicket(periodTicket)
        ? getBaseSchemeOperatorInfo(periodTicket)
        : operators.find(operator => operator.nocCode === periodTicket.nocCode);

    const operatorIdentifier = isSchemeOperatorTicket(periodTicket)
        ? `${periodTicket.schemeOperatorName}-${periodTicket.schemeOperatorRegionCode}`
        : periodTicket.nocCode;

    if (!baseOperatorInfo) {
        throw new Error('Could not find base operator');
    }

    const nocCodeFormat = `noc:${
        isSchemeOperatorTicket(periodTicket) ? operatorIdentifier : replaceIWBusCoNocCode(periodTicket.nocCode)
    }`;

    return {
        opIdNocFormat: `noc:${baseOperatorInfo.opId}`,
        nocCodeFormat,
        currentDate: new Date(Date.now()),
        website: getCleanWebsite(baseOperatorInfo.website),
        brandingId: `op:${operatorIdentifier}@brand`,
        operatorIdentifier,
        baseOperatorInfo: [baseOperatorInfo],
        placeholderGroupOfProductsName: `${operatorIdentifier}_products`,
        ticketUserConcat: `${periodTicket.type}_${periodTicket.passengerType}`,
        operatorPublicNameLineNameFormat: '',
        nocCodeLineNameFormat: '',
        lineIdName: '',
        lineName: '',
        operatorName: isSchemeOperatorTicket(periodTicket)
            ? periodTicket.schemeOperatorName
            : periodTicket.operatorName,
        ticketType: periodTicket.type,
    };
};
