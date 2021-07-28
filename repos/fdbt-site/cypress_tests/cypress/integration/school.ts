import { isUuidStringValid } from '../support/helpers';
import {
    completeFlatFarePages,
    completeSalesPages,
    defineSchoolUserAndTimeRestrictions,
    selectFareType,
    selectSchoolFareType,
    completeSinglePages,
    completeSchoolPeriodMultiServicePages,
} from '../support/steps';

describe('The school faretype product journey', () => {
    it('completes successfully for school flat fare', () => {
        selectFareType('schoolService', false);
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('flatFare');
        completeFlatFarePages('School Flat Fare Test Product', false);
        completeSalesPages();
        isUuidStringValid();
    });
    it('completes successfully for school single manual upload', () => {
        selectFareType('schoolService', false);
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('single');
        completeSinglePages(false, false, false);
        completeSalesPages();
        isUuidStringValid();
    });
    it('completes successfully for school single csv upload', () => {
        selectFareType('schoolService', false);
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('single');
        completeSinglePages(true, false, false);
        completeSalesPages();
        isUuidStringValid();
    });
    it('completes successfully for school single csv upload with partial matching fare stages', () => {
        selectFareType('schoolService', false);
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('single');
        completeSinglePages(true, false, true);
        completeSalesPages();
        isUuidStringValid();
    });
    it('completes successfully for school period', () => {
        const numberOfProducts = 5;
        const multiProductNamePrefix = 'Cypress product ';
        selectFareType('schoolService', false);
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('period');
        completeSchoolPeriodMultiServicePages(numberOfProducts, multiProductNamePrefix);
        completeSalesPages(numberOfProducts, multiProductNamePrefix);
        isUuidStringValid();
    });
});
