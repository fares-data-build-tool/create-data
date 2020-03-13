import libxmljs2, { ValidationError } from '../../node_modules/libxmljs2';
import fs from 'fs';
import path from 'path';

export interface ValidationResults {
    success: boolean;
    errors: ValidationError[];
}

export const cleanseXml = (xml: any): any => {
    return xml.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '');
};

export const validateNetex = (netexToValidate: any): ValidationResults => {
    try {
        const netexXsd = fs.readFileSync(path.resolve(__dirname, '../netex-convertor/netexXsd.xml'), 'utf8');
        const netexXsdDoc = libxmljs2.parseXml(netexXsd, {
            baseUrl: path.resolve(__dirname, '../netex-convertor/netexXsd.xml'),
        });

        const cleansedNetex = cleanseXml(netexToValidate);

        const netexToValidateDoc = libxmljs2.parseXml(cleansedNetex);

        let success: boolean;
        let errors: ValidationError[];

        if (netexToValidateDoc.validate(netexXsdDoc)) {
            success = true;
            errors = [];
        } else {
            success = false;
            errors = netexToValidateDoc.validationErrors;
        }

        return {
            success,
            errors,
        };
    } catch (err) {
        console.log(err.stack);
        throw new Error();
    }
};
