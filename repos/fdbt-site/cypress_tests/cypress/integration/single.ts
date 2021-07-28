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
        completeSinglePages(true, false, false);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for csv upload with partial mapping of fare stages', () => {
        selectFareType('single', false);
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(true, false, true);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for manual upload', () => {
        selectFareType('single', false);
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(false, false, false);
        completeSalesPages();
        isUuidStringValid();
    });
});
