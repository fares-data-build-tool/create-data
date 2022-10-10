import { isFinished } from '../support/helpers';
import { completeAcademicPage, completeSalesPages, selectFareType } from '../support/steps';

describe('The school faretype product journey', () => {
    it('completes successfully for Academic term/year ticket', () => {
        const numberOfProducts = 5;
        const multiProductNamePrefix = 'Cypress product ';
        selectFareType('schoolService', false);
        completeAcademicPage(numberOfProducts, multiProductNamePrefix);
        completeSalesPages();
        isFinished();
    });
});