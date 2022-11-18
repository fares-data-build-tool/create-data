import { clickElementById, clickElementByText, continueButtonClick, getElementByClass } from './helpers';

const addSingleMultiOperatorGroup = (name: string) => {
    clickElementByText('Add an operator group');
    clickElementById('search-input').clear().type('bus');
    clickElementById('search-button');
    const input: string[] = [];
    cy.wrap(input).as('inputMultiOp');
    cy.get('.govuk-checkboxes__label').each((checkbox, index, checkboxes) => {
        cy.wrap(checkboxes.length.toString()).as('numberOfOperators');
        cy.wrap(checkbox).click();
        input[index] = checkbox.text();
        cy.wrap(input).as('inputMultiOp');
    });
    clickElementById('operator-group-name').clear().type(name);
    continueButtonClick();
};

const checkCardBody = (card: Cypress.Chainable<JQuery<HTMLElement>>, eq: number) => {
    cy.get('@numberOfOperators').then((numberOfOperators) => {
        cy.get('@inputMultiOp').then((input) => {
            const valuesToCompare = input.toString().split(',');
            expect(valuesToCompare).to.have.lengthOf(parseInt(numberOfOperators.toString()));
            valuesToCompare.forEach((value, index) => {
                if (index < 5) {
                    card.get(`[id=operator-${index}]`)
                        .eq(eq)
                        .should(($p) => {
                            expect($p.text()).equal(value);
                        });
                } else {
                    const restOfOperators = `and ${parseInt(numberOfOperators.toString()) - 5} other operators`;
                    card.get(`[id=rest-of-operators]`)
                        .eq(eq)
                        .should(($rest) => {
                            expect($rest.text()).equal(restOfOperators);
                        });
                }
            });
        });
    });
};

export const createEditMultiOperatorGroups = () => {
    const multiOperatorGroup1 = 'MultiOperator Group 1';
    const multiOperatorGroup2 = 'MultiOperator Group 2';

    addSingleMultiOperatorGroup(multiOperatorGroup1);

    const firstCard = getElementByClass('card').eq(0);
    firstCard.should('contain.text', multiOperatorGroup1);
    checkCardBody(firstCard, 0);

    addSingleMultiOperatorGroup(multiOperatorGroup2);
    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('contain.text', multiOperatorGroup2);
    checkCardBody(secondCard, 1);
};
