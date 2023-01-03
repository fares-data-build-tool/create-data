import {
    addOtherProductsIfNotPresent,
    clickElementById,
    clickElementByText,
    clickRandomElementInTable,
    getElementByClass,
    getHomePage,
} from '../../support/helpers';
import {
    completeMyFaresOtherProductsPages,
    editCarnetExpiry,
    editEndDateOtherProductsPage,
    editPassengerTypeOtherProductsPage,
    editProductDuration,
    editProductExpiry,
    editProductName,
    editPurchaseMethodOtherProductsPage,
    editQuantityInBundle,
    editServicesOtherProductsPage,
    editStartDate,
    editTimeRestriction,
} from '../../support/steps';

describe('The my fares other products pages', () => {
    before(() => {
        addOtherProductsIfNotPresent();
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
        getElementByClass('govuk-table__body')
            .contains('[class=govuk-table__row]', 'Flat fare')
            .find('td a')
            .click()
            .then(() => {
                editServicesOtherProductsPage();
            });
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
        clickRandomElementInTable('govuk-table__body', 'product-link');
        editStartDate();
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
        getElementByClass('govuk-table__body')
            .contains('[class=govuk-table__row]', 'Flat fare')
            .find('td a')
            .click()
            .then(() => {
                editTimeRestriction();
            });
    });
    it('allows the user the edit other product period duration', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        getElementByClass('govuk-table__body')
            .contains('[class=govuk-table__row]', 'Period')
            .find('td a')
            .click()
            .then(() => {
                editProductDuration();
            });
    });
    it('allows the user to edit a carnet product quantity', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        getElementByClass('govuk-table__body')
            .contains('[class=govuk-table__row]', 'Flat fare carnet')
            .find('td a')
            .click()
            .then(() => {
                editQuantityInBundle();
            });
    });
    it('allows the user to edit a carnet product expiry', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        getElementByClass('govuk-table__body')
            .contains('[class=govuk-table__row]', 'Flat fare carnet')
            .find('td a')
            .click()
            .then(() => {
                editCarnetExpiry();
            });
    });
    it('allows the user to edit an other product name', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        clickRandomElementInTable('govuk-table__body', 'product-link');
        editProductName();
    });
    it('allows the user the edit product validity', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        getElementByClass('govuk-table__body')
            .contains('[class=govuk-table__row]', 'Period')
            .find('td a')
            .click()
            .then(() => {
                editProductExpiry();
            });
    });
});
