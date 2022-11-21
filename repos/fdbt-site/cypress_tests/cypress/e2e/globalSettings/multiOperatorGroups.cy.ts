import { deleteAllCards, startGlobalSettings } from '../../support/globalSettings';
import { createEditMultiOperatorGroups } from '../../support/multiOperatorGroups';

describe('multi operator groups', () => {
    it('creates edits and deletes multi operator groups', () => {
        startGlobalSettings();

        cy.contains('Operator groups').click();

        // start with clean environment
        deleteAllCards();

        createEditMultiOperatorGroups();

        deleteAllCards();
    });
});
