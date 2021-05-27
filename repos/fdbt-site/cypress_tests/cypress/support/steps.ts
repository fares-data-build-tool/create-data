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
    randomlyChooseASchoolProof,
    randomlyDecideTermRestrictions,
    randomlyChooseSchoolAgeLimits,
} from './helpers';

export const defineUserTypeAndTimeRestrictions = (): void => {
    randomlyDetermineUserType();
    randomlyDecideTimeRestrictions();
    continueButtonClick();
};

export type FareType = 'single' | 'period' | 'return' | 'flatFare' | 'multiOperator' | 'schoolService' | 'carnet';

export const defineSchoolUserAndTimeRestrictions = (): void => {
    randomlyChooseSchoolAgeLimits();
    randomlyChooseASchoolProof();
    continueButtonClick();
    randomlyDecideTermRestrictions();
};

export const selectFareType = (fareType: FareType, isScheme: boolean): void => {
    getHomePage(isScheme);
    startPageLinkClick();
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
};

export const selectCarnetFareType = (fareType: FareType): void => {
    selectFareType('carnet', false);
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
};

export const selectSchoolFareType = (
    fareType: 'single' | 'period' | 'return' | 'flatFare' | 'multiOperator' | 'schoolService',
): void => {
    clickElementById(fareTypeToFareTypeIdMapper(fareType));
    continueButtonClick();
    continueButtonClick();
};
export const startSchemeJourney = (): void => {
    getHomePage(true);
    startPageLinkClick();
};

export const completeFlatFarePages = (productName: string, isScheme: boolean): void => {
    if (isScheme) {
        completeOperatorSearch(true);
    } else {
        randomlyChooseAndSelectServices();
        continueButtonClick();
    }
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

const completePointToPointProductDetail = (): void => {
    getElementById('product-details-name').type('Product Test');
    getElementById('product-details-carnet-quantity').type('5');
    getElementById('product-details-carnet-expiry-quantity').type('10');
    getElementById('product-details-carnet-expiry-unit').select('Days');

    continueButtonClick();
};

export const completeSinglePages = (csvUpload: boolean, isCarnet: boolean): void => {
    completeServicePage();
    selectRandomOptionFromDropDown('direction-journey-pattern');
    continueButtonClick();
    completeFareTrianglePages(csvUpload);
    completeMatchingPage();

    if (isCarnet) {
        completePointToPointProductDetail();
    }

    continueButtonClick();
};

export const completeReturnPages = (csvUpload: boolean, isCarnet: boolean): void => {
    completeServicePage();
    selectRandomOptionFromDropDown('outbound-journey');
    selectRandomOptionFromDropDown('inbound-journey');
    continueButtonClick();
    completeFareTrianglePages(csvUpload);
    completeMatchingPage();
    completeMatchingPage();

    if (isCarnet) {
        completePointToPointProductDetail();
    }

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
