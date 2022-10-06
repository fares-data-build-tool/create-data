import { deleteAllCards, startGlobalSettings } from '../../support/globalSettings';
import { createEditTimeRestriction } from '../../support/timeRestrictions';

describe('time restrictions', () => {
    it('creates edits and deletes time restrictions', () => {
        startGlobalSettings();

        cy.contains('Time restrictions').click();

        // start with clean environment
        deleteAllCards();

        createEditTimeRestriction();

        deleteAllCards();
    });
});
