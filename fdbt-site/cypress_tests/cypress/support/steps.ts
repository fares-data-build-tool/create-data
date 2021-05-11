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
    assertElementNotVisibleById,
    completeSalesOfferPackagesForMultipleProducts,
    completeSingleProduct,
    completeMultipleProducts,
    completeOperatorSearch,
    clickSomeCheckboxes,
} from './helpers';

export const defineUserTypeAndTimeRestrictions = (): void => {
    randomlyDetermineUserType();
    randomlyDecideTimeRestrictions();
    continueButtonClick();
};

export const selectFareType = (
    fareType: 'single' | 'period' | 'return' | 'flatFare' | 'multiOperator' | 'schoolService',
): void => {
    getHomePage(false);
    startPageLinkClick();
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
};

export const startSchemeJourney = (): void => {
    getHomePage(true);
    startPageLinkClick();
};

export const completeFlatFarePages = (productName: string): void => {
    randomlyChooseAndSelectServices();
    continueButtonClick();
    getElementById('product-details-name').type(productName);
    getElementById('product-details-price').type('50.50');
    continueButtonClick();
    continueButtonClick();
};

export const completeServicePage = (): void => {
    selectRandomOptionFromDropDown('service');
    continueButtonClick();
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
            .then($elm => {
                $elm.get(i + 1).setAttribute('selected', 'selected');
            })
            .parent()
            .trigger('change');
    }
    submitButtonClick();
};

export const completeSinglePages = (csvUpload: boolean): void => {
    completeServicePage();
    selectRandomOptionFromDropDown('direction-journey-pattern');
    continueButtonClick();
    completeFareTrianglePages(csvUpload);
    completeMatchingPage();
    continueButtonClick();
};

export const completeReturnPages = (csvUpload: boolean): void => {
    completeServicePage();
    selectRandomOptionFromDropDown('outbound-journey');
    selectRandomOptionFromDropDown('inbound-journey');
    continueButtonClick();
    completeFareTrianglePages(csvUpload);
    completeMatchingPage();
    completeMatchingPage();

    assertElementNotVisibleById('return-validity-defined-conditional');
    if (getRandomNumber(0, 1) === 0) {
        clickElementById('return-validity-not-defined');
    } else {
        clickElementById('return-validity-defined');
        getElementById('return-validity-amount').type(getRandomNumber(1, 100).toString());
        selectRandomOptionFromDropDown('return-validity-units');
    }

    continueButtonClick();
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

export const completePeriodGeoZonePages = (numberOfProducts?: number, multiProductNamePrefix?: string): void => {
    clickElementById('geo-zone');
    continueButtonClick();
    uploadFile('csv-upload', 'fareZone.csv');
    submitButtonClick();

    if (!numberOfProducts || !multiProductNamePrefix) {
        completeSingleProduct();
    } else {
        completeMultipleProducts(numberOfProducts, multiProductNamePrefix);
    }
};

export const completePeriodMultiServicePages = (numberOfProducts?: number, multiProductNamePrefix?: string): void => {
    clickElementById('set-of-services');
    continueButtonClick();
    randomlyChooseAndSelectServices();
    continueButtonClick();

    if (!numberOfProducts || !multiProductNamePrefix) {
        completeSingleProduct();
    } else {
        completeMultipleProducts(numberOfProducts, multiProductNamePrefix);
    }
};

export const completeMultiOpGeoZonePages = (
    isScheme: boolean,
    numberOfProducts?: number,
    multiProductNamePrefix?: string,
): void => {
    if (!isScheme) {
        clickElementById('geo-zone');
        continueButtonClick();
    }

    uploadFile('csv-upload', 'fareZone.csv');
    submitButtonClick();

    completeOperatorSearch(false);

    if (!numberOfProducts || !multiProductNamePrefix) {
        completeSingleProduct();
    } else {
        completeMultipleProducts(numberOfProducts, multiProductNamePrefix);
    }
};

export const completeMultiOpMultiServicePages = (numberOfProducts?: number, multiProductNamePrefix?: string): void => {
    clickElementById('set-of-services');
    continueButtonClick();
    randomlyChooseAndSelectServices();
    continueButtonClick();

    completeOperatorSearch(true);

    if (!numberOfProducts || !multiProductNamePrefix) {
        completeSingleProduct();
    } else {
        completeMultipleProducts(numberOfProducts, multiProductNamePrefix);
    }
};
