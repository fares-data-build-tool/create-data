import { isUuidStringValid } from '../../support/helpers';
import {
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
    completeFlatFarePages,
    completeMultiOpGeoZonePages,
} from '../../support/steps';

describe('the scheme carnet product journeys', () => {
    it('completes successfully for a single product scheme carnet flat fare', () => {
        selectFareType('carnetFlatFare', true);
        defineUserTypeAndTimeRestrictions();
        completeFlatFarePages('Carnet flat fare', true, true);
        completeSalesPages();
        isUuidStringValid(true);
    });

    it('completes successfully for a multi product scheme period flat fare', () => {
        const productName = 'Carnet period';
        const numberOfProducts = 4;
        selectFareType('carnetPeriod', true);
        defineUserTypeAndTimeRestrictions();
        completeMultiOpGeoZonePages(true, true, numberOfProducts, productName);
        completeSalesPages(numberOfProducts, productName);
        isUuidStringValid(true);
    });
});
