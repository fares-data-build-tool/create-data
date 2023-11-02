import { clickElementById, clickElementByText, continueButtonClick, getElementByClass } from './helpers';

const addExtraOperator = (): void => {
    clickElementById('search-input').clear().type('Pil');
    clickElementById('search-button');
    clickElementByText('Pilkingtonbus - NWBT');
};

export const addSingleMultiOperatorGroup = (name: string, addExtra: boolean, addMulti: boolean): void => {
    clickElementByText('Add an operator group');
    if (addMulti) {
        clickElementById('search-input').clear().type('bus');
        clickElementById('search-button');
        clickElementByText('Preston Bus - PBLT');
        clickElementById('search-input').clear().type('bus');
        clickElementById('search-button');
        clickElementByText('The Blackburn Bus Company - LNUD');
    }
    if (addExtra || !addMulti) {
        addExtraOperator();
    }
    clickElementById('operator-group-name').clear().type(name);
    continueButtonClick();
};

const checkCardBody = (
    card: Cypress.Chainable<JQuery<HTMLElement>>,
    indexOfCard: number,
    valuesToCompare: string[],
) => {
    valuesToCompare.forEach((value, index) => {
        card.get(`[id=operator-${index}]`)
            .eq(indexOfCard)
            .should(($p) => {
                expect($p.text()).equal(value);
            });
    });
};

export const createEditMultiOperatorGroups = (): void => {
    const multiOperatorGroup1 = 'MultiOperator Group 1';
    const multiOperatorGroup2 = 'MultiOperator Group 2';

    addSingleMultiOperatorGroup(multiOperatorGroup1, false, true);

    // Click on edit and back button
    getElementByClass('card').eq(0).contains('Edit').click();
    clickElementByText('Back');

    //need to change this
    const valuesToCompareFirst = ['Preston Bus - PBLT', 'The Blackburn Bus Company - LNUD'];
    const firstCard = getElementByClass('card').eq(0);
    firstCard.should('contain.text', multiOperatorGroup1);
    checkCardBody(firstCard, 0, valuesToCompareFirst);
    getElementByClass('card').eq(0).contains('Edit').click();
    clickElementById('search-input').clear().type('Pil');
    clickElementById('search-button');
    clickElementByText('Pilkingtonbus - NWBT');
    continueButtonClick();
    valuesToCompareFirst.push('Pilkingtonbus - NWBT');
    checkCardBody(firstCard, 0, valuesToCompareFirst);

    const valuesToCompareSecond = [
        'Preston Bus - PBLT', 
        'The Blackburn Bus Company - LNUD',
        'Pilkingtonbus - NWBT',
    ];
    addSingleMultiOperatorGroup(multiOperatorGroup2, true, true);
    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('contain.text', multiOperatorGroup2);
    checkCardBody(secondCard, 1, valuesToCompareSecond);
    getElementByClass('card').eq(1).contains('Edit').click();
    clickElementById('remove-0');
    continueButtonClick();
    valuesToCompareSecond.shift();
    checkCardBody(secondCard, 1, valuesToCompareSecond);
};
