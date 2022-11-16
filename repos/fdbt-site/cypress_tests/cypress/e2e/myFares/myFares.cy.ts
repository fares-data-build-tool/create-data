import {
    addFlatFareProductIfNotPresent,
    addSingleProduct,
    addSingleProductWithManualCSV,
    clickElementById,
    clickElementByText,
    getHomePage,
} from '../../support/helpers';
import {
    completeMyFaresOtherProductsPages,
    completeMyFaresPointToPointProductsPages,
    editEndDateOtherProductsPage,
    editEndDatePointToPointPage,
    editFareTrianglePointToPointPage,
    editPassengerTypeOtherProductsPage,
    editPassengerTypePointToPointPage,
    editProductNameOtherProductsPage,
    editPurchaseMethodOtherProductsPage,
    editServicesOtherProductsPage,
    editStartDateOtherProductsPage,
    editStartDatePointToPointPage,
    editTimeRestrictionOtherProductsPage,
    editTimeRestrictionPointToPointPage,
} from '../../support/steps';

describe('The my fares point to point products pages', () => {
    before(() => {
        addSingleProduct();
        addSingleProductWithManualCSV();
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
        cy.get('@dateUpdatedText').then((dateUpdatedText) => {
            let dateText = dateUpdatedText.toString();
            if (dateText !== 'You created a fare triangle') {
                cy.log('Fare Triangle was CSV uploaded originally')
                dateText = dateText.split(' ')[1];
                const [day, month, year] = dateText.split('/');
                const oldDate = new Date(+year, month - 1, +day);
                cy.log('oldDate', oldDate.toDateString());
                cy.get('[id=fare-triangle]')
                    .invoke('text')
                    .then((text) => {
                        const dateTextNew = text.split(' ')[1];
                        const [dayNew, monthNew, yearNew] = dateTextNew.split('/');
                        const newDate = new Date(+yearNew, monthNew - 1, +dayNew);
                        expect(newDate).to.be.lte(oldDate);
                    });
            }
        });
    });
});
// TO DO  PURCHASE METHODS, NAME, SERVICES Fare triangle has issues

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
