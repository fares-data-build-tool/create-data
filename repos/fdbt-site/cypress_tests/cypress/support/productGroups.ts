import { clickElementById, clickElementByText, continueButtonClick, getElementByClass, getElementById } from './helpers';

export const addSingleProductGroup = (name: string, selectAll: boolean): void => {
    clickElementByText('Add a product group');
    clickElementById('open-all-services');
    if (selectAll) {
        clickElementById('select-all');
    } else {
        clickElementById('product-1');
    }
    getElementById('product-group-name').clear().type(name);
    continueButtonClick();
};

export const createEditProductGroups = () => {
    const productGroup1 = 'Product Group 1';
    const productGroup2 = 'Product Group 2';

    addSingleProductGroup(productGroup1, false);

    const firstCard = getElementByClass('card').eq(0);
    firstCard.should('contain.text', productGroup1);
    firstCard.should('contain.text', '1 product');
    
    getElementByClass('card').eq(0).contains('Edit').click();
    clickElementById('product-group-name').clear().type('Another product group');
    clickElementById('select-all');
    continueButtonClick();
    
    getElementByClass('card').eq(0).should('contain.text', 'Another product group');

    addSingleProductGroup(productGroup2, true);
    const secondCard = getElementByClass('card').eq(1);
    secondCard.should('contain.text', productGroup2);

};

