import {
    addFlatFareProductIfNotPresent,
    clickElementById,
    clickElementByText,
    clickRandomElementInTable,
    getHomePage,
} from '../../support/helpers';
import { completeMyFaresPointToPointProductsPages } from '../../support/steps';

describe.only('The my fares point to point products pages', () => {
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
        clickRandomElementInTable('govuk-table__body', 'product-link');
    });
    it('allows for navigation through the other products pages via operator settings', () => {
        getHomePage();
        clickElementById('account-link');
        clickElementByText('Other products');
        clickRandomElementInTable('govuk-table__body', 'product-link');
    });
});
