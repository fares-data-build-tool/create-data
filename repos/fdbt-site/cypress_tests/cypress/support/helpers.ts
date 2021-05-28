// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';

export const throwInvalidRandomSelectorError = (): void => {
    throw new Error('Invalid random selector');
};

export const getElementById = (id: string): Cypress.Chainable<JQuery<HTMLElement>> => cy.get(`[id=${id}]`);

export const clickElementById = (id: string): Cypress.Chainable<JQuery<HTMLElement>> => getElementById(id).click();

export const getRandomNumber = (min: number, max: number): number => Cypress._.random(min, max);

export const getHomePage = (isScheme: boolean): void => {
    cy.clearCookies();
    cy.visit(`?disableAuth=${isScheme ? 'scheme' : 'BLAC'}`);
};

export const fareTypeToFareTypeIdMapper = (
    fareType: 'single' | 'period' | 'return' | 'flatFare' | 'multiOperator' | 'schoolService',
): string => `fare-type-${fareType}`;

export const startPageLinkClick = (): Cypress.Chainable<JQuery<HTMLElement>> => clickElementById('faretype-link');

export const continueButtonClick = (): Cypress.Chainable<JQuery<HTMLElement>> => clickElementById('continue-button');

export const submitButtonClick = (): Cypress.Chainable<JQuery<HTMLElement>> => clickElementById('submit-button');

