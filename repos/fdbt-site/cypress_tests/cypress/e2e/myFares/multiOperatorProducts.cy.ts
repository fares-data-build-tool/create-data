import {
    addMultiOperatorProductIfNotPresent,
    clickElementById,
    clickElementByText,
    clickRandomElementInTable,
    getHomePage,
} from '../../support/helpers';
import {
    deleteMultiOperatorProduct,
    editEndDateOtherProductsPage,
    editOperatorGroupMultiOperatorProductsPage,
    editPassengerTypeOtherProductsPage,
    editPurchaseMethodOtherProductsPage,
    editStartDate,
    editTimeRestrictionMultiOperatorProductsPage,
} from '../../support/steps';

describe('The my fares multi operator products pages', () => {
    before(() => {
        addMultiOperatorProductIfNotPresent();
    });
    it('allows the user the edit multi operator product passenger type', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        editPassengerTypeOtherProductsPage();
    });

    it('allows the user the edit multi operator product time restriction', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        editTimeRestrictionMultiOperatorProductsPage();
    });
    it('allows the user the edit other product purchase method', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        editPurchaseMethodOtherProductsPage();
    });
    it('allows the user the edit multi operator product start date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        clickRandomElementInTable('govuk-table__body', 'product-link');
        editStartDate();
    });
    it('allows the user the multi operator product end date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        editEndDateOtherProductsPage();
    });
    it('allows the user to edit multi operator groups for geozone multi-operator tickets', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        editOperatorGroupMultiOperatorProductsPage();
    });
    it('allows the user to delete the multi operator product', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        deleteMultiOperatorProduct();
    });
});
