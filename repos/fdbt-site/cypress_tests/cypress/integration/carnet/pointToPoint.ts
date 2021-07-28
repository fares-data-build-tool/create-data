import { isUuidStringValid } from '../../support/helpers';
import {
    completeReturnPages,
    completeSalesPages,
    completeSinglePages,
    defineUserTypeAndTimeRestrictions,
    selectCarnetFareType,
} from '../../support/steps';

describe('The carnet faretype product journey', () => {
    it('completes successfully for single faretype', () => {
        selectCarnetFareType('single');
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(true, true, false);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for return faretype', () => {
        selectCarnetFareType('return');
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(true, true, false, false);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for return faretype', () => {
        selectCarnetFareType('return');
        defineUserTypeAndTimeRestrictions();
        completeReturnPages(true, true, false, true);
        completeSalesPages();
        isUuidStringValid();
    });
});
