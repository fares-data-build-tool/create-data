import { clickElementById, clickElementByText, getRandomNumber, getElementById, getHomePage } from './helpers';
import { enterPassengerTypeDetails, addGroupPassengerType } from './passengerTypes';

before(() => {
    cy.log('index.js was run');
    getHomePage();
    clickElementById('account-link');
    clickElementByText('Passenger types');
    cy.get(`[data-card-count]`).then((element) => {
        const numberOfPassengers = Number(element.attr('data-card-count'));
        cy.log('There are ' + numberOfPassengers + ' individuals/groups');
        if (numberOfPassengers > 1) {
            cy.log('There is at least one passenger type');
        } else {
            const passengerType1 = {
                type: 'child',
                maxAge: 18,
                name: 'Small People',
            };
            const passengerType2 = {
                type: 'student',
                documents: 'student_card',
                name: 'Adults',
            };
            const randomSelector = getRandomNumber(1, 3);
            switch (randomSelector) {
                case 1:
                    cy.log('Add one Individual, one Group');
                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType1);
                    addGroupPassengerType();
                    break;
                case 2:
                    cy.log('Min age, no max age');
                    getElementById('age-range-min').type('12');
                    break;
                case 3:
                    cy.log('Max and min age, diff values');
                    getElementById('age-range-min').type('13');
                    getElementById('age-range-max').type('18');
                    break;
                case 4:
                    cy.log('Max and min age, same values');
                    getElementById('age-range-min').type('50');
                    getElementById('age-range-max').type('50');
                    break;
                default:
                    throwInvalidRandomSelectorError();
            }
        }
    });
});

// getHomePage(isScheme ? 'scheme'
