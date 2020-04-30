import parser from 'xml2json';
import fs from 'fs';

export interface NetexObject {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// eslint-disable-next-line import/prefer-default-export
export const getCleanWebsite = (nocWebsite: string): string => {
    if (nocWebsite !== null) {
        const splitWebsite = nocWebsite.split('#');

        return splitWebsite.length > 1 && splitWebsite[1] ? splitWebsite[1] : splitWebsite[0];
    }
    return '';
};

export const getNetexTemplateAsJson = async (filepath: string): Promise<NetexObject> => {
    try {
        const fileData = await fs.promises.readFile(`${__dirname}/${filepath}`, { encoding: 'utf8' });
        const json = JSON.parse(parser.toJson(fileData, { reversible: true, trim: true }));

        return json;
    } catch (error) {
        throw new Error(`Error converting NeTEx template to JSON: ${error.stack}`);
    }
};

export const convertJsonToXml = (netexFileAsJsonObject: NetexObject): string => {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsonObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString, { sanitize: true, ignoreNull: true });

    return netexFileAsXmlString;
};
