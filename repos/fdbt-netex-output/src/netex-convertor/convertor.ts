import parser from 'xml2json';
import fs from "fs";

export function convertXmlToJsObject () {
    fs.readFile("./netexTemplate.xml", {encoding: "utf8"},function(err, data) {
    const json = JSON.parse(parser.toJson(data, {reversible: true}));
    return json;
  });
}

export function convertJsObjectToXml (netexFileAsJsObject: object) {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString);
    return netexFileAsXmlString;
}

export function updateJsObject (netexFileAsJsObject: object) {
    netexFileAsJsObject["PublicationDelivery"]["dataObjects"]["CompositeFrame"]["frames"]["ResourceFrame"]["codespaces"]["Codepsace"]["XmlnsUrl"] = message;
    netexFileAsJsObject["PublicationDelivery"]["dataObjects"]["CompositeFrame"]["frames"]["ResourceFrame"]["dataSources"]["DataSource"]["Email"] = message;
    netexFileAsJsObject["PublicationDelivery"]["dataObjects"]["CompositeFrame"]["frames"]["ResourceFrame"]["responsibilitySets"]["ResponsibilitySet"]["Name"]["roles"]["ResponsibilityRoleAssignment"]["ResposibleOrganisationRef"] = message;

}
