import 'cypress-file-upload';
import {
    completeFlatFareCarnet,
    completeFlatFarePages,
    completeMultiOpGeoZonePages,
    completePeriodGeoZonePages,
    completeSalesPages,
    completeSinglePages,
    defineUserTypeAndTimeRestrictions,
    FareType,
    selectCarnetFareType,
    selectFareType,
} from './steps';
import { DateInput } from './types';

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

export const getHomePage = (noc = 'LNUD'): void => {
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

export const randomlySelectMultiServices = (): void => {
    const randomSelector = getRandomNumber(1, 3);
    switch (randomSelector) {
        case 1:
            cy.log('Select All button clicked');
            clickElementById('select-all-button');
            break;
        case 2:
            cy.log('Few checkbox are selected');
            getElementByClass('govuk-checkboxes__item').each((checkbox, index, checkboxes) => {
                const numberOfCheckboxes = checkboxes.length;
                if (numberOfCheckboxes === 1 || index !== numberOfCheckboxes - 1) {
                    cy.wrap(checkbox).click();
                }
            });
            break;
        case 3:
            cy.log('All checkbox are selected');
            getElementByClass('govuk-checkboxes__item').each((checkbox) => {
                cy.wrap(checkbox).click();
            });
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
    cy.get(`[id=${dropDownId}] option:selected`).then(($selected) => {
        cy.wrap($selected.text()).as('dropdownValue');
    });
};

export const completeGroupPassengerDetailsPages = (): void => {
    const groupSize = completeGroupSizePage();
    completeDefineGroupPassengersPages(groupSize);
};

export const randomlyDetermineUserType = (): void => {
    let passengerType;
    getElementByClass('govuk-radios__input')
        .its('length')
        .then((length) => {
            const randomNumber = getRandomNumber(0, length - 1);
            getElementByClass('govuk-radios__input')
                .eq(randomNumber)
                .click()
                .then(($radio) => {
                    passengerType = $radio.attr('aria-label');
                    cy.wrap(passengerType).as('passengerType');
                });
        });

    continueButtonClick();
};

export const randomlyDeterminePurchaseType = (isOtherProduct?: boolean): void => {
    let purchaseType: string;
    getElementByClass('govuk-checkboxes__input')
        .its('length')
        .then((length) => {
            const randomNumber = getRandomNumber(0, length - 1);
            getElementByClass('govuk-checkboxes__input')
                .eq(randomNumber)
                .click()
                .then(($radio) => {
                    const radioPurchaseType = $radio.attr('value');
                    purchaseType = (JSON.parse(radioPurchaseType) as { name: string }).name;

                    if (isOtherProduct) {
                        cy.get(`[id$=price-${randomNumber}]`).then(($radio) => {
                            purchaseType = `${purchaseType} - £${$radio.attr('value')}`;
                            cy.wrap(purchaseType).as('purchaseType');
                        });
                    } else {
                        cy.wrap(purchaseType).as('purchaseType');
                    }
                });
        });
    continueButtonClick();
};

export const randomlyDecideTimeRestrictions = (): void => {
    let timeRestriction = 'N/A';
    if (getRandomNumber(0, 1) === 0) {
        clickElementById('valid-days-not-required');
        cy.wrap(timeRestriction).as('timeRestriction');
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
                    .click()
                    .then(($radio) => {
                        timeRestriction = $radio.attr('value');
                        cy.wrap(timeRestriction).as('timeRestriction');
                    });
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

export const clickAllCheckboxes = (): string[] => {
    const input: string[] = [];
    getElementByClass('govuk-checkboxes__input').each((checkbox, index) => {
        cy.wrap(checkbox).click();
        const name = checkbox.attr('name');
        input[index] = name.split('#')[0];
        cy.wrap(input).as('input');
    });
    return input;
};

export const getAllCheckboxesData = (): void => {
    const input: string[] = [];
    getElementByClass('govuk-checkboxes__input').each((checkbox, index) => {
        cy.wrap(checkbox);
        const name = checkbox.attr('name');
        input[index] = name.split('#')[0];
        cy.wrap(input).as('input');
    });
};

export const getAllButFirstCheckbox = (): void => {
    const input: string[] = [];
    getElementByClass('govuk-checkboxes__input').each((checkbox, index) => {
        const name = checkbox.attr('name');
        input[index] = name.split('#')[0];
        cy.wrap(input).as('input');
    });
    cy.get('@input').then((input) => {
        const newInputWithoutFirstItem = input.toString().split(',').slice(1);
        cy.wrap(newInputWithoutFirstItem).as('input');
    });
};

export const clickSomeCheckboxes = (): void => {
    const input: string[] = [];
    getElementByClass('govuk-checkboxes__input').each((checkbox, index, checkboxes) => {
        const numberOfCheckboxes = checkboxes.length;
        if (numberOfCheckboxes === 1 || index !== numberOfCheckboxes - 1) {
            cy.wrap(checkbox).click();
            const name = checkbox.attr('name');
            input[index] = name.split('#')[0];
            cy.wrap(input).as('input');
        }
    });
};

export const clickFirstCheckboxIfMultiple = (): void => {
    getElementByClass('govuk-checkboxes__input').each((checkbox, index, checkboxes) => {
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
                getElementById(`${productName}-price-${otherIndex}`).clear().type('9.99');
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
            getAllCheckboxesData();
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
            getAllButFirstCheckbox();
            clickFirstCheckboxIfMultiple();
            break;
        }
        default: {
            throwInvalidRandomSelectorError();
        }
    }
};

export const completeProductDateInformationPage = (): DateInput => {
    const randomSelector = getRandomNumber(1, 2);
    let input;
    switch (randomSelector) {
        case 1: {
            getElementById('start-day-input').type('13');
            getElementById('start-month-input').type('10');
            getElementById('start-year-input').type('2010');
            input = { startDate: '13/10/2010' };
            break;
        }
        case 2: {
            getElementById('start-day-input').type('13');
            getElementById('start-month-input').type('10');
            getElementById('start-year-input').type('2010');
            getElementById('end-day-input').type('7');
            getElementById('end-month-input').type('12');
            getElementById('end-year-input').type('2025');
            input = {
                startDate: '13/10/2010',
                endDate: '07/12/2025',
            };
            break;
        }
        default: {
            throwInvalidRandomSelectorError();
        }
    }
    continueButtonClick();
    return input;
};

export const isFinished = (): void => {
    getElementByDataTestId('final-page-banner').should('exist');
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

export const clickRandomElementInTable = (tableName: string, elementId: string): void => {
    getElementByClass(tableName)
        .find('tr')
        .then((elm) => {
            const randomSelector = getRandomNumber(0, elm.length - 1);
            clickElementById(`${elementId}-${randomSelector}`);
        });
};

export const completeOperatorSearch = (): void => {
    getElementByClass('govuk-radios__input').each((element) => {
        if (element.attr('aria-label') === 'test') {
            cy.wrap(element).click();
        }
    });

    continueButtonClick();
};

export const addOtherProductsIfNotPresent = (): void => {
    getHomePage();
    clickElementById('manage-fares-link');
    clickElementByText('Other products');

    let numberOfPeriodProducts = 0;
    cy.wrap(numberOfPeriodProducts).as('numberOfPeriodProducts');
    let numberOfFlatFareProducts = 0;
    cy.wrap(numberOfFlatFareProducts).as('numberOfFlatFareProducts');
    let numberOfFlatFareCarnetProducts = 0;
    cy.wrap(numberOfFlatFareCarnetProducts).as('numberOfFlatFareCarnetProducts');

    cy.get(`[data-card-count]`).then((element) => {
        const totNumberOfProducts = Number(element.attr('data-card-count'));
        if (totNumberOfProducts > 0) {
            getElementByClass('govuk-table__body')
                .find('td')
                .each(($element) => {
                    const type = $element.text();
                    if (type === 'Period') {
                        numberOfPeriodProducts += 1;
                        cy.wrap(numberOfPeriodProducts).as('numberOfPeriodProducts');
                    }
                    if (type === 'Flat fare') {
                        numberOfFlatFareProducts += 1;
                        cy.wrap(numberOfFlatFareProducts).as('numberOfFlatFareProducts');
                    }
                    if (type === 'Flat fare carnet') {
                        numberOfFlatFareCarnetProducts += 1;
                        cy.wrap(numberOfFlatFareCarnetProducts).as('numberOfFlatFareCarnetProducts');
                    }
                });
        }
    });

    cy.get('@numberOfPeriodProducts').then((numberOfPeriodProducts) => {
        if (Number(numberOfPeriodProducts) === 0) {
            selectFareType('period', false);
            defineUserTypeAndTimeRestrictions();
            completePeriodGeoZonePages(1);
            completeSalesPages();
            isFinished();
            cy.log('Period product set up');
        }
    });

    cy.get('@numberOfFlatFareProducts').then((numberOfFlatFareProducts) => {
        if (Number(numberOfFlatFareProducts) === 0) {
            selectFareType('flatFare', false);
            defineUserTypeAndTimeRestrictions();
            clickElementById('radio-option-multipleServices');
            continueButtonClick();
            completeFlatFarePages('Flat Fare Test Product', false);
            completeSalesPages();
            isFinished();
            cy.log('Flat fare product set up');
        }
    });

    cy.get('@numberOfFlatFareCarnetProducts').then((numberOfFlatFareProducts) => {
        if (Number(numberOfFlatFareProducts) === 0) {
            selectCarnetFareType('flatFare');
            defineUserTypeAndTimeRestrictions();
            completeFlatFareCarnet();
            completeSalesPages(3, 'Flat fare carnet ');
            isFinished();
            cy.log('Flat fare carnet product set up');
        }
    });
};

export const addMultiOperatorProductIfNotPresent = (): void => {
    getHomePage();
    clickElementById('manage-fares-link');
    clickElementByText('Multi-operator products');

    cy.get(`[data-card-count]`).then((element) => {
        const numberOfProducts = Number(element.attr('data-card-count'));

        if (numberOfProducts === 0) {
            selectFareType('multiOperator', false);
            defineUserTypeAndTimeRestrictions();
            completeMultiOpGeoZonePages();
            completeSalesPages();
            isFinished();
        }
    });
};

export const addSingleProductIfNotPresent = (): void => {
    const hasProduct: string[] = [];
    cy.wrap(hasProduct).as('hasProduct');
    getHomePage();
    clickElementById('account-link');
    clickElementByText('Services');
    cy.get(`[id^="active-products-"]`).each(($element) => {
        if (parseInt($element.text()) > 0) {
            hasProduct.push($element.text());
            cy.wrap(hasProduct).as('hasProduct');
        }
    });
    cy.get('@hasProduct').then((hasProduct) => {
        if (hasProduct.length === 0) {
            const randomSelector = getRandomNumber(1, 2);
            if (randomSelector === 1) {
                cy.log('Making a single product with CSV upload');
                clickElementByText('Create new product');
                selectCarnetFareType('single');
                defineUserTypeAndTimeRestrictions();
                completeSinglePages(true, true);
                completeSalesPages();
                isFinished();
            } else {
                cy.log('Making a single product with manual upload');
                clickElementByText('Create new product');
                selectCarnetFareType('single');
                defineUserTypeAndTimeRestrictions();
                completeSinglePages(false, true);
                completeSalesPages();
                isFinished();
            }
        }
    });
};

export const retryRouteChoiceOnReturnProductError = (): void => {
    cy.get('main').then(($main) => {
        if ($main.text().includes('you cannot create a return product for this service')) {
            cy.log('Retrying, could not create a return product for for the first service');
            selectRandomOptionFromDropDown('service');
            continueButtonClick();
        }
    });
};

export const clearDates = (): void => {
    getElementById('start-day-input').clear();
    getElementById('start-month-input').clear();
    getElementById('start-year-input').clear();
    getElementById('end-day-input').clear();
    getElementById('end-month-input').clear();
    getElementById('end-year-input').clear();
};

export const completeMultiServicePages = (): void => {
    randomlySelectMultiServices();
    getElementById('operator-1').click();
    randomlySelectMultiServices();
    continueButtonClick();
};
