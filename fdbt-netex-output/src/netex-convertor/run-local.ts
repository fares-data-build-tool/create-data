import fs from 'fs';
// import format from 'xml-formatter';
import matchingdata from './testdata/matchingdata';
// import geoZonePeriodData from './testdata/geoZonePeriodData';
import { OperatorData, ServiceData } from './types';
import singleTicketNetexGenerator from './single-ticket/singleTicketNetexGenerator';
// import periodTicketNetexGenerator from './period-ticket/periodTicketNetexGenerator';

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



netexGen.generate().then((data: string) => {
        console.log('Written');
    });
});
