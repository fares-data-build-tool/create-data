import { clickElementById, clickElementByText, clickRandomElementsInTable, getHomePage } from '../../support/helpers';

describe('Able to access services in my fares', () => {
    it('Able to access service pages', () => {
        getHomePage();
        clickElementById('manage-fares-link');
        clickRandomElementsInTable('govuk-table__body', 'service-link');
    });
    it('Able to access service pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Services');
        clickRandomElementsInTable('govuk-table__body', 'service-link');
    });
});

describe('Able to access other products in my fares', () => {
    it('Able to access other products pages', () => {
        getHomePage();
        clickElementById('manage-fares-link');
        clickElementByText('Other products');
        clickRandomElementsInTable('govuk-table__body', 'product-link');
    });
    it('Able to access service pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        clickRandomElementsInTable('govuk-table__body', 'product-link');
    });
});
