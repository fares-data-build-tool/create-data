import parser from 'xml2json';
import fs from "fs";

const Website = "www.iwbus.co.uk";
const TTRteEnq = "email@iwbus.co.uk";
const OpId = "123123";
const OperatorPublicName = "IWBus Transport";
const NOCCode = "IWBU";
const ShortName = "IWBus";
const VOSA_PSVLicenseName = "IWBus Transport Ltd";
const FareEnq = "0113 111 1111";
const ComplEnq = "Apsley Hpuse, 1 Wellington Street, Leeds, LS1 AAA";
const Mode = "bus";
const opIdNocFormat = "noc:" + OpId;
const opIdBrandFormat = OpId + "@brand";

interface NetexObject {
    [key: string]: any;
  }

export async function convertXmlToJsObject (): Promise<NetexObject> {
    try {
        const fileData = await fs.promises.readFile("./netexTemplate.xml", {encoding: "utf8"});
        const json = JSON.parse(parser.toJson(fileData, {reversible: true}));
        console.log(json);
        return json;
    }
    catch(error) {
        console.log(error);
        return {};
    }
}

export function convertJsObjectToXml (netexFileAsJsObject: NetexObject): string {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString);
    return netexFileAsXmlString;
}

export function updateJsObject (netexFileAsJsObject: NetexObject): NetexObject {
    const resourceFrameUpdates = netexFileAsJsObject["PublicationDelivery"]["dataObjects"]["CompositeFrame"][0]["frames"]["ResourceFrame"];
    resourceFrameUpdates["codespaces"]["Codespace"]["XmlnsUrl"]["$t"] = Website;
    resourceFrameUpdates["dataSources"]["DataSource"]["Email"]["$t"]= TTRteEnq;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"][0]["roles"]["ResponsibilityRoleAssignment"]["ResponsibleOrganisationRef"]["ref"] = opIdNocFormat;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"][0]["roles"]["ResponsibilityRoleAssignment"]["ResponsibleOrganisationRef"]["t"] = OperatorPublicName;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"][1]["roles"]["ResponsibilityRoleAssignment"]["StakeholderRoleType"]["ResponsibleOrganisationRef"]["ref"] = opIdNocFormat;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"][1]["roles"]["ResponsibilityRoleAssignment"]["StakeholderRoleType"]["ResponsibleOrganisationRef"]["t"] = OperatorPublicName;
    resourceFrameUpdates["typesOfValue"]["Valueset"]["values"]["Branding"]["id"] = opIdBrandFormat;
    resourceFrameUpdates["typesOfValue"]["Operator"]["id"] = opIdNocFormat;
    resourceFrameUpdates["typesOfValue"]["Operator"]["PublicCode"]["$t"] = NOCCode;
    resourceFrameUpdates["typesOfValue"]["Operator"]["Name"]["$t"] = OperatorPublicName;
    resourceFrameUpdates["typesOfValue"]["Operator"]["ShortName"]["$t"] = ShortName;
    resourceFrameUpdates["typesOfValue"]["Operator"]["TradingName"]["$t"] = VOSA_PSVLicenseName;
    resourceFrameUpdates["typesOfValue"]["Operator"]["ContactDetails"]["Phone"]["$t"] = FareEnq;
    resourceFrameUpdates["typesOfValue"]["Operator"]["Address"]["Street"]["$t"] = ComplEnq;
    resourceFrameUpdates["typesOfValue"]["Operator"]["PrimaryMode"]["$t"] = Mode;
    return resourceFrameUpdates;
}

convertXmlToJsObject().then(data => {
    console.log(data);
    const trialjsobject: NetexObject = updateJsObject(data);
    console.log(trialjsobject);
    const trialxmlobject: string = convertJsObjectToXml(trialjsobject);
    console.log(trialxmlobject);
}).catch(err => console.error(err.message))
