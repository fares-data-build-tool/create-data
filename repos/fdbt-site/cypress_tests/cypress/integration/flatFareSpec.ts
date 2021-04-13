import {
    defineUserTypeAndTimeRestrictions,
    completeFlatFarePages,
    selectFareType,
    completeSalesPages,
} from '../support/steps';
import { isUuidStringValid } from '../support/helpers';

describe('The flat fare faretype product journey', () => {
    it('completes successfully', () => {
        selectFareType('flatFare');
        defineUserTypeAndTimeRestrictions();
        completeFlatFarePages('Flat Fare Test Product');
        completeSalesPages();
        isUuidStringValid();
    });
});
