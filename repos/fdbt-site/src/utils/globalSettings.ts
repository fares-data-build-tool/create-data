import { DbTimeRestriction } from 'shared/dbTypes';
import {
    BaseSchemeOperatorTicket,
    BaseTicket,
    FullTimeRestriction,
    Ticket,
    TicketWithIds,
} from 'shared/matchingJsonTypes';
import {
    getFareDayEnd,
    getGroupDefinition,
    getSalesOfferPackagesByNocCode,
    getSingleOrGroupPassengerTypeById,
    getTimeRestrictionByIdAndNoc,
} from 'src/data/auroradb';
import { isBasePeriodTicket } from 'src/interfaces/typeGuards';
import { GS_REFERER } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getAndValidateNoc, getCsrfToken } from './index';
import { getSessionAttribute, updateSessionAttribute } from './sessions';

export const extractGlobalSettingsReferer = (ctx: NextPageContextWithSession): string | null => {
    const path = ctx.req.headers.referer?.split('/');
    const refererPage = path?.[path.length - 1];
    if (
        refererPage &&
        [
            'selectPassengerType',
            'selectTimeRestrictions',
            'selectPurchaseMethods',
            'selectPeriodValidity',
            'fareType',
        ].includes(refererPage)
    ) {
        updateSessionAttribute(ctx.req, GS_REFERER, refererPage);
    }
    return getSessionAttribute(ctx.req, GS_REFERER) ?? null;
};

export type GlobalSettingsManageProps<T extends { id: number }> = {
    csrfToken: string;
    errors: ErrorInfo[];
    editMode: boolean;
    inputs?: T;
};

export const getGlobalSettingsManageProps = async <T extends { id: number }>(
    ctx: NextPageContextWithSession,
    getByIdFn: (id: number, noc: string) => Promise<T | undefined>,
    sessionAttribute: { inputs: T; errors: ErrorInfo[] } | undefined,
): Promise<{
    props: GlobalSettingsManageProps<T>;
}> => {
    const csrfToken = getCsrfToken(ctx);
    const userInputsAndErrors = sessionAttribute;
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const editId = Number.isInteger(Number(ctx.query.id)) ? Number(ctx.query.id) : undefined;

    let inputs: T | undefined,
        errors: ErrorInfo[] = [];
    if ((userInputsAndErrors?.inputs.id || undefined) === editId) {
        inputs = userInputsAndErrors?.inputs;
        errors = userInputsAndErrors?.errors ?? [];
    } else if (editId) {
        inputs = await getByIdFn(editId, nationalOperatorCode);
        if (!inputs) {
            throw new Error('No entity for this NOC matches the passed id');
        }
    }

    return {
        props: {
            csrfToken,
            errors,
            editMode: !!editId,
            ...(inputs && { inputs }),
        },
    };
};

export const getFullTicketFromTicketWithIds = async (ticketWithIds: TicketWithIds, noc: string): Promise<Ticket> => {
    const singleOrGroupPassengerType = await getSingleOrGroupPassengerTypeById(ticketWithIds.passengerType.id, noc);

    let passengerType, groupDefinition;
    if ('groupPassengerType' in singleOrGroupPassengerType) {
        passengerType = { passengerType: 'group' };
        groupDefinition = await getGroupDefinition(singleOrGroupPassengerType.groupPassengerType, noc);
    } else {
        passengerType = singleOrGroupPassengerType.passengerType;
    }

    const allSops = await getSalesOfferPackagesByNocCode(noc);

    const fullProducts = ticketWithIds.products.map((product) => ({
        ...product,
        salesOfferPackages: product.salesOfferPackages.map((sopWithIds) => {
            const sop = allSops.find((it) => it.id === sopWithIds.id);
            if (!sop) {
                throw new Error(`No sop found for id [${sopWithIds.id}]`);
            }
            return { ...sop, price: sopWithIds.price };
        }),
    }));

    const timeRestriction = ticketWithIds.timeRestriction
        ? await (
              await getTimeRestrictionByIdAndNoc(ticketWithIds.timeRestriction.id, noc)
          ).contents
        : [];

    const fareDayEnd = await getFareDayEnd(noc);

    const timeRestrictionWithUpdatedFareDayEnds: FullTimeRestriction[] = timeRestriction.map(
        (timeRestriction: DbTimeRestriction) => ({
            ...timeRestriction,
            timeBands: timeRestriction.timeBands.map((timeBand) => {
                let endTime: string;
                if (typeof timeBand.endTime === 'string') {
                    endTime = timeBand.endTime;
                } else {
                    if (!fareDayEnd) {
                        throw new Error('No fare day end set for time restriction');
                    }

                    endTime = fareDayEnd;
                }

                return {
                    ...timeBand,
                    endTime: endTime,
                };
            }),
        }),
    );

    const setFareDayEnd =
        isBasePeriodTicket(ticketWithIds) && ticketWithIds.products[0].productValidity === 'fareDayEnd';

    const baseTicket: BaseTicket | BaseSchemeOperatorTicket = {
        ...ticketWithIds,
        ...passengerType,
        groupDefinition,
        timeRestriction: timeRestrictionWithUpdatedFareDayEnds,
    };

    return {
        ...baseTicket,
        products: fullProducts,
        fareDayEnd: setFareDayEnd ? fareDayEnd : undefined,
    } as Ticket;
};
