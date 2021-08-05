import { clickElementById, continueButtonClick, isUuidStringValid } from '../support/helpers';
import {
    completeFlatFarePages,
    completeSalesPages,
    defineUserTypeAndTimeRestrictions,
    selectFareType,
} from '../support/steps';

describe('The flat fare faretype product journey', () => {
    it('completes successfully for multi service', () => {
        selectFareType('flatFare', false);
        defineUserTypeAndTimeRestrictions();
        clickElementById('radio-option-multipleServices');
        continueButtonClick();
        completeFlatFarePages('Flat Fare Test Product', false);
        completeSalesPages();
        isUuidStringValid();
    });

    it('completes successfully for geo zone', () => {
        selectFareType('flatFare', false);
        defineUserTypeAndTimeRestrictions();
        clickElementById('radio-option-geoZone');
        continueButtonClick();
        completeFlatFarePages('geo zone flat fare', false, false, true);
        completeSalesPages();
        isUuidStringValid();
    });
});
