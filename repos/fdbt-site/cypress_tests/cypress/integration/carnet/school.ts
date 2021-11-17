import { isFinished } from '../../support/helpers';
import {
    completeSalesPages,
    completeSchoolPeriodMultiServicePages,
    completeSinglePages,
    defineSchoolUserAndTimeRestrictions,
    selectCarnetFareType,
    selectSchoolFareType,
} from '../../support/steps';

describe('The school carnet fare type product journey', () => {
    it('completes successfully for school single manual upload', () => {
        selectCarnetFareType('schoolService');
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('single');
        completeSinglePages(false, true);
        completeSalesPages();
        isFinished();
    });

    it('completes successfully for school period', () => {
        const numberOfProducts = 2;
        const multiProductNamePrefix = 'School carnet product ';
        selectCarnetFareType('schoolService');
        defineSchoolUserAndTimeRestrictions();
        selectSchoolFareType('period');
        completeSchoolPeriodMultiServicePages(numberOfProducts, multiProductNamePrefix, true);
        completeSalesPages(numberOfProducts, multiProductNamePrefix);
        isFinished();
    });
});
