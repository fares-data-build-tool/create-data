import fs from 'fs';
import { Operator } from '../types';
import { buildNocList, xsl } from './handler';
import netexGenerator from './netexGenerator';
import libxslt from 'libxslt';
import * as db from '../data/auroradb';

const allOperatorData: Operator[] = [
    {
        nocCode: 'NWBT',
        opId: '135752',
        vosaPsvLicenseName: 'Boomerang Travel Ltd',
        operatorName: 'Pilkingtonbus',
        url: '#http://pilkingtonbus.com/#',
        email: 'pilkingtonbus@live.co.uk',
        contactNumber: '01254237083',
        street: 'Argyle Street, Accrington, Lancashire BB5 1DQ',
        mode: 'Bus',
    },
    {
        nocCode: 'PBLT',
        opId: '137430',
        vosaPsvLicenseName: 'Preston Bus Ltd',
        operatorName: 'Preston Bus',
        url: '#http://www.prestonbus.co.uk/#',
        email: 'customer.care@prestonbus.co.uk',
        contactNumber: '01772253671',
        street: '221 Deepdale Road, Preston PR1 6NY',
        mode: 'Bus',
    },
    {
        nocCode: 'DCCL',
        opId: '136214',
        vosaPsvLicenseName: 'Durham County Council',
        operatorName: 'Durham County Council',
        url: '#http://www.durhamCountyCouncil.co.uk/#',
        email: 'customer.care@durhamcountycouncil.co.uk',
        contactNumber: '0300 026 0000',
        street: 'County Hall, Aykley Heads, Durham DH1 5UL',
        mode: 'Bus',
    }, // DCCL has fake data
    {
        nocCode: 'HCTY',
        opId: '136580',
        vosaPsvLicenseName: 'Harrogate Coach Travel Ltd',
        operatorName: 'Connexions Buses',
        url: '#http://www.connexionsbuses.com/#',
        email: 'craig@connexionsbuses.com',
        contactNumber: '01423339600',
        street: 'Unit 3, South Field Lane, Tockwith, York YO26 7QP',
        mode: 'Bus',
    },
    {
        nocCode: 'WBTR',
        opId: '138008',
        vosaPsvLicenseName: 'Warrington Borough Transport Ltd',
        operatorName: "Warrington's Own Buses",
        url: '#http://warringtonsownbuses.co.uk/#',
        email: 'travelcentre@warringtonsownbuses.co.uk',
        contactNumber: '01925634296',
        street: 'Wilderspool Causeway, Warrington, Cheshire WA4 6PT',
        mode: 'Bus',
    },
    {
        nocCode: 'BLAC',
        opId: '135742',
        vosaPsvLicenseName: 'Blackpool Transport Services Ltd',
        operatorName: 'Blackpool Transport',
        url: 'www.blackpooltransport.com#http://www.blackpooltransport.com#',
        email: 'enquiries@blackpooltransport.com',
        contactNumber: '01253 473001',
        street: 'Rigby Road, Blackpool FY1 5DD',
        mode: 'Bus',
    },
];

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

    it.each(fileNames)('should generate identical xml for %s', async fileName => {
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

        const operatorData: Operator[] = [];
        nocs.forEach(noc => {
            const findOperatorByNoc = allOperatorData.find(operator => operator.nocCode === noc);
            if (findOperatorByNoc) {
                operatorData.push(findOperatorByNoc);
            }
        });

        const netexGen = await netexGenerator(ticket, operatorData);
        const generatedNetex = await netexGen.generate();
        const parsedXsl = libxslt.parse(xsl);
        const transformedNetex = parsedXsl.apply(generatedNetex);

        const xmlFileName = `${fileName.split('.')[0]}.xml`;
        await fs.promises.writeFile(`${generatedNetexPath}${xmlFileName}`, transformedNetex);

        const file1 = await fs.promises.readFile(`../../fdbt-dev/data/generatedNetex/${xmlFileName}`, 'utf-8');
        const file2 = await fs.promises.readFile(`../../fdbt-dev/data/netexData/${xmlFileName}`, 'utf-8');
        expect(file1).toEqual(file2);
    });
});
