import { stepsToSelectFlatFareServiceSelection, completeFlatFarePages } from '../support/steps';
import {
    getHomePage,
    clickSelectedNumberOfCheckboxes,
    continueButtonClick,
    completeProductDateInformationPage,
    isUuidStringValid,
} from '../support/helpers';

describe('The flat fare multiservice product journey', () => {
    it('completes successfully', () => {
        getHomePage();
        stepsToSelectFlatFareServiceSelection();
        completeFlatFarePages('Flat Fare Test Product');
        clickSelectedNumberOfCheckboxes(false);
        continueButtonClick();
        completeProductDateInformationPage();
        continueButtonClick();
        isUuidStringValid();
    });
});
