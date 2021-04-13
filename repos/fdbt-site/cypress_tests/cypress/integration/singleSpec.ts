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
});
