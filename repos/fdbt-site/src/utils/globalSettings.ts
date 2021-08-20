import { GS_REFERER } from '../constants/attributes';
import { NextPageContextWithSession } from '../interfaces';
import { getSessionAttribute, updateSessionAttribute } from './sessions';

export const extractGlobalSettingsReferer = (ctx: NextPageContextWithSession): string | null => {
    const path = ctx.req.headers.referer?.split('/');
    const refererPage = path?.[path.length - 1];
    if (refererPage && ['selectPassengerType'].includes(refererPage)) {
        updateSessionAttribute(ctx.req, GS_REFERER, refererPage);
    }
    return getSessionAttribute(ctx.req, GS_REFERER) ?? null;
};
