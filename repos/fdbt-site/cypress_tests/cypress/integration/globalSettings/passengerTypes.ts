import {
    createEditGroupPassengerTypes,
    createEditSinglePassengerTypes,
    deleteAllCards,
    startGlobalSettings,
} from '../../support/globalSettings';

describe('passenger types', () => {
    it('creates edits and deletes passenger types', () => {
        startGlobalSettings();

        cy.contains('Passenger types').click();

        // Start with clean environment
        deleteAllCards();

        createEditSinglePassengerTypes();
        createEditGroupPassengerTypes();

        deleteAllCards();
    });
});
