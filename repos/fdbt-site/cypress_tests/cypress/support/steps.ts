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

export const selectSchoolFareType = (
    fareType: 'single' | 'period' | 'return' | 'flatFare' | 'multiOperator' | 'schoolService',
): void => {
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
    selectRandomOptionFromDropDown('select-direction');
    continueButtonClick();
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
