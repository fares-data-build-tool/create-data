// eslint-disable-next-line import/no-extraneous-dependencies
import parser from 'xml2json';
import { OperatorData, ServiceData } from '../types';
import matchingdata from '../testdata/matchingdata';
import singleTicketNetexGenerator from './singleTicketNetexGenerator';
import expectedNetex from '../testdata/expectedNetex';

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

jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2020, 2, 16, 0, 0, 0, 0)).valueOf());

describe('singleTicketNetexGenerator', () => {
    let netexGen: { generate: Function };
    beforeEach(() => {
        netexGen = singleTicketNetexGenerator(matchingdata, operator, service);
    });

    it('gets a list of stops from matching data', async () => {
        const netex = await netexGen.generate();
        const netexJson = parser.toJson(netex, { reversible: false });

        expect(JSON.parse(netexJson)).toEqual(expectedNetex);
    });
});
