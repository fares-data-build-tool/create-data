import { isUuidStringValid } from '../support/helpers';
import {
    completeFlatFarePages,
    completeSalesPages,
    defineSchoolUserAndTimeRestrictions,
    selectFareType,
    selectSchoolFareType,
} from '../support/steps';

describe('The school flat fare faretype product journey', () => {
    it('completes successfully', () => {
        selectFareType('schoolService', false);
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('flatFare');
        completeFlatFarePages('School Flat Fare Test Product', false);
        completeSalesPages();
        isUuidStringValid();
    });
});
