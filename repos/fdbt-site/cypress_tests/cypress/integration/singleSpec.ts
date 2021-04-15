import {
    selectFareType,
    defineUserTypeAndTimeRestrictions,
    completeSinglePages,
    completeSalesPages,
} from '../support/steps';
import { isUuidStringValid } from '../support/helpers';

describe('The single faretype product journey', () => {
    it('completes successfully for csv upload', () => {
        selectFareType('single');
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(true);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for manual upload', () => {
        selectFareType('single');
        defineUserTypeAndTimeRestrictions();
        completeSinglePages(false);
        completeSalesPages();
        isUuidStringValid();
    });
});