export const assertElementNotVisibleById = (id: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    getElementById(id).should('not.be.visible');

export const completeGroupSizePage = (): string => {
    const groupSize = getRandomNumber(1, 30).toString();
    getElementById('max-group-size').type(groupSize);
    continueButtonClick();
    return groupSize;
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

export const completeUserDetailsPage = (group: boolean, maxGroupNumber: string, passengerType: string): void => {
    // Once we leave the passenger types page,
    // check if we have skipped the defining passenger types page due to a saved config
    cy.url()
        .should('not.match', /\/passengerType/) // This is bassicly a wait to ensure we're on the correct page
        .then((url: string) => {
            if (!url.includes('definePassengerType')) {
                cy.log(`Skipped defining passenger types as probably reusing a saved one ${url}`);
                return;
            }

            if (group) {
                getElementById('min-number-of-passengers').type('1');
                getElementById('max-number-of-passengers').type(maxGroupNumber);
                if (passengerType === 'anyone') {
                    continueButtonClick();
                    return;
                }
            }

            assertElementNotVisibleById('age-range-required-conditional');

            const firstRandomSelector = getRandomNumber(1, 2);
            const secondRandomSelector = getRandomNumber(1, 4);

            if (passengerType === 'adult') {
                switch (firstRandomSelector) {
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
            } else {
                switch (secondRandomSelector) {
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
            }
        });
};

export const completeDefineGroupPassengersPages = (groupSize: string): void => {
    const firstPassengerTypeId = `passenger-type-${getRandomNumber(0, 6)}`;
    clickElementById(firstPassengerTypeId);

    let secondPassengerTypeId = `passenger-type-${getRandomNumber(0, 6)}`;
    while (firstPassengerTypeId === secondPassengerTypeId) {
        secondPassengerTypeId = `passenger-type-${getRandomNumber(0, 6)}`;
    }
    clickElementById(secondPassengerTypeId);

    const sortedPassengerTypeIds = [firstPassengerTypeId, secondPassengerTypeId].sort();
    const sortedPassengerTypes: string[] = [];

    getElementById(sortedPassengerTypeIds[0]).then($elm0 => {
        sortedPassengerTypes.push($elm0.attr('value'));
        getElementById(sortedPassengerTypeIds[1]).then($elm1 => {
            sortedPassengerTypes.push($elm1.attr('value'));
            continueButtonClick();
            sortedPassengerTypes.forEach(passengerType => {
                completeUserDetailsPage(true, groupSize, passengerType);
            });
        });
    });
};

export const randomlyChooseSingleProductPeriodValidity = (): void => {
    assertElementNotVisibleById('period-validity-end-of-service-required-conditional');

    const randomSelector = getRandomNumber(1, 3);
    switch (randomSelector) {
        case 1:
            cy.log('End of calendar day');
            clickElementById('period-end-calendar');
            break;
        case 2:
            cy.log('End of 24hr period');
            clickElementById('period-twenty-four-hours');
            break;
        case 3:
            cy.log('End of service day');
            clickElementById('period-end-of-service');
            getElementById('product-end-time').type('2100');
            break;
        default:
            throwInvalidRandomSelectorError();
    }
};

export const selectOptionFromDropDownByIndex = (dropDownId: string, index: number): void => {
    cy.get(`[id=${dropDownId}]`)
        .find('option')
        .then($elm => {
            $elm.get(index).setAttribute('selected', 'selected');
        })
        .parent()
        .trigger('change');
};

export const randomlyChooseMultipleProductPeriodValidity = (numberOfProducts: number): void => {
    for (let i = 0; i < numberOfProducts; i += 1) {
        const randomSelector = getRandomNumber(1, 3);
        selectOptionFromDropDownByIndex(`validity-option-${i}`, randomSelector);
        if (randomSelector === 3) {
            getElementById(`validity-end-time-${i}`).type('1900');
        }
    }
};

export const selectRandomOptionFromDropDown = (dropDownId: string): void => {
    cy.get(`[id=${dropDownId}]`)
        .find('option')
        .then($elm => {
            const numberOfOptions = $elm.length;
            const randomSelector = getRandomNumber(1, numberOfOptions - 1);
            $elm.get(randomSelector).setAttribute('selected', 'selected');
        })
        .parent()
        .trigger('change');
};

export const completeGroupPassengerDetailsPages = (): void => {
    const groupSize = completeGroupSizePage();
    completeDefineGroupPassengersPages(groupSize);
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
            completeUserDetailsPage(false, '0', 'adult');
            break;
        }
        case 4: {
            cy.log('Click a non-Any non-Group, complete the next page, and continue');
            const otherPassengerTypes = ['child', 'infant', 'senior', 'student', 'youngPerson'];
            const randomPassengerType = otherPassengerTypes[getRandomNumber(0, 4)];
            clickElementById(`passenger-type-${randomPassengerType}`);
            continueButtonClick();
            completeUserDetailsPage(false, '0', randomPassengerType);
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

export const clickAllCheckboxes = (): void => {
    cy.get('[class=govuk-checkboxes__input]').each(checkbox => {
        cy.wrap(checkbox).click();
    });
};

export const clickSomeCheckboxes = (): void => {
    cy.get('[class=govuk-checkboxes__input]').each((checkbox, index, checkboxes) => {
        const numberOfCheckboxes = checkboxes.length;
        if (numberOfCheckboxes === 1 || index !== numberOfCheckboxes - 1) {
            cy.wrap(checkbox).click();
        }
    });
};

export const clickFirstCheckboxIfMultiple = (): void => {
    cy.get('[class=govuk-checkboxes__input]').each((checkbox, index, checkboxes) => {
        if (checkboxes.length > 1 && index === 0) {
            cy.wrap(checkbox).click();
        }
    });
};

export const completeSalesOfferPackagesForMultipleProducts = (
    numberOfProducts: number,
    multiProductNamePrefix: string,
): void => {
    for (let i = 0; i < numberOfProducts; i += 1) {
        const randomSalesOfferPackageIndex = getRandomNumber(0, 3);
        getElementById(
            `${multiProductNamePrefix.replace(' ', '').trim()}${i + 1}-checkbox-${randomSalesOfferPackageIndex}`,
        ).click();
        if (getRandomNumber(0, 1) === 1) {
            getElementById(
                `${multiProductNamePrefix.replace(' ', '').trim()}${i + 1}-checkbox-${
                    randomSalesOfferPackageIndex === 3
                        ? randomSalesOfferPackageIndex - 1
                        : randomSalesOfferPackageIndex + 1
                }`,
            ).click();
        }
    }
};

export const randomlyChooseAndSelectServices = (): void => {
    const randomSelector = getRandomNumber(1, 4);
    switch (randomSelector) {
        case 1: {
            cy.log('Click Select All button and continue');
            clickElementById('select-all-button');
            break;
        }
        case 2: {
            cy.log('Loop through checkboxes and click all, then continue');
            clickAllCheckboxes();
            break;
        }
        case 3: {
            cy.log('Loop through checkboxes and click random ones, then continue');
            clickSomeCheckboxes();
            break;
        }
        case 4: {
            cy.log('Click Select All button and then click first checkbox to deselect, then continue');
            clickElementById('select-all-button');
            clickFirstCheckboxIfMultiple();
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

export const isUuidStringValid = (isScheme = false): void => {
    getElementById('uuid-ref-number')
        .invoke('text')
        .then(rawUuid => {
            const uuid = rawUuid.replace('Your reference number', '');

            if (isScheme) {
                expect(uuid).to.contain('TESTSE');
                expect(uuid.length).to.equal(14);
            } else {
                expect(uuid).to.contain('BLAC');
                expect(uuid.length).to.equal(12);
            }
        });
};

export const uploadFile = (elementId: string, fileName: string): void => {
    getElementById(elementId).attachFile(fileName);
};

export const completeSingleProduct = (): void => {
    getElementById('number-of-products').type('1');
    continueButtonClick();
    getElementById('product-details-name').type('Cypress period product');
    getElementById('product-details-price').type('4.95');
    continueButtonClick();
    getElementById('validity').type('10');
    selectRandomOptionFromDropDown('validity-units');
    continueButtonClick();
    randomlyChooseSingleProductPeriodValidity();
    continueButtonClick();
    continueButtonClick();
};

export const completeMultipleProducts = (numberOfProducts?: number, multiProductNamePrefix?: string): void => {
    getElementById('number-of-products').type(numberOfProducts.toString());
    continueButtonClick();

    for (let i = 0; i < numberOfProducts; i += 1) {
        getElementById(`multiple-product-name-${i}`).type(`${multiProductNamePrefix}${i + 1}`);
        getElementById(`multiple-product-price-${i}`).type(`1${i}`);
        getElementById(`multiple-product-duration-${i}`).type(`2${i}`);
        selectRandomOptionFromDropDown(`multiple-product-duration-units-${i}`);
    }

    continueButtonClick();
    randomlyChooseMultipleProductPeriodValidity(numberOfProducts);
    continueButtonClick();
    continueButtonClick();
};

export const completeOperatorSearch = (isMultiService: boolean): void => {
    cy.url()
        .should('match', /\/[searchOperators|reuseOperatorGroup]/) // This is bassicly a wait to ensure we're on the correct page
        .then((url: string) => {
            if (url.includes('reuseOperatorGroup')) {
                clickElementById('reuse-operator-group-no');
                continueButtonClick();
            }
            getElementById(`search-input`).type('bus');
            clickElementById('search-button');

            getElementById('add-operator-checkbox-0').click();
            getElementById('add-operator-checkbox-1').click();
            getElementById('add-operator-checkbox-2').click();
            getElementById('add-operator-checkbox-3').click();

            clickElementById('add-operator-button');

            getElementById('remove-operator-checkbox-3').click();
            clickElementById('remove-operators-button');
            continueButtonClick();

            clickElementById('no-save');
            continueButtonClick();

            if (isMultiService) {
                for (let i = 0; i < 3; i += 1) {
                    randomlyChooseAndSelectServices();
                    continueButtonClick();
                }
            }
        });
};
