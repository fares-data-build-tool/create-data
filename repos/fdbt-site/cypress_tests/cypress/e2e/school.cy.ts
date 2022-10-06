import { isFinished } from '../support/helpers';
import { completeSchoolPage, completeSalesPages, selectFareType } from '../support/steps';

describe('The school faretype product journey', () => {
    it('completes successfully for Academic term/year ticket', () => {
        const numberOfProducts = 5;
        const multiProductNamePrefix = 'Cypress product ';
        selectFareType('schoolService', false);
        completeSchoolPage(numberOfProducts, multiProductNamePrefix);
        completeSalesPages();
        isFinished();
    });
});
