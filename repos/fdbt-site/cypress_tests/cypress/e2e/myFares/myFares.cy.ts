import {
    addMultiOperatorProductIfNotPresent,
    addOtherProductsIfNotPresent,
    addSingleProductIfNotPresent,
    clickElementById,
    clickElementByText,
    clickRandomElementInTable,
    getElementByClass,
    getElementById,
    getHomePage,
} from '../../support/helpers';
import {
    completeMyFaresMultiOperatorProductsPages,
    completeMyFaresOtherProductsPages,
    completeMyFaresPointToPointProductsPages,
    deleteMultiOperatorProduct,
    editEndDateOtherProductsPage,
    editEndDatePointToPointPage,
    editFareTrianglePointToPointPage,
    editOperatorGroupMultiOperatorProductsPage,
    editPassengerTypeOtherProductsPage,
    editPassengerTypePointToPointPage,
    editProductDuration,
    editProductExpiry,
    editProductName,
    editProductNamePointToPointPage,
    editPurchaseMethodOtherProductsPage,
    editPurchaseMethodPointToPointPage,
    editServicesOtherProductsPage,
    editStartDate,
    editStartDatePointToPointPage,
    editTimeRestriction,
    editTimeRestrictionMultiOperatorProductsPage,
    editTimeRestrictionPointToPointPage,
} from '../../support/steps';

describe('The my fares point to point products pages', () => {
    before(() => {
        addSingleProductIfNotPresent();
    });
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
    it('allows the user the edit point to point product passenger type', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editPassengerTypePointToPointPage();
    });
    it('allows the user the edit point to point product start date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editStartDatePointToPointPage();
    });
    it('allows the user the edit point to point product end date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editEndDatePointToPointPage();
    });
    it('allows the user the edit point to point product time restriction', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editTimeRestrictionPointToPointPage();
    });
    it('allows the user the edit point to point product fare triangle', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editFareTrianglePointToPointPage();
        getElementById('fare-triangle')
            .invoke('text')
            .then((text) => {
                const dateTextNew = text.split(' ')[1];
                const [dayNew, monthNew, yearNew] = dateTextNew.split('/');
                const newDate = new Date(Number(yearNew), Number(monthNew) - 1, Number(dayNew));
                expect(newDate).to.be.lte(new Date());
            });
    });
    it('allows the user the edit point to point product name', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editProductNamePointToPointPage();
    });
    it('allows the user the edit point to point product purchase method', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        editPurchaseMethodPointToPointPage();
    });
});

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
    it('allows the user the edit other product name', () => {
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

describe('The my fares multi operator products pages', () => {
    before(() => {
        addMultiOperatorProductIfNotPresent();
    });
    it('allows for navigation through the multi operator products pages', () => {
        getHomePage();
        clickElementById('manage-fares-link');
        clickElementByText('Multi-operator products');
        completeMyFaresMultiOperatorProductsPages();
    });
    it('allows for navigation through the multi operator products pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        completeMyFaresMultiOperatorProductsPages();
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
