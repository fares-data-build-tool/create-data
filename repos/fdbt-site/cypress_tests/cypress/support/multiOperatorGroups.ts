import {
    clickElementById,
    clickElementByText,
    continueButtonClick,
    getElementByClass,
    getElementByDataTestId,
    getElementById,
    getElementByName,
    randomlySelectMultiServices,
} from './helpers';

const addSingleMultiOperatorGroup = (name: string) => {
    clickElementByText('Add an operator group');
    clickElementById('search-input').clear().type('bus');
    clickElementById('search-button');
    const input: string[] = [];
    cy.get('[class=govuk-checkboxes__item]').each((checkbox, index) => {
        cy.wrap(checkbox).click();
        input[index] = checkbox.text();
        cy.log(index.toString(), checkbox.text());
        cy.wrap(input).as('inputMultiOp');
    });
    clickElementById('operator-group-name').clear().type(name);
    continueButtonClick();
};
export const createEditMultiOperatorGroups = () => {
    const multiOperatorGroup1 = 'MultiOperator Group 1';
    const multiOperatorGroup2 = 'MultiOperator Group 2';

    addSingleMultiOperatorGroup(multiOperatorGroup1);

    const firstCard = getElementByClass('card').eq(0);
    firstCard.should('include.text', multiOperatorGroup1);
    cy.get('@inputMultiOp').then((input) => {
        cy.log(input.toString());
        const valuesToCompare = input.toString().split(',');
        valuesToCompare.forEach((value) => {
            firstCard.should('include.text', value);
        });
    });
    addSingleMultiOperatorGroup(multiOperatorGroup2);
    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('include.text', multiOperatorGroup2);
};
