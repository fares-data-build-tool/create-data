import {
    addFlatFareProductIfNotPresent,
    clickElementById,
    clickElementByText,
    clickRandomElementsInTable,
    getHomePage,
} from '../../support/helpers';

describe('The my fares point to point products pages', () => {
    it('allows for navigation through the point to point products pages', () => {
        getHomePage();
        clickElementById('manage-fares-link');
        clickRandomElementsInTable('govuk-table__body', 'service-link');
    });
    it('allows for navigation through the point to point products pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        clickRandomElementsInTable('govuk-table__body', 'service-link');
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
        clickRandomElementsInTable('govuk-table__body', 'product-link');
    });
    it('allows for navigation through the other products pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        clickRandomElementsInTable('govuk-table__body', 'product-link');
    });
});
