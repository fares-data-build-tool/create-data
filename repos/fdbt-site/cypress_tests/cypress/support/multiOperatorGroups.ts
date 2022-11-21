import { clickElementById, clickElementByText, continueButtonClick, getElementByClass } from './helpers';

export const addSingleMultiOperatorGroup = (name: string, addExtra: boolean) => {
    const input: string[] = [];
    cy.wrap(input).as('inputMultiOp');
    clickElementByText('Add an operator group');
    clickElementById('search-input').clear().type('blackpool');
    clickElementById('search-button');
    clickElementByText('Blackpool Transport - BLAC');
    clickElementById('search-input').clear().type('bus');
    clickElementById('search-button');
    clickElementByText("Warrington's Own Buses - WBTR");
    if (addExtra) {
        clickElementById('search-input').clear().type('Pil');
        clickElementById('search-button');
        clickElementByText('Pilkingtonbus - NWBT');
    }
    clickElementById('operator-group-name').clear().type(name);
    continueButtonClick();
};

const checkCardBody = (card: Cypress.Chainable<JQuery<HTMLElement>>, eq: number) => {
    const valuesToCompare = ['Blackpool Transport - BLAC', "Warrington's Own Buses - WBTR"];
    valuesToCompare.forEach((value, index) => {
        card.get(`[id=operator-${index}]`)
            .eq(eq)
            .should(($p) => {
                expect($p.text()).equal(value);
            });
    });
};

export const createEditMultiOperatorGroups = () => {
    const multiOperatorGroup1 = 'MultiOperator Group 1';
    const multiOperatorGroup2 = 'MultiOperator Group 2';

    addSingleMultiOperatorGroup(multiOperatorGroup1, false);

    const firstCard = getElementByClass('card').eq(0);
    firstCard.should('contain.text', multiOperatorGroup1);
    checkCardBody(firstCard, 0);

    addSingleMultiOperatorGroup(multiOperatorGroup2, true);
    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('contain.text', multiOperatorGroup2);
    checkCardBody(secondCard, 1);
};
