export const throwInvalidRandomSelectorError = (): void => {
    throw new Error('Invalid random selector');
};

export const getElementById = (id: string): Cypress.Chainable<JQuery<HTMLElement>> => cy.get(`[id=${id}]`);

export const clickElementById = (id: string): Cypress.Chainable<JQuery<HTMLElement>> => getElementById(id).click();

export const getRandomNumber = (min: number, max: number): number => Cypress._.random(min, max);

export const getHomePage = (): void => {
    cy.clearCookies();
    cy.visit('?disableAuth=true');
};

export const startPageButtonClick = (): Cypress.Chainable<JQuery<HTMLElement>> => clickElementById('start-now-button');

export const continueButtonClick = (): Cypress.Chainable<JQuery<HTMLElement>> => clickElementById('continue-button');

export const assertElementNotVisibleById = (id: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    getElementById(id).should('not.be.visible');

export const completeGroupSizePage = (): string => {
    const groupSize = getRandomNumber(1, 30).toString();
    getElementById('max-group-size').type(groupSize);
    continueButtonClick();
    return groupSize;
};

export const completeDefineGroupPassengersPage = (): string[] => {
    const firstPassengerType = `passenger-type-${getRandomNumber(0, 6)}`;
    clickElementById(firstPassengerType);

    let secondPassengerType = `passenger-type-${getRandomNumber(0, 6)}`;
    while (firstPassengerType === secondPassengerType) {
        secondPassengerType = `passenger-type-${getRandomNumber(0, 6)}`;
    }
    clickElementById(secondPassengerType);

    continueButtonClick();
    return [firstPassengerType, secondPassengerType];
};

export const randomlyChooseAProof = (): void => {
    const randomSelector = getRandomNumber(1, 3);
    switch (randomSelector) {
        case 1:
            cy.log('Membership card');
            clickElementById('membership-card');
            break;
        case 2:
            cy.log('Student card');
            clickElementById('student-card');
            break;
        case 3:
            cy.log('Identity Document');
            clickElementById('identity-document');
            break;
        default:
            throwInvalidRandomSelectorError();
    }
};

export const randomlyChooseAgeLimits = (): void => {
    const randomSelector = getRandomNumber(1, 4);
    switch (randomSelector) {
        case 1:
            cy.log('Max age, no min age');
            getElementById('age-range-max').type('30');
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
};

export const completeUserDetailsPage = (group: boolean, maxGroupNumber: string, adult: boolean): void => {
    assertElementNotVisibleById('age-range-required-conditional');

    const firstRandomSelector = getRandomNumber(1, 4);
    const secondRandomSelector = getRandomNumber(1, 2);

    if (group) {
        getElementById('min-number-of-passengers').type('1');
        getElementById('max-number-of-passengers').type(maxGroupNumber);
    }
    if (!adult) {
        switch (firstRandomSelector) {
            case 1:
                cy.log('No to both questions');
                clickElementById('age-range-not-required');
                clickElementById('proof-not-required');
                continueButtonClick();
                break;
            case 2:
                cy.log('No to age limit, Yes to Proof');
                clickElementById('age-range-not-required');
                clickElementById('proof-required');
                randomlyChooseAProof();
                continueButtonClick();
                break;
            case 3:
                cy.log('Yes to age limit, Yes to Proof');
                clickElementById('age-range-required');
                randomlyChooseAgeLimits();
                clickElementById('proof-required');
                randomlyChooseAProof();
                continueButtonClick();
                break;
            case 4:
                cy.log('Yes to age limit, No to Proof');
                clickElementById('age-range-required');
                randomlyChooseAgeLimits();
                clickElementById('proof-not-required');
                continueButtonClick();
                break;
            default:
                throwInvalidRandomSelectorError();
        }
    } else {
        switch (secondRandomSelector) {
            case 1:
                cy.log('No to age range');
                clickElementById('age-range-not-required');
                continueButtonClick();
                break;
            case 2:
                cy.log('Yes to age range');
                clickElementById('age-range-required');
                randomlyChooseAgeLimits();
                continueButtonClick();
                break;
            default:
                throwInvalidRandomSelectorError();
        }
    }
};

export const completeGroupPassengerDetailsPages = (): void => {
    const groupSize = completeGroupSizePage();
    const passengerTypes = completeDefineGroupPassengersPage();
    const sortedPassengerTypes = passengerTypes.sort();

    for (let i = 0; i < 2; i += 1) {
        if (sortedPassengerTypes[i] === 'passenger-type-0') {
            completeUserDetailsPage(true, groupSize, true);
        } else {
            completeUserDetailsPage(true, groupSize, false);
        }
    }
};

export const randomlyDetermineUserType = (): void => {
    const randomSelector = getRandomNumber(1, 4);

    switch (randomSelector) {
        case 1: {
            cy.log('Click Any and continue');
            clickElementById('passenger-type-anyone');
            continueButtonClick();
            break;
        }
        case 2: {
            cy.log('Click Group, complete following pages, and continue');
            clickElementById('passenger-type-group');
            continueButtonClick();
            completeGroupPassengerDetailsPages();
            break;
        }
        case 3: {
            cy.log('Click Adult, complete following pages, and continue');
            clickElementById('passenger-type-adult');
            continueButtonClick();
            completeUserDetailsPage(false, '0', true);
            break;
        }
        case 4: {
            cy.log('Click a non-Any non-Group, complete the next page, and continue');
            const otherPassengerTypes = ['child', 'infant', 'senior', 'student', 'youngPerson'];
            const randomPassengerType = otherPassengerTypes[getRandomNumber(0, 4)];
            clickElementById(`passenger-type-${randomPassengerType}`);
            continueButtonClick();
            completeUserDetailsPage(false, '0', false);
            break;
        }
        default: {
            throwInvalidRandomSelectorError();
        }
    }
};

export const selectYesToTimeRestrictions = (): void => {
    assertElementNotVisibleById('valid-days-required-conditional');

    clickElementById('valid-days-required');
    const checkboxIds = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'bankHoliday'];
    const randomNumber = getRandomNumber(1, 8);
    for (let i = 0; i < randomNumber; i += 1) {
        clickElementById(checkboxIds[i]);
    }
    continueButtonClick();
};

export const randomlyDecideTimeRestrictions = (): void => {
    if (getRandomNumber(0, 1) === 0) {
        clickElementById('valid-days-not-required');
    } else {
        selectYesToTimeRestrictions();

        const startTimes = ['0000', '0459', '0900'];
        cy.get('[id^=start-time-]').each(input => {
            cy.wrap(input).type(startTimes[getRandomNumber(0, 2)]);
        });

        const endTimes = ['1420', '1750', '2359'];
        cy.get('[id^=end-time-]').each(input => {
            cy.wrap(input).type(endTimes[getRandomNumber(0, 2)]);
        });
    }
    continueButtonClick();
};

export const clickSelectedNumberOfCheckboxes = (clickAll: boolean): void => {
    cy.get('[class=govuk-checkboxes__input]').each((checkbox, index) => {
        if (clickAll || index === 0) {
            cy.wrap(checkbox).click();
        } else {
            const randomSelector = getRandomNumber(0, 1);
            if (randomSelector === 0) {
                cy.wrap(checkbox).click();
            }
        }
    });
};

export const randomlyChooseAndSelectServices = (): void => {
    const randomSelector = getRandomNumber(1, 5);
    switch (randomSelector) {
        case 1: {
            cy.log('Click Select All button and continue');
            clickElementById('select-all-button');
            break;
        }
        case 2: {
            cy.log('Loop through checkboxes and click all, then continue');
            clickSelectedNumberOfCheckboxes(true);
            break;
        }
        case 3: {
            cy.log('Loop through checkboxes and click random ones, then continue');
            clickSelectedNumberOfCheckboxes(false);
            break;
        }
        case 4: {
            cy.log('Click Select All button and then click random checkboxes to deselect, then continue');
            clickElementById('select-all-button');
            clickSelectedNumberOfCheckboxes(false);
            break;
        }
        case 5: {
            cy.log('Loop through checkboxes and click all and then click random checkboxes to deselect, then continue');
            clickSelectedNumberOfCheckboxes(true);
            clickSelectedNumberOfCheckboxes(false);
            break;
        }
        default: {
            throwInvalidRandomSelectorError();
        }
    }
};

export const completeProductDateInformationPage = (): void => {
    assertElementNotVisibleById('product-dates-required-conditional');

    if (getRandomNumber(0, 1) === 0) {
        clickElementById('product-dates-information-not-required');
    } else {
        clickElementById('product-dates-required');
        const randomSelector = getRandomNumber(1, 3);
        switch (randomSelector) {
            case 1: {
                getElementById('start-date-day').type('13');
                getElementById('start-date-month').type('10');
                getElementById('start-date-year').type('2010');
                break;
            }
            case 2: {
                getElementById('start-date-day').type('13');
                getElementById('start-date-month').type('10');
                getElementById('start-date-year').type('2010');
                getElementById('end-date-day').type('7');
                getElementById('end-date-month').type('12');
                getElementById('end-date-year').type('2025');
                break;
            }
            case 3: {
                getElementById('end-date-day').type('4');
                getElementById('end-date-month').type('4');
                getElementById('end-date-year').type('2030');
                break;
            }
            default: {
                throwInvalidRandomSelectorError();
            }
        }
    }
    continueButtonClick();
};

export const isUuidStringValid = (): void => {
    getElementById('uuid-ref-number')
        .invoke('text')
        .then(rawUuid => {
            const uuid = rawUuid.replace('Your reference number', '');
            expect(uuid).to.contain('BLAC');
            expect(uuid.length).to.equal(12);
        });
};
