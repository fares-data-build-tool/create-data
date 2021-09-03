import {
    clickElementById,
    clickElementByText,
    getRandomNumber,
    getElementById,
    getHomePage,
    throwInvalidRandomSelectorError,
} from './helpers';
import { enterPassengerTypeDetails, addGroupPassengerType } from './passengerTypes';

before(() => {
    cy.log('index.ts was run');
    getHomePage();
    clickElementById('account-link');
    clickElementByText('Passenger types');
    randomlyAddPassengerTypes();
});

const randomlyAddPassengerTypes = (): void => {
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
                documents: ['student_card'],
                name: 'Students',
            };
            const passengerType3 = {
                type: 'adult',
                name: 'Big People',
            };
            const randomSelector = getRandomNumber(1, 3);
            switch (randomSelector) {
                case 1:
                    cy.log('Add one Individual, one Group');
                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType1);
                    clickElementByText('Add a passenger type');
                    addGroupPassengerType();
                    break;
                case 2:
                    cy.log('Add two Individuals, one Group');
                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType1);
                    clickElementByText('Add passenger type');

                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType2);
                    clickElementByText('Add passenger type');
                    addGroupPassengerType();
                    break;
                case 3:
                    cy.log('Add three Individuals, no Groups');
                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType1);
                    clickElementByText('Add passenger type');

                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType2);
                    clickElementByText('Add passenger type');

                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType3);
                    clickElementByText('Add passenger type');
                    break;
                default:
                    throwInvalidRandomSelectorError();
            }
        }
    });
};

// getHomePage(isScheme ? 'scheme'
