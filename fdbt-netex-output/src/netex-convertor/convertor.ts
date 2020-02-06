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

export function convertXmlToJsObject () {
    fs.readFile("./netexTemplate.xml", {encoding: "utf8"},function(err, data) {
    if (err) {
        console.log(err)
    }
    else {
    const json = JSON.parse(parser.toJson(data, {reversible: true}));
    return json;
    }
  });
}

export function convertJsObjectToXml (netexFileAsJsObject: NetexObject) {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString);
    return netexFileAsXmlString;
}

export function updateJsObject (netexFileAsJsObject: NetexObject) {
    const resourceFrameUpdates = netexFileAsJsObject["PublicationDelivery"]["dataObjects"]["CompositeFrame"]["frames"]["ResourceFrame"];
    resourceFrameUpdates["codespaces"]["Codepsace"]["XmlnsUrl"]["$t"] = Website;
    resourceFrameUpdates["dataSources"]["DataSource"]["Email"]["$t"]= TTRteEnq;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"]["Name"]["roles"]["ResponsibilityRoleAssignment"]["ResposibleOrganisationRef"]["ref"] = opIdNocFormat;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"]["Name"]["roles"]["ResponsibilityRoleAssignment"]["ResposibleOrganisationRef"]["t"] = OperatorPublicName;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"]["Name"]["roles"]["ResponsibilityRoleAssignment"]["StakeholderRoleType"]["ResposibleOrganisationRef"]["ref"] = opIdNocFormat;
    resourceFrameUpdates["responsibilitySets"]["ResponsibilitySet"]["Name"]["roles"]["ResponsibilityRoleAssignment"]["StakeholderRoleType"]["ResposibleOrganisationRef"]["t"] = OperatorPublicName;
    resourceFrameUpdates["typesOfValue"]["Valueset"]["values"]["Branding"]["id"] = opIdBrandFormat;
    resourceFrameUpdates["typesOfValue"]["Operator"]["id"] = opIdNocFormat;
    resourceFrameUpdates["typesOfValue"]["Operator"]["PublicCode"]["$t"] = NOCCode;
    resourceFrameUpdates["typesOfValue"]["Operator"]["Name"]["$t"] = OperatorPublicName;
    resourceFrameUpdates["typesOfValue"]["Operator"]["ShortName"]["$t"] = ShortName;
    resourceFrameUpdates["typesOfValue"]["Operator"]["TradingName"]["$t"] = VOSA_PSVLicenseName;
    resourceFrameUpdates["typesOfValue"]["Operator"]["ContactDetails"]["Phone"]["$t"] = FareEnq;
    resourceFrameUpdates["typesOfValue"]["Operator"]["Address"]["Street"]["$t"] = ComplEnq;
    resourceFrameUpdates["typesOfValue"]["Operator"]["PrimaryMode"]["$t"] = Mode;
}
