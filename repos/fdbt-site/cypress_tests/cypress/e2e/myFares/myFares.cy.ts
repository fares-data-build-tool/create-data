import {
    addFlatFareProductIfNotPresent,
    addMultiOperatorProductIfNotPresent,
    addSingleProductIfNotPresent,
    clickElementById,
    clickElementByText,
    getHomePage,
} from '../../support/helpers';
import {
    completeMyFaresMultiOperatorProductsPages,
    completeMyFaresOtherProductsPages,
    completeMyFaresPointToPointProductsPages,
    editEndDateOtherProductsPage,
    editEndDatePointToPointPage,
    editFareTrianglePointToPointPage,
    editPassengerTypeOtherProductsPage,
    editPassengerTypePointToPointPage,
    editProductNameOtherProductsPage,
    editProductNamePointToPointPage,
    editPurchaseMethodOtherProductsPage,
    editPurchaseMethodPointToPointPage,
    editServicesOtherProductsPage,
    editStartDateOtherProductsPage,
    editStartDatePointToPointPage,
    editTimeRestrictionOtherProductsPage,
    editTimeRestrictionPointToPointPage,
} from '../../support/steps';

describe('The my fares point to point products pages', () => {
    before(() => {
       addSingleProductIfNotPresent()
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
        cy.get('[id=fare-triangle]')
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
        cy.get('[class=govuk-table__body]')
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
        editTimeRestrictionOtherProductsPage();
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
        editStartDateOtherProductsPage();
    });
    it('allows the user the multi operator product end date', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Multi-operator products');
        editEndDateOtherProductsPage();
    });
});