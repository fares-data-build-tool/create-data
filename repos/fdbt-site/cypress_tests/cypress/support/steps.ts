import {
    startPageLinkClick,
    clickElementById,
    continueButtonClick,
    randomlyDetermineUserType,
    randomlyDecideTimeRestrictions,
    randomlyChooseAndSelectServices,
    getElementById,
    getHomePage,
    fareTypeToFareTypeIdMapper,
    selectRandomOptionFromDropDown,
    uploadFile,
    submitButtonClick,
    completeProductDateInformationPage,
    getRandomNumber,
    completeSalesOfferPackagesForMultipleProducts,
    completeMultipleProducts,
    completeOperatorSearch,
    clickSomeCheckboxes,
    randomlyDecideTermRestrictions,
    randomlyChooseProductPeriodValidity,
    clickRandomElementInTable,
    clickElementByText,
    retryRouteChoiceOnReturnProductError,
} from './helpers';

export const defineUserTypeAndTimeRestrictions = (): void => {
    randomlyDetermineUserType();
    randomlyDecideTimeRestrictions();

    continueButtonClick();
};

export type FareType =
    | 'single'
    | 'period'
    | 'return'
    | 'flatFare'
    | 'multiOperator'
    | 'schoolService'
    | 'carnet'
    | 'carnetFlatFare'
    | 'carnetPeriod';

export const defineSchoolUserAndTimeRestrictions = (): void => {
    randomlyDetermineUserType();
    randomlyDecideTermRestrictions();
};

export const selectFareType = (fareType: FareType, isScheme: boolean): void => {
    getHomePage(isScheme ? 'scheme' : 'LNUD');
    startPageLinkClick();
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
};

export const selectCarnetFareType = (fareType: FareType): void => {
    selectFareType('carnet', false);
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
};

export const selectSchoolFareType = (fareType: FareType): void => {
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
    continueButtonClick();
};

export const completeFlatFarePages = (
    productName: string,
    isScheme: boolean,
    isCarnet = false,
    isGeoZone = false,
): void => {
    if (isScheme) {
        completeOperatorSearch(true);
    } else if (isGeoZone) {
        uploadFile('csv-upload', 'fareZone.csv');
        submitButtonClick();
    } else {
        randomlyChooseAndSelectServices();
        continueButtonClick();
    }
    getElementById('multiple-product-name-0').type(productName);
    getElementById('multiple-product-price-0').type('50.50');

    if (isCarnet) {
        getElementById('product-details-carnet-quantity-0').type('20');
        getElementById('product-details-carnet-expiry-quantity-0').type('6');
        selectRandomOptionFromDropDown('product-details-carnet-expiry-unit-0');
    }

    continueButtonClick();
    continueButtonClick();
};

export const completeFlatFareCarnet = (): void => {
    clickElementById('radio-option-multipleServices');
    continueButtonClick();
    randomlyChooseAndSelectServices();
    continueButtonClick();

    for (let i = 0; i < 3; i += 1) {
        getElementById(`multiple-product-name-${i}`).type(`Flat fare carnet ${i + 1}`);
        getElementById(`multiple-product-price-${i}`).type((9.5 + i).toString());
        getElementById(`product-details-carnet-quantity-${i}`).type((2 + i).toString());
        getElementById(`product-details-carnet-expiry-quantity-${i}`).type('7');
        selectRandomOptionFromDropDown(`product-details-carnet-expiry-unit-${i}`);
        clickElementById('add-another-button');
    }

    clickElementById('remove-button');

    continueButtonClick();
    continueButtonClick();
};

export const completeServicePage = (): void => {
    selectRandomOptionFromDropDown('service');
    continueButtonClick();

    // CFD-638 We see an issue here when a bus route is chosen that cannot be used for a return fare.
    //   The difficulty is in the feedback being returned after clicking the continue button, as we may go to a new page
    //   or we may stay on the current page with an error dialog, this means it's difficult to place the checking code.
    //   Cypress also advises against conditional testing, but we are server side rendered so we can use it if needed
    //   see https://docs.cypress.io/guides/core-concepts/conditional-testing
    //   however support is not great, as it's a minimally used feature.
    //   We don't want to change the page flow or remove the route options, as they are this way to meet the GDS specifications.
    //   So here we just retry the random choice twice more, which will almost always result in a test passing.
    //   Due to Cypress' implementation, it's not possible to loop these or continually retry until success, so we just
    //   do the naive approach of calling the retry twice
    retryRouteChoiceOnReturnProductError();
    retryRouteChoiceOnReturnProductError();
};

export const completeDirectionPageIfReached = (): void => {
    cy.url()
        .should('not.match', /\/service/) // This ensures we're on the correct page
        .then((url: string) => {
            if (url.includes('direction')) {
                selectRandomOptionFromDropDown('select-direction');
                continueButtonClick();
            }
        });
};

const completeFareTrianglePages = (csvUpload: boolean): void => {
    clickElementById(csvUpload ? 'csv-upload' : 'manual-entry');
    continueButtonClick();
    if (csvUpload) {
        clickElementById('pence');
        uploadFile('csv-upload', 'fareTriangle.csv');
        submitButtonClick();
    } else {
        clickElementById('less-than-20-fare-stages');
        continueButtonClick();
        getElementById('fare-stages').type('3');
        continueButtonClick();
        getElementById('fare-stage-name-1').type('Shott Drive');
        getElementById('fare-stage-name-2').type('The Stag pub');
        getElementById('fare-stage-name-3').type('Frederick Drive');
        continueButtonClick();
        continueButtonClick();
        getElementById('TheStagpub-ShottDrive').type('100');
        getElementById('FrederickDrive-TheStagpub').type('150');
        continueButtonClick();
    }
};

