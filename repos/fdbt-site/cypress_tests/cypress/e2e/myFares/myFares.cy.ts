import {
    addFlatFareProductIfNotPresent,
    clickElementById,
    clickElementByText,
    getHomePage,
} from '../../support/helpers';
import { completeMyFaresOtherProductsPages, completeMyFaresPointToPointProductsPages, editServicesOtherProductsPage } from '../../support/steps';

describe('The my fares point to point products pages', () => {
    it('allows for navigation through the point to point products pages', () => {
        getHomePage();
        clickElementById('manage-fares-link');
        completeMyFaresPointToPointProductsPages();
    });
    it('allows for navigation through the point to point products pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        completeMyFaresPointToPointProductsPages();
    });
});

describe('The my fares other products pages', () => {
    before(() => {
        addFlatFareProductIfNotPresent();
    });
    it('allows for navigation through the other products pages', () => {
        getHomePage();
        clickElementById('manage-fares-link');
        clickElementByText('Other products');
        completeMyFaresOtherProductsPages();
    });
    it('allows for navigation through the other products pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        completeMyFaresOtherProductsPages();
    });
    it('allows the user the edit other product services', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        completeMyFaresOtherProductsPages();
        editServicesOtherProductsPage()
    });
});
