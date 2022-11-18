import * as e from 'express';
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
    cy.get('.govuk-checkboxes__label').each((checkbox, index, checkboxes) => {
        cy.wrap(checkboxes.length.toString()).as('numberOfOperators');
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
    cy.get('@numberOfOperators').then((numberOfOperators) => {
        cy.get('@inputMultiOp').then((input) => {
            const valuesToCompare = input.toString().split(',');
            expect(valuesToCompare).to.have.lengthOf(parseInt(numberOfOperators.toString()));
            valuesToCompare.forEach((value, index) => {
                if (index < 5) {
                    firstCard.get(`[id=operator-${index}]`).should(($p) => {
                        expect($p.text().trim()).equal(value);
                    });
                } else {
                    const restOfOperators = `and ${parseInt(numberOfOperators.toString()) - 5} other operators`;
                    firstCard.get(`[id=rest-of-operators]`).should(($rest) => {
                        expect($rest.text().trim()).equal(restOfOperators);
                    });
                }
            });
        });
    });

    addSingleMultiOperatorGroup(multiOperatorGroup2);
    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('include.text', multiOperatorGroup2);
};
