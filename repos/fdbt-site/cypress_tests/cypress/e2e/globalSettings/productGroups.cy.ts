import { deleteAllCards, startGlobalSettings } from '../../support/globalSettings';
import { addSingleProductIfNotPresent, clickElementById, clickElementByText, getHomePage } from '../../support/helpers';
import { createEditProductGroups } from '../../support/productGroups';

describe('product groups', () => {
    it('creates edits and deletes product groups', () => {
        startGlobalSettings();

        addSingleProductIfNotPresent();

        getHomePage();
        clickElementById('account-link');
        clickElementByText('Product groups');
        
        // // start with clean environment
        deleteAllCards();

        createEditProductGroups();

        deleteAllCards();
    });
});
