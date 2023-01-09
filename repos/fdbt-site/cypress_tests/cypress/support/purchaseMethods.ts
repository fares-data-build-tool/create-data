import {
    clickElementById,
    clickElementByText,
    getElementByClass,
    getElementByDataTestId,
    getElementByName,
} from './helpers';

interface PurchaseMethod {
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
    name: string;
}

const enterPurchaseMethodDetails = ({ purchaseLocations, paymentMethods, ticketFormats, name }: PurchaseMethod) => {
    purchaseLocations.map(clickElementById);
    paymentMethods.map(clickElementById);
    ticketFormats.map(clickElementById);

    getElementByName('name').clear().type(name);
};

export const addPurchaseMethod = (purchaseMethod: PurchaseMethod) => {
    clickElementByText('Add a purchase method');
    enterPurchaseMethodDetails(purchaseMethod);
    clickElementByText('Add purchase method');
};

export const createEditPurchaseMethod = (): void => {
    const purchaseMethod = {
        purchaseLocations: ['checkbox-0-on-board'],
        paymentMethods: ['checkbox-0-cash', 'checkbox-1-debit-card'],
        ticketFormats: ['checkbox-3-electronic-document'],
        name: 'Onboard',
    };

    addPurchaseMethod(purchaseMethod);

    // Click on edit and back button
    getElementByClass('card').eq(0).contains('Edit').click();
    clickElementByText("Back");    

    const purchaseMethodCard = getElementByClass('card').eq(0);
    purchaseMethodCard.should('include.text', purchaseMethod.name);
    purchaseMethodCard.should('include.text', 'Purchase locations: On board');
    purchaseMethodCard.should('include.text', 'Payment methods: Cash, Debit card');
    purchaseMethodCard.should('include.text', 'Ticket formats: Digital');

    purchaseMethodCard.contains('Edit').click();

    const editedPurchaseMethod = {
        purchaseLocations: ['checkbox-0-on-board', 'checkbox-1-online'],
        paymentMethods: ['checkbox-2-credit-card'],
        ticketFormats: ['checkbox-0-paper-ticket'],
        name: 'Online',
    };

    enterPurchaseMethodDetails(editedPurchaseMethod);

    cy.contains('Update purchase method').click();

    const editedCard = getElementByClass('card').eq(0);
    editedCard.should('include.text', editedPurchaseMethod.name);
    editedCard.should('include.text', 'Purchase locations: Online');
    editedCard.should('include.text', 'Payment methods: Cash, Debit card, Credit card');
    editedCard.should('include.text', 'Ticket formats: Paper ticket, Digital');
};
