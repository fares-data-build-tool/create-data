import { deleteAllCards, startGlobalSettings } from '../../support/globalSettings';
import { createEditPurchaseMethod } from '../../support/purchaseMethods';

describe('purchase methods', () => {
    it('creates edits and deletes purchase methods', () => {
        startGlobalSettings();

        cy.contains('Purchase methods').click();

        // start with clean environment
        deleteAllCards();

        createEditPurchaseMethod();

        deleteAllCards();
    });
});
