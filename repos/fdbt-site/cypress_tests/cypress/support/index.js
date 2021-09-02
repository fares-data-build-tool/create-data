import { clickElementById, getElementByClass, getElementById, getHomePage } from './helpers';

before(() => {
    cy.log('index.js was run');
    getHomePage();
    clickElementById('account-link');
    cy.contains('Passenger types').click();
    cy.get(`[data-card-count]`).then((element) => {
        const numberOfPassengers = Number(element.attr('data-card-count'));
        cy.log('There are ' + numberOfPassengers + ' individuals/groups');
        if (numberOfPassengers > 0) {
            cy.log('more than 1 passenger type');
        } else {
            cy.log('less than one passenger');
            // Add 1-3 passengers and a group
        }
    });
});

// getHomePage(isScheme ? 'scheme'
