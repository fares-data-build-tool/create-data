
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

function mergeArrayObjects(arr1,arr2) {
    let start = 0;
    let merge = [];
  
    while(start < arr1.length){
      if(arr1[start].id === arr2[start].id){
          merge.push({...arr1[start],...arr2[start]})
      }
      start = start+1
    }
    return merge;
  }

  const merger1 = mergeArrayObjects(nocTable, nocLines);
  console.log(merger1);
  
  const merger2 = mergeArrayObjects(merger1, publicName);
  console.log(merger2);
