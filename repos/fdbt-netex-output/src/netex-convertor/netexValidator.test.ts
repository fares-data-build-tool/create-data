import { validateNetex } from './netexValidator';
import fs from 'fs';
import path from 'path';

describe('Netex Validator', () => {
    it('', () => {
        const result = validateNetex(fs.readFileSync(path.resolve(__dirname, '../netex-convertor/testdata/currentNetex.xml'),'utf-8'));

        expect(true).toBeTruthy;
        
    });
});