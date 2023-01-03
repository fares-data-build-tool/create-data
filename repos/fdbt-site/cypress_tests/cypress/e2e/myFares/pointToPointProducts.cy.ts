import {
    addSingleProductIfNotPresent,
    clickElementById,
    clickElementByText,
    getElementById,
    getHomePage,
} from '../../support/helpers';
import {
    completeMyFaresPointToPointProductsPages,
    editEndDatePointToPointPage,
    editFareTrianglePointToPointPage,
    editPassengerTypePointToPointPage,
    editProductNamePointToPointPage,
    editPurchaseMethodPointToPointPage,
    editStartDatePointToPointPage,
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
