import fs from 'fs';
import { Operator } from '../types';
import { buildNocList, xsl } from './handler';
import netexGenerator from './netexGenerator';
import libxslt from 'libxslt';
import * as db from '../data/auroradb';

describe('generateAll', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1625753009685);

    process.env.SNS_ALERTS_ARN = 'arn:aws:sns:us-east-1:000000000000:AlertsTopic';
    process.env.STAGE = 'dev';

    const dataPath = '../../fdbt-dev/data';
    const generatedNetexPath = `${dataPath}/generatedNetex/`;
    const matchingDataPath = `${dataPath}/matchingData/`;

    beforeAll(() => {
        if (!fs.existsSync(generatedNetexPath)) {
            fs.mkdirSync(generatedNetexPath);
        }

        jest.spyOn(db, 'getOperatorDetailsByNoc').mockResolvedValue(undefined);
    });

    const fileNames: string[] = fs.readdirSync(matchingDataPath);

    it.each(fileNames.filter(x => x.includes('carnetSingle')))(
        'should generate identical xml for %s',
        async fileName => {
            // noc of logged in user
            let baseNoc = '';

            const ticket = JSON.parse(await fs.promises.readFile(`${matchingDataPath}${fileName}`, 'utf-8'));

            if ('nocCode' in ticket) {
                baseNoc = ticket.nocCode;
            }

            const nocs: string[] = buildNocList(ticket);

            if (baseNoc) {
                nocs.push(baseNoc);
            }

            const operatorData: Operator[] = nocs.map(noc => ({
                nocCode: noc,
                opId: '135742',
                vosaPsvLicenseName: 'Blackpool Transport Services Ltd',
                operatorName: 'Blackpool Transport',
                url: 'www.blackpooltransport.com#http://www.blackpooltransport.com#',
                email: 'enquiries@blackpooltransport.com',
                contactNumber: '01253 473001',
                street: 'Rigby Road, Blackpool FY1 5DD',
                town: '',
                postcode: '',
                county: '',
                mode: 'Bus',
            }));

            const netexGen = await netexGenerator(ticket, operatorData);
            const generatedNetex = await netexGen.generate();
            const parsedXsl = libxslt.parse(xsl);
            console.log('parsed the xsl');
            console.log(JSON.stringify(parsedXsl));
            console.log(JSON.stringify(generatedNetex));
            const transformedNetex = parsedXsl.apply(generatedNetex);
            console.log('transformed the netex');

            const xmlFileName = `${fileName.split('.')[0]}.xml`;
            await fs.promises.writeFile(`${generatedNetexPath}${xmlFileName}`, transformedNetex);

            const file1 = await fs.promises.readFile(`../../fdbt-dev/data/generatedNetex/${xmlFileName}`, 'utf-8');
            const file2 = await fs.promises.readFile(`../../fdbt-dev/data/netexData/${xmlFileName}`, 'utf-8');
            expect(file1).toEqual(file2);
        },
    );
});
