import { addOtherProductsIfNotPresent, addSingleProductIfNotPresent, clickElementById, clickElementByText, getElementById, getHomePage } from './helpers';
import { addSingleMultiOperatorGroup } from './multiOperatorGroups';
import { enterPassengerTypeDetails, addGroupPassengerType } from './passengerTypes';
import { addSingleProductGroup } from './productGroups';
import { addPurchaseMethod } from './purchaseMethods';
import { addTimeRestriction } from './timeRestrictions';

before(() => {
    cy.log('index.ts was run');
    getHomePage();
    clickElementById('account-link');
    clickElementByText('Passenger types');
    addTestPassengerTypes();
    clickElementByText('Purchase methods');
    addTestPurchaseMethods();
    clickElementByText('Time restrictions');
    addTestTimeRestrictions();
    clickElementByText('Fare day end');
    addTestFareDayEnd();
    clickElementByText('Operator groups');
    addTestOperatorGroups();

    addSingleProductIfNotPresent();
    addOtherProductsIfNotPresent();
    getHomePage();
    clickElementById('account-link');
    clickElementByText('Product groups');
    addTestProductGroups();
    cy.log('Global Settings set up for LNUD');

    // Disabling the below, as schemes are currently not fully supported
    /*
    getHomePage('scheme');
    clickElementById('account-link');
    clickElementByText('Passenger types');
    addTestPassengerTypes();
    clickElementByText('Purchase methods');
    addTestPurchaseMethods();
    clickElementByText('Time restrictions');
    addTestTimeRestrictions();
    clickElementByText('Fare day end');
    addTestFareDayEnd();
    clickElementByText('Operator details');
    addTestOperatorDetails();
    */
    cy.log('Global Settings set up for scheme');
});

const addTestOperatorDetails = (): void => {
    clickElementById('operatorName').clear().type('Easy A to B');
    clickElementById('contactNumber').clear().type('01492 451 652');
    clickElementById('email').clear().type('info@easyab.co.uk');
    clickElementById('url').clear().type('www.easyab.co.uk');
    clickElementById('street').clear().type('123 Some Road');
    clickElementById('town').clear().type('Awesomeville');
    clickElementById('county').clear().type('Home County');
    clickElementById('postcode').clear().type('AW23 8LE');
    clickElementByText('Save');
};

const addTestOperatorGroups = (): void => {
    cy.get(`[data-card-count]`).then((element) => {
        const numberofOperatorGroups = Number(element.attr('data-card-count'));
        cy.log(`There are ${numberofOperatorGroups} operator groups`);
        cy.get(`[operator-groups]`).then((element) => {
            const operatorGroups = element.attr('operator-groups').toString();
            const operatorGroupsValue = operatorGroups.split(',')
            if (!operatorGroupsValue.includes('test')) {
                addSingleMultiOperatorGroup('test', false, true);
            }
            if (!operatorGroupsValue.includes('test2')) {
                addSingleMultiOperatorGroup('test2', false, false);
            }
        });
    });
};

const addTestProductGroups = (): void => {
    
    cy.get(`[data-card-count]`).then((element) => {
        const numberofProductGroups = Number(element.attr('data-card-count'));
        cy.log(`There are ${numberofProductGroups} product groups`);
        cy.get(`[product-groups]`).then((element) => {
            const productGroups = element.attr('product-groups').toString();
            
            const productGroupsValue = productGroups.split(',')
            if (!productGroupsValue.includes('test')) {
                addSingleProductGroup('test', false);
            }
            if (!productGroupsValue.includes('test2')) {                                
                addSingleProductGroup('test2', true);                
            }
        });
    });
};

const addTestFareDayEnd = (): void => {
    clickElementById('fare-day-end-input').clear().type('2323');
    clickElementByText('Save');
    clickElementByText('Ok');
};

const addTestPassengerTypes = (): void => {
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
        }
    });
};

const addTestPurchaseMethods = (): void => {
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
            cy.log('Add three purchase methods');
            addPurchaseMethod(purchaseMethod1);
            addPurchaseMethod(purchaseMethod2);
            addPurchaseMethod(purchaseMethod3);
        }
    });
};

export const addTestTimeRestrictions = (): void => {
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
            cy.log('Add three time restrictions');
            addTimeRestriction(timeRestriction1);
            addTimeRestriction(timeRestriction2);
            addTimeRestriction(timeRestriction3);
        }
    });
};