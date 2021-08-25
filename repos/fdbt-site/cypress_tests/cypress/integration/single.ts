import { isUuidStringValid } from '../support/helpers';
import {
    completeSalesPages,
    completeSinglePages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
} from '../support/steps';

describe('The single faretype product journey', () => {
    it('completes successfully for csv upload', () => {
        selectFareType('single', false);
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(true, false);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for manual upload', () => {
        selectFareType('single', false);
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(false, false);
        completeSalesPages();
        isUuidStringValid();
    });
});
