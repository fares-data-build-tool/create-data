import libxml2js, { ValidationError } from '../../node_modules/libxmljs2';
import fs from 'fs';
import path from 'path';

export interface ValidationResults {
    failure: boolean,
    errors: ValidationError[]
}

export const validateNetex = (netex: any): ValidationResults => {
    
    const netexXsd = fs.readFileSync(path.resolve(__dirname, '../netex-convertor/netexXsd.xml'), 'utf-8');
    const netexXsdDoc = libxml2js.parseXml(netexXsd);
    const netexToValidate = netex;
    console.log(netexToValidate.substring(0,26))
    const netexToValidateDoc = libxml2js.parseXml(netexToValidate);

    let failure: boolean;
    let errors: ValidationError[];

    if (netexToValidateDoc.validate(netexXsdDoc)) {
        failure = false;
        errors = [];
    } else {
        failure = true;
        errors = netexToValidateDoc.validationErrors;
    }

    return {
        failure,
        errors
    }


}
