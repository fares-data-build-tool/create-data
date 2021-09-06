import {
    clickElementById,
    clickElementByText,
    getRandomNumber,
    getHomePage,
    throwInvalidRandomSelectorError,
} from './helpers';
import { enterPassengerTypeDetails, addGroupPassengerType } from './passengerTypes';
import { addPurchaseMethod } from './purchaseMethods';
import { addTimeRestriction } from './timeRestrictions';

before(() => {
    cy.log('index.ts was run');
    getHomePage();
    clickElementById('account-link');
    clickElementByText('Passenger types');
    randomlyAddPassengerTypes();
    clickElementByText('Purchase methods');
    randomlyAddPurchaseMethods();
    clickElementByText('Time restrictions');
    randomlyAddTimeRestrictions();
    cy.log('Global Settings set up for BLAC');

    getHomePage('scheme');
    clickElementById('account-link');
    clickElementByText('Passenger types');
    randomlyAddPassengerTypes();
    clickElementByText('Purchase methods');
    randomlyAddPurchaseMethods();
    clickElementByText('Time restrictions');
    randomlyAddTimeRestrictions();
    cy.log('Global Settings set up for scheme');
});

const randomlyAddPassengerTypes = (): void => {
    cy.get(`[data-card-count]`).then((element) => {
        const numberOfPassengers = Number(element.attr('data-card-count'));
        cy.log(`There are ${numberOfPassengers} individuals/groups`);
        if (numberOfPassengers > 1) {
            cy.log('There is at least two passenger types');
        } else {
            const passengerType1 = {
                type: 'child',
                maxAge: 18,
                name: 'Small People',
            };
            const passengerType2 = {
                type: 'student',
                documents: ['student_card'],
                name: 'Test Students',
            };
            const passengerType3 = {
                type: 'adult',
                name: 'Big People',
            };
            const randomSelector = getRandomNumber(1, 2);
            switch (randomSelector) {
                case 1:
                    cy.log('Add two Individuals, one Group');
                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType1);
                    clickElementByText('Add passenger type');

                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType2);
                    clickElementByText('Add passenger type');
                    addGroupPassengerType('Test Group');
                    break;
                case 2:
                    cy.log('Add three Individuals, one Groups');
                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType1);
                    clickElementByText('Add passenger type');

                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType2);
                    clickElementByText('Add passenger type');

                    clickElementByText('Add a passenger type');
                    enterPassengerTypeDetails(passengerType3);
                    clickElementByText('Add passenger type');
                    addGroupPassengerType('Test Group');
                    break;
                default:
                    throwInvalidRandomSelectorError();
            }
        }
    });
};

const randomlyAddPurchaseMethods = (): void => {
    cy.get(`[data-card-count]`).then((element) => {
        const numberOfPurchaseMethods = Number(element.attr('data-card-count'));
        cy.log(`There are ${numberOfPurchaseMethods} purchase methods`);
        if (numberOfPurchaseMethods > 0) {
            cy.log('There is at least one purchase method');
        } else {
            const purchaseMethod1 = {
                purchaseLocations: ['checkbox-0-on-board'],
                paymentMethods: ['checkbox-0-cash', 'checkbox-1-debit-card'],
                ticketFormats: ['checkbox-3-electronic-document'],
                name: 'Test Onboard',
            };
            const purchaseMethod2 = {
                purchaseLocations: ['checkbox-2-mobile-device'],
                paymentMethods: ['checkbox-0-cash', 'checkbox-1-debit-card'],
                ticketFormats: ['checkbox-3-electronic-document'],
                name: 'Test Mobile',
            };
            const purchaseMethod3 = {
                purchaseLocations: ['checkbox-1-online'],
                paymentMethods: ['checkbox-1-debit-card'],
                ticketFormats: ['checkbox-3-electronic-document'],
                name: 'Test Online',
            };
            const randomSelector = getRandomNumber(1, 3);
            switch (randomSelector) {
                case 1:
                    cy.log('Add one purchase method');
                    addPurchaseMethod(purchaseMethod1);

                    break;
                case 2:
                    cy.log('Add two purchase methods');
                    addPurchaseMethod(purchaseMethod1);
                    addPurchaseMethod(purchaseMethod2);
                    break;
                case 3:
                    cy.log('Add three purchase methods');
                    addPurchaseMethod(purchaseMethod1);
                    addPurchaseMethod(purchaseMethod2);
                    addPurchaseMethod(purchaseMethod3);
                    break;
                default:
                    throwInvalidRandomSelectorError();
            }
        }
    });
};

const randomlyAddTimeRestrictions = (): void => {
    cy.get(`[data-card-count]`).then((element) => {
        const numberOfTimeRestrictions = Number(element.attr('data-card-count'));
        cy.log(`There are ${numberOfTimeRestrictions} time restrictions`);
        if (numberOfTimeRestrictions > 0) {
            cy.log('There is at least one time restriction');
        } else {
            const timeRestriction1 = {
                days: [
                    'time-restriction-day-0',
                    'time-restriction-day-1',
                    'time-restriction-day-2',
                    'time-restriction-day-3',
                    'time-restriction-day-4',
                ],
                name: 'Test Weekdays',
            };
            const timeRestriction2 = {
                days: ['time-restriction-day-5', 'time-restriction-day-6'],
                name: 'Test Weekends',
            };
            const timeRestriction3 = {
                days: ['time-restriction-day-6', 'time-restriction-day-7'],
                name: 'Test Bank Holidays',
            };
            const randomSelector = getRandomNumber(1, 3);
            switch (randomSelector) {
                case 1:
                    cy.log('Add one time restriction');
                    addTimeRestriction(timeRestriction1);

                    break;
                case 2:
                    cy.log('Add two time restrictions');
                    addTimeRestriction(timeRestriction1);
                    addTimeRestriction(timeRestriction2);
                    break;
                case 3:
                    cy.log('Add three time restrictions');
                    addTimeRestriction(timeRestriction1);
                    addTimeRestriction(timeRestriction2);
                    addTimeRestriction(timeRestriction3);
                    break;
                default:
                    throwInvalidRandomSelectorError();
            }
        }
    });
};
