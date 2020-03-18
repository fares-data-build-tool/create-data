import fs from 'fs';
import format from 'xml-formatter';
// import matchingdata from './testdata/matchingdata';
import geoZonePeriodData from './testdata/geoZonePeriodData';
import { OperatorData } from './types';
// import singleTicketNetexGenerator from './single-ticket/singleTicketNetexGenerator';
import periodTicketNetexGenerator from './period-ticket/periodTicketNetexGenerator';

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

// const service: ServiceData = {
//     serviceDescription: 'Test Description',
// };

// const netexGen = singleTicketNetexGenerator(matchingdata, operator, service);
const netexGen = periodTicketNetexGenerator(geoZonePeriodData, operator);

netexGen.generate().then((data: string) => {
    fs.writeFile('./output/output.xml', format(data), {}, () => {
        console.log('Written');
    });
});
