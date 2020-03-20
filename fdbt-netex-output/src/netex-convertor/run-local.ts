import fs from 'fs';
import matchingdata from './testdata/matchingdata';
import { OperatorData, ServiceData } from './types';
import netexGenerator from './netexGenerator';

const website = 'www.iwbus.co.uk';
const ttrteEnq = 'email@iwbus.co.uk';
const opId = '123123';
const publicName = 'IWBus Transport';
const vosaPSVLicenseName = 'IWBus Transport Ltd'; // eslint-disable-line @typescript-eslint/camelcase
const fareEnq = '0113 111 1111';
const complEnq = 'Apsley Hpuse, 1 Wellington Street, Leeds, LS1 AAA';
const mode = 'bus';

const operator: OperatorData = {
    website,
    ttrteEnq,
    publicName,
    opId,
    vosaPSVLicenseName,
    fareEnq,
    complEnq,
    mode,
};

const service: ServiceData = {
    serviceDescription: 'Test Description',
};

const netexGen = netexGenerator(matchingdata, operator, service);

netexGen.generate().then((data: string) => {
    fs.writeFile('./output/output.xml', data, {}, () => {
        console.log('Written');
    });
});
