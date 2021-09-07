import 'cypress-file-upload';
import { FareType } from './steps';

export const throwInvalidRandomSelectorError = (): void => {
    throw new Error('Invalid random selector');
};

export const getElementById = (id: string): Cypress.Chainable<JQuery> => cy.get(`[id=${id}]`);
export const getElementByText = (text: string): Cypress.Chainable<JQuery> => cy.contains(text);
export const getElementByName = (id: string): Cypress.Chainable<JQuery> => cy.get(`[name=${id}]`);
export const getElementByClass = (id: string): Cypress.Chainable<JQuery> => cy.get(`[class=${id}]`);
export const getElementByDataTestId = (id: string): Cypress.Chainable<JQuery> => cy.get(`[data-test-id=${id}]`);

export const clickElementById = (id: string): Cypress.Chainable<JQuery> => getElementById(id).click();
export const clickElementByText = (text: string): Cypress.Chainable<JQuery> => getElementByText(text).click();

export const getRandomNumber = (min: number, max: number): number => Cypress._.random(min, max);

export const getHomePage = (noc = 'BLAC'): void => {
    cy.clearCookies();
    cy.visit(`?disableAuth=${noc}`);
};

export const fareTypeToFareTypeIdMapper = (fareType: FareType): string => `radio-option-${fareType}`;

export const startPageLinkClick = (): Cypress.Chainable<JQuery> => clickElementById('faretype-link');

export const continueButtonClick = (): Cypress.Chainable<JQuery> => clickElementById('continue-button');

export const submitButtonClick = (): Cypress.Chainable<JQuery> => clickElementById('submit-button');

export const assertElementNotVisibleById = (id: string): Cypress.Chainable<JQuery> =>
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

export const randomlyChooseSchoolAgeLimits = (): void => {
    const randomSelector = getRandomNumber(1, 2);
    switch (randomSelector) {
        case 1:
            cy.log('age-range-required');
            clickElementById('age-range-required');
            randomlyChooseAgeLimits();
            break;
        case 2:
            cy.log('age-range-not-required');
            clickElementById('age-range-not-required');
            break;
        default:
            throwInvalidRandomSelectorError();
    }
};
export const randomlyChooseASchoolProof = (): void => {
    const randomSelector = getRandomNumber(1, 2);
    switch (randomSelector) {
        case 1:
            cy.log('proof-not-required');
            clickElementById('proof-required');
            randomlyChooseAProof();
            break;
        case 2:
            cy.log('proof-not-required');
            clickElementById('proof-not-required');
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

    getElementById(sortedPassengerTypeIds[0]).then(($elm0) => {
        sortedPassengerTypes.push($elm0.attr('value'));
        getElementById(sortedPassengerTypeIds[1]).then(($elm1) => {
            sortedPassengerTypes.push($elm1.attr('value'));
            continueButtonClick();
            sortedPassengerTypes.forEach((passengerType) => {
                completeUserDetailsPage(true, groupSize, passengerType);
            });
        });
    });
};

export const randomlyChooseProductPeriodValidity = (): void => {
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

export const selectRandomOptionFromDropDown = (dropDownId: string): void => {
    cy.get(`[id=${dropDownId}]`)
        .find('option')
        .then(($elm) => {
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
    cy.get('[class=govuk-radios__input]')
        .its('length')
        .then((length) => {
            const randomNumber = getRandomNumber(0, length - 1);
            cy.get('[class=govuk-radios__input]').eq(randomNumber).click();
        });

    continueButtonClick();
};

export const randomlyDecideTimeRestrictions = (): void => {
    if (getRandomNumber(0, 1) === 0) {
        clickElementById('valid-days-not-required');
    } else {
        // click yes button
        clickElementById('valid-days-required');

        // randomly pick a time restriction
        getElementById('conditional-time-restriction')
            .find('[class=govuk-radios__input]')
            .its('length')
            .then((length) => {
                const randomNumber = getRandomNumber(0, length - 1);
                getElementById('conditional-time-restriction')
                    .find('[class=govuk-radios__input]')
                    .eq(randomNumber)
                    .click();
            });
    }

    continueButtonClick();
};

export const randomlyDecideTermRestrictions = (): void => {
    if (getRandomNumber(0, 1) === 0) {
        clickElementById('term-time-no');
    } else {
        clickElementById('term-time-yes');
    }
    continueButtonClick();
};

export const clickAllCheckboxes = (): void => {
    cy.get('[class=govuk-checkboxes__input]').each((checkbox) => {
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

const encodeId = (str: string): string =>
    str
        .replace(/ /g, '')
        .replace(/([()])/g, '\\$1')
        .trim();

export const completeSalesOfferPackagesForMultipleProducts = (
    numberOfProducts: number,
    multiProductNamePrefix: string,
): void => {
    for (let i = 0; i < numberOfProducts; i += 1) {
        const productName = `${encodeId(multiProductNamePrefix)}${i + 1}`;
        const idPrefix = `product-${productName}-checkbox-`;
        cy.get('.govuk-checkboxes__input').then(($elements) => {
            const numberOfSalesOfferPackages = $elements.length / numberOfProducts;
            const randomSalesOfferPackageIndex = getRandomNumber(0, numberOfSalesOfferPackages - 1);

            getElementById(`${idPrefix}${randomSalesOfferPackageIndex}`).click();
            if (getRandomNumber(0, 1) === 1 && numberOfSalesOfferPackages > 1) {
                const otherIndex =
                    randomSalesOfferPackageIndex === numberOfSalesOfferPackages - 1
                        ? randomSalesOfferPackageIndex - 1
                        : randomSalesOfferPackageIndex + 1;

                getElementById(`${idPrefix}${otherIndex}`).click();

                getElementById(`price-${productName}-${otherIndex}`).clear().type('9.99');
            }
        });
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
        .then((rawUuid) => {
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

export const completeMultipleProducts = (
    numberOfProducts = 1,
    multiProductNamePrefix?: string,
    carnet?: boolean,
): void => {
    for (let i = 0; i < numberOfProducts; i += 1) {
        if (i !== 0) {
            clickElementById('add-another-button');
        }

        getElementById(`multiple-product-name-${i}`).type(`${multiProductNamePrefix ?? 'product '}${i + 1}`);
        getElementById(`multiple-product-price-${i}`).type(`1${i}`);
        getElementById(`product-details-period-duration-quantity-${i}`).type(`2${i}`);
        selectRandomOptionFromDropDown(`product-details-period-duration-unit-${i}`);
        if (carnet) {
            getElementById(`product-details-carnet-quantity-${i}`).type((2 + i).toString());
            getElementById(`product-details-carnet-expiry-quantity-${i}`).type('1');
            selectRandomOptionFromDropDown(`product-details-carnet-expiry-unit-${i}`);
        }
    }

    continueButtonClick();
    randomlyChooseProductPeriodValidity();
    continueButtonClick();
    continueButtonClick();
};

export const completeOperatorSearch = (isMultiService: boolean): void => {
    cy.url()
        .should('match', /\/(searchOperators|reuseOperatorGroup)$/) // This is bassicly a wait to ensure we're on the correct page
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