const completeMatchingPage = (): void => {
    for (let i = 0; i < 4; i += 1) {
        cy.get(`[id=option-${i}]`)
            .find('option')
            .then(($elm) => {
                $elm.get(i + 1).setAttribute('selected', 'selected');
            })
            .parent()
            .trigger('change');
    }
    submitButtonClick();
};

const completePointToPointProductDetail = (): void => {
    getElementById('product-details-name').type('Product Test');
    getElementById('product-details-carnet-quantity').type('5');
    getElementById('product-details-carnet-expiry-quantity').type('10');
    getElementById('product-details-carnet-expiry-unit').select('Days');
    continueButtonClick();
};

const completePointToPointPeriodProductDetail = (): void => {
    getElementById('point-to-point-period-product-name').type('Product Test');
    getElementById('product-details-expiry-quantity').type('5');
    getElementById('product-details-expiry-unit').select('Days');
    continueButtonClick();
    randomlyChooseProductPeriodValidity();
};

export const completeSinglePages = (csvUpload: boolean, isCarnet: boolean): void => {
    completeServicePage();
    completeDirectionPageIfReached();
    completeFareTrianglePages(csvUpload);
    completeMatchingPage();

    if (isCarnet) {
        completePointToPointProductDetail();
    }

    continueButtonClick();
};

export const completeReturnPages = (csvUpload: boolean, isCarnet: boolean, isPeriod: boolean): void => {
    completeServicePage();
    completeFareTrianglePages(csvUpload);
    completeMatchingPage();
    completeMatchingPage();

    if (isCarnet) {
        completePointToPointProductDetail();
    }

    if (isPeriod) {
        completePointToPointPeriodProductDetail();
    } else {
        if (getRandomNumber(0, 1) === 0) {
            clickElementById('return-validity-not-defined');
        } else {
            clickElementById('return-validity-defined');
            getElementById('return-validity-amount').type(getRandomNumber(1, 100).toString());
            selectRandomOptionFromDropDown('return-validity-units');
        }

        continueButtonClick();
    }

    continueButtonClick();
};

export const completeSalesPages = (numberOfProducts?: number, multiProductNamePrefix?: string): void => {
    if (numberOfProducts && multiProductNamePrefix) {
        completeSalesOfferPackagesForMultipleProducts(numberOfProducts, multiProductNamePrefix);
    } else {
        clickSomeCheckboxes();
    }
    continueButtonClick();
    completeProductDateInformationPage();
    continueButtonClick();
};

export const completePeriodGeoZonePages = (numberOfProducts: number, multiProductNamePrefix?: string): void => {
    clickElementById('radio-option-geoZone');
    continueButtonClick();
    uploadFile('csv-upload', 'fareZone.csv');
    submitButtonClick();
    completeMultipleProducts(numberOfProducts, multiProductNamePrefix);
};

export const completePeriodMultiServicePages = (
    numberOfProducts?: number,
    multiProductNamePrefix?: string,
    isCarnet?: boolean,
): void => {
    clickElementById('radio-option-multipleServices');
    continueButtonClick();
    randomlyChooseAndSelectServices();
    continueButtonClick();
    completeMultipleProducts(numberOfProducts, multiProductNamePrefix, isCarnet);
};

export const completeHybridPages = (
    numberOfProducts?: number,
    multiProductNamePrefix?: string,
    isCarnet?: boolean,
): void => {
    clickElementById('radio-option-hybrid');
    continueButtonClick();
    uploadFile('csv-upload', 'fareZone.csv');
    submitButtonClick();
    randomlyChooseAndSelectServices();
    continueButtonClick();
    completeMultipleProducts(numberOfProducts, multiProductNamePrefix, isCarnet);
};

export const completePointToPointPeriodPages = (): void => {
    clickElementById('radio-option-pointToPointPeriod');
    continueButtonClick();
    completeReturnPages(false, false, true);
    continueButtonClick();
};

export const completeSchoolPeriodMultiServicePages = (
    numberOfProducts?: number,
    multiProductNamePrefix?: string,
    isCarnet?: boolean,
): void => {
    randomlyChooseAndSelectServices();
    continueButtonClick();
    completeMultipleProducts(numberOfProducts, multiProductNamePrefix, isCarnet);
};

export const completeMultiOpGeoZonePages = (
    isCarnet = false,
    numberOfProducts?: number,
    multiProductNamePrefix?: string,
): void => {
    clickElementById('radio-option-geoZone');
    continueButtonClick();

    uploadFile('csv-upload', 'fareZone.csv');
    submitButtonClick();

    completeOperatorSearch(false);

    completeMultipleProducts(numberOfProducts, multiProductNamePrefix, isCarnet);
};

export const completeMultiOpMultiServicePages = (numberOfProducts?: number, multiProductNamePrefix?: string): void => {
    clickElementById('radio-option-multipleServices');
    continueButtonClick();
    randomlyChooseAndSelectServices();
    continueButtonClick();

    completeOperatorSearch(true);

    completeMultipleProducts(numberOfProducts, multiProductNamePrefix);
};

export const completeMyFaresPointToPointProductsPages = (): void => {
    for (let i = 0; i < 3; i++) {
        clickRandomElementInTable('govuk-table__body', 'service-link');
        getElementById('service-name').should('not.be.empty');
        getElementById('service-status').should('not.be.empty');
        clickElementByText('Back');
    }
};

export const completeMyFaresOtherProductsPages = (): void => {
    for (let i = 0; i < 3; i++) {
        clickRandomElementInTable('govuk-table__body', 'product-link');
        getElementById('product-name').should('not.be.empty');
        getElementById('product-status').should('not.be.empty');
        getElementById('fare-type').should('not.be.empty');
        clickElementByText('Back');
    }
};
