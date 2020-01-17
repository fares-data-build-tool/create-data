let nocTable = [
    { NOCCODE: "AD1T", OperatorPublicname: "Metrobus", PubNmId: 3214556 },
    { NOCCODE: "FC3R", OperatorPublicname: "First", PubNmId: 758463 }
];

let nocLines = [
    { Mode: "Bus", NOCCODE: "FC3R" },
    { Mode: "Rail", NOCCODE: "AD1T" }
];

let publicName = [
    { Website: "cdcd.com", PubNmId: 3214556 },
    { Website: "abab.com", PubNmId: 758463 }
];

let propKey = "NOCODE";

function mergeArray (array1, array2) {
    let findMatchingProperty = objectProperty => array2.find(property => property.objectProperty === objectProperty);
    array1.forEach(property => Object.assign(property, findMatchingProperty(property.objectProperty)));
  }

mergeArray(nocTable, nocLines);

console.log(nocTable);

mergeArray(nocTable, publicName);

console.log(nocTable);

