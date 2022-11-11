import {
    addFlatFareProductIfNotPresent,
    clickElementById,
    clickElementByText,
    getHomePage,
} from '../../support/helpers';
import {
    completeMyFaresOtherProductsPages,
    completeMyFaresPointToPointProductsPages,
    editEndDateOtherProductsPage,
    editPassengerTypeOtherProductsPage,
    editProductNameOtherProductsPage,
    editPurchaseMethodOtherProductsPage,
    editServicesOtherProductsPage,
    editStartDateOtherProductsPage,
    editTimeRestrictionOtherProductsPage,
} from '../../support/steps';

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
        editServicesOtherProductsPage();
    });
    it('allows the user the edit other product passenger type', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        editPassengerTypeOtherProductsPage();
    });
    it('allows the user the edit other product start date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        editStartDateOtherProductsPage();
    });
    it('allows the user the edit other product end date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        editEndDateOtherProductsPage();
    });
    it('allows the user the edit other product purchase method', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        editPurchaseMethodOtherProductsPage();
    });
    it('allows the user the edit other product time restriction', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        editTimeRestrictionOtherProductsPage();
    });
    it('allows the user the edit other product name', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        editProductNameOtherProductsPage();
    });
});
