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
            'selectOperatorGroup',
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
