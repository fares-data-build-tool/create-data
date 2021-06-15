import { isUuidStringValid } from '../../support/helpers';
import {
    completeFlatFareCarnet,
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectCarnetFareType,
} from '../../support/steps';

describe('The flat fare carnet product journey', () => {
    it('completes successfully', () => {
        selectCarnetFareType('flatFare');
        defineUserTypeAndTimeRestrictions();
        completeFlatFareCarnet();
        completeSalesPages();
        isUuidStringValid();
    });
});
