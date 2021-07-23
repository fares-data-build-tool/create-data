import fs from 'fs';
import { Operator } from '../types';
import { buildNocList, xsl } from './handler';
import netexGenerator from './netexGenerator';
import libxslt from 'libxslt';

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
    });

    const fileNames: string[] = fs.readdirSync(matchingDataPath);

    it.each(fileNames)('should generate identical xml for %s', async fileName => {
        const ticket = JSON.parse(await fs.promises.readFile(`${matchingDataPath}${fileName}`, 'utf-8'));
        const nocs: string[] = buildNocList(ticket);
        const operatorData: Operator[] = nocs.map(noc => ({
            nocCode: noc,
            opId: '135742',
            vosaPsvLicenseName: 'Blackpool Transport Services Ltd',
            operatorPublicName: 'Blackpool Transport',
            website: 'www.blackpooltransport.com#http://www.blackpooltransport.com#',
            ttrteEnq: 'enquiries@blackpooltransport.com',
            fareEnq: '01253 473001',
            complEnq: 'Rigby Road, Blackpool FY1 5DD',
            mode: 'Bus',
        }));

        const netexGen = netexGenerator(ticket, operatorData);
        const generatedNetex = await netexGen.generate();
        const parsedXsl = libxslt.parse(xsl);
        const transformedNetex = parsedXsl.apply(generatedNetex);

        const xmlFileName = `${fileName.split('.')[0]}.xml`;
        await fs.promises.writeFile(`${generatedNetexPath}${xmlFileName}`, transformedNetex);

        const file1 = await fs.promises.readFile(`../../fdbt-dev/data/generatedNetex/${xmlFileName}`, 'utf-8');
        const file2 = await fs.promises.readFile(`../../fdbt-dev/data/netexData/${xmlFileName}`, 'utf-8');
        expect(file2).toEqual(file1); //Should this be the other way round?
    });
});
