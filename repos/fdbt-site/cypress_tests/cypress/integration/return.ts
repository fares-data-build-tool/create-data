import { isUuidStringValid } from '../support/helpers';
import {
    completeReturnPages,
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
} from '../support/steps';

describe('The return faretype product journey', () => {
    it('completes successfully for csv upload', () => {
        selectFareType('return', false);
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(true, false, false, false);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for csv upload with partial matching fare stages', () => {
        selectFareType('return', false);
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(true, false, false, true);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for manual upload', () => {
        selectFareType('return', false);
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(false, false, false, false);
        completeSalesPages();
        isUuidStringValid();
    });
});
