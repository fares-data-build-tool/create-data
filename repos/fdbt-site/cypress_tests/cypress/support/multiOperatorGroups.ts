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
    randomlySelectMultiServices();
    clickElementById('operator-group-name').clear().type(name);
    continueButtonClick();
};
export const createEditMultiOperatorGroups = () => {
    const multiOperatorGroup1 = 'MultiOperator Group 1';
    const multiOperatorGroup2 = 'MultiOperator Group 2';

    addSingleMultiOperatorGroup(multiOperatorGroup1);
    addSingleMultiOperatorGroup(multiOperatorGroup2);

    const firstCard = getElementByClass('card').eq(0);
    firstCard.should('include.text', multiOperatorGroup1);
    // firstCard.should('include.text', 'Proof document(s): Membership card, Identity document');

    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('include.text', multiOperatorGroup2);
    // secondCard.should('include.text', 'Proof document(s): N/A');
};
