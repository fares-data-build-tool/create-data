import { isUuidStringValid } from '../support/helpers';
import {
    completeFlatFarePages,
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
} from '../support/steps';

describe('The flat fare faretype product journey', () => {
    it('completes successfully', () => {
        selectFareType('flatFare', false);
        defineUserTypeAndTimeRestrictions();
        completeFlatFarePages('Flat Fare Test Product', false);
        completeSalesPages();
        isUuidStringValid();
    });
});
