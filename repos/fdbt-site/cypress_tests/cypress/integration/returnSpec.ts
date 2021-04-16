import {
    selectFareType,
    defineUserTypeAndTimeRestrictions,
    completeSalesPages,
    completeReturnPages,
} from '../support/steps';
import { isUuidStringValid } from '../support/helpers';

describe('The return faretype product journey', () => {
    it('completes successfully for csv upload', () => {
        selectFareType('return');
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(true);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for manual upload', () => {
        selectFareType('return');
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(false);
        completeSalesPages();
        isUuidStringValid();
    });
});
