import {
    startPageButtonClick,
    clickElementById,
    continueButtonClick,
    randomlyDetermineUserType,
    randomlyDecideTimeRestrictions,
    randomlyChooseAndSelectServices,
    getElementById,
} from './helpers';

export const stepsToSelectFlatFareServiceSelection = (): void => {
    startPageButtonClick();
    clickElementById('fare-type-flatFare');
    continueButtonClick();
    randomlyDetermineUserType();
    randomlyDecideTimeRestrictions();
    continueButtonClick();
};

export const completeFlatFarePages = (productName: string): void => {
    randomlyChooseAndSelectServices();
    continueButtonClick();
    getElementById('product-details-name').type(productName);
    getElementById('product-details-price').type('50.50');
    continueButtonClick();
    continueButtonClick();
};
