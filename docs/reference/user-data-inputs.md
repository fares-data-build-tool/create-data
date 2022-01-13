# User data inputs

In order to generate Netex we need the following data from a user:

- Which operator?
- Which service?
- Which ticket type?
- Which direction the service is going in?
- The fares data
- The stops on that route matched to fare stages

## CSV Upload - Fare Triangle

A user will be required to upload a CSV file via the User Interface. A template will be provided.

### Empty template

```csv
NaPTAN Code,,,,,,,,,
Fare Stage Name,NaPTAN Code,,,,,,,,
,Fare Stage Name,NaPTAN Code,,,,,,,
,,Fare Stage Name,NaPTAN Code,,,,,,
,,,Fare Stage Name,NaPTAN Code,,,,,
,,,,Fare Stage Name,NaPTAN Code,,,,
,,,,,Fare Stage Name,NaPTAN Code,,,
,,,,,,Fare Stage Name,NaPTAN Code,,
,,,,,,,Fare Stage Name,NaPTAN Code,
,,,,,,,,Fare Stage Name,NaPTAN Code
,,,,,,,,,Fare Stage Name
```

### Populated template

```csv
NaPTAN Code,,,,,,,,,
Acomb Green Lane,NaPTAN Code,,,,,,,,
110,Mattison Way,NaPTAN Code,,,,,,,
110,110,Nursery Drive,NaPTAN Code,,,,,,
110,110,110,Holl Bank/Beech Ave,NaPTAN Code,,,,,
170,170,110,110,Cambridge Street (York),NaPTAN Code,,,,
170,170,110,110,100,Blossom Street,NaPTAN Code,,,
170,170,170,170,100,100,Rail Station (York),3290YYA00103,,
170,170,170,170,100,100,100,Piccadilly (York),,
,,,,,,,,Fare Stage Name,NaPTAN Code
,,,,,,,,,Fare Stage Name
```

## CSV Upload - Zone upload

The following template will allow a user to specify a zone with either atco or naptan codes. Both do NOT need to be populated but is optional. The name is mandatory. All we need to catch here is a list of stops with a unique identifier and a zone name for that grouping. That zone name or reference will need to kept in the long term and tagged to a specific operator.

### Example

```csv
FareZoneName,NaptanCodes,AtcoCodes
Test Town Centre,TestNaptan-TN1, TestATCO-TA1
,TestNaptan-TN2,TestATCO-TA2
,TestNaptan-TN3,TestATCO-TA3
,TestNaptan-TN4,TestATCO-TA4
,TestNaptan-TN5,TestATCO-TA5
,TestNaptan-TN6,TestATCO-TA6
,TestNaptan-TN7,TestATCO-TA7
,TestNaptan-TN8,TestATCO-TA8
,TestNaptan-TN9,TestATCO-TA9
,TestNaptan-TN10,TestATCO-TA10
,TestNaptan-TN11,TestATCO-TA11
,TestNaptan-TN12,TestATCO-TA12
,TestNaptan-TN13,TestATCO-TA13
,TestNaptan-TN14,TestATCO-TA14
,TestNaptan-TN15,TestATCO-TA15
,TestNaptan-TN16,TestATCO-TA16
,TestNaptan-TN17,TestATCO-TA17
,TestNaptan-TN18,TestATCO-TA18
,TestNaptan-TN19,TestATCO-TA19
,TestNaptan-TN20,TestATCO-TA20
```

## Matching Data

Matching data is added on-screen by the user, they will be shown the list of bus stops on the route, naptan codes and the ability to select which fare stages they belong to.

The file contains:

- fareZones - e.g fare stages to the user on the front end
- stops - a list of all stops within that fareZone with the name, naptan and atco codes
- A list of prices - e.g all the price combinations
- fareZones applicable to each price - what farezones you can travel to for that given price

This will output Json in the following format:

```json
{
  "lineName": "",
  "listOfFareZones": [
    {
      "name": "",
      "stops": [
        {
          "stopName": "",
          "naptanCode": "",
          "atcoCode": "",
          "localityCode": "",
          "localityName": "",
          "qualifierName": ""
        }
      ],
      "prices": [
        {
          "price": "",
          "fareZones": ["fareZone1", "fareZone2", "etc"]
        }
      ]
    }
  ]
}
```

An example file completed, it is related to the CSV example above.

```javascript
export default {
  lineName: "13",
  fareZones: [
    {
      name: "Acomb Green Lane",
      stops: [
        {
          stopName: "Queenswood Grove",
          naptanCode: "32903623",
          atcoCode: "3290YYA03623",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Kingsthorpe",
          naptanCode: "32900077",
          atcoCode: "3290YYA00077",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Green Lane",
          naptanCode: "32900928",
          atcoCode: "3290YYA00928",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Green Lane",
          naptanCode: "32900075",
          atcoCode: "3290YYA00075",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Harold Court",
          naptanCode: "32900076",
          atcoCode: "3290YYA00076",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Kingsthorpe",
          naptanCode: "32900809",
          atcoCode: "3290YYA00809",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Queenswood Grove",
          naptanCode: "32900870",
          atcoCode: "3290YYA00870",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.10",
          fareZones: ["Mattison Way", "Nursery Drive", "Holl Bank/Beech Ave"],
        },
        {
          price: "1.70",
          fareZones: [
            "Cambridge Street",
            "Blossom Street",
            "Rail Station",
            "Piccadilly (York)",
          ],
        },
      ],
    },
    {
      name: "Mattison Way",
      stops: [
        {
          stopName: "Mattison Way",
          naptanCode: "32900359",
          atcoCode: "3290YYA00359",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Mattison Way",
          naptanCode: "32900358",
          atcoCode: "3290YYA00358",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.10",
          fareZones: ["Nursery Drive", "Holl Bank/Beech Ave"],
        },
        {
          price: "1.70",
          fareZones: [
            "Cambridge Street",
            "Blossom Street",
            "Rail Station",
            "Piccadilly (York)",
          ],
        },
      ],
    },
    {
      name: "Nursery Drive",
      stops: [
        {
          stopName: "Campbell Avenue",
          naptanCode: "32900357",
          atcoCode: "3290YYA00357",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Campbell Avenue",
          naptanCode: "32901666",
          atcoCode: "3290YYA01666",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.10",
          fareZones: [
            "Holl Bank/Beech Ave",
            "Cambridge Street (York)",
            "Blossom Street",
          ],
        },
        {
          price: "1.70",
          fareZones: ["Rail Station", "Piccadilly (York)"],
        },
      ],
    },
    {
      name: "Holl Bank/Beech Ave",
      stops: [
        {
          stopName: "Collingwood Avenue",
          naptanCode: "32901606",
          atcoCode: "3290YYA01606",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Hob Moor Drive",
          naptanCode: "32901610",
          atcoCode: "3290YYA01611",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Holly Bank Road",
          naptanCode: "32901608",
          atcoCode: "3290YYA01609",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.10",
          fareZones: ["Cambridge Street", "Blossom Street"],
        },
        {
          price: "1.70",
          fareZones: ["Rail Station", "Piccadilly (York)"],
        },
      ],
    },
    {
      name: "Cambridge Street (York)",
      stops: [
        {
          stopName: "Barbara Grove",
          naptanCode: "32903583",
          atcoCode: "3290YYA03583",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Holgate Hill",
          naptanCode: "32900195",
          atcoCode: "3290YYA00195",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.00",
          fareZones: ["Blossom Street", "Rail Station", "Piccadilly (York)"],
        },
      ],
    },
    {
      name: "Blossom Street",
      stops: [
        {
          stopName: "Blossom Street",
          naptanCode: "32900152",
          atcoCode: "3290YYA00152",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Rail Station",
          naptanCode: "32900141",
          atcoCode: "3290YYA00141",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Blossom Street",
          naptanCode: "32900149",
          atcoCode: "3290YYA00149",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.00",
          fareZones: ["Rail Station", "Piccadilly (York)"],
        },
      ],
    },
    {
      name: "Rail Station",
      stops: [
        {
          stopName: "Rail Station",
          naptanCode: "32900136",
          atcoCode: "3290YYA00136",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.00",
          fareZones: ["Piccadilly (York)"],
        },
      ],
    },
    {
      name: "Piccadilly (York)",
      stops: [
        {
          stopName: "Piccadilly",
          naptanCode: "32900103",
          atcoCode: "3290YYA00103",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Low Ousegate",
          naptanCode: "32900100",
          atcoCode: "3290YYA00100",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Rougier Street",
          naptanCode: "32900922",
          atcoCode: "3290YYA00924",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Micklegate",
          naptanCode: "32900099",
          atcoCode: "3290YYA00099",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
        {
          stopName: "Merchantgate",
          naptanCode: "32900107",
          atcoCode: "3290YYA00107",
          localityCode: "E0026633",
          localityName: "Bewbush",
          qualifierName: "West Sussex",
        },
      ],
      prices: [
        {
          price: "1.00",
          fareZones: ["Piccadilly (York)"],
        },
      ],
    },
  ],
};
```

Before the above JSON is created, we will be outputting the csv uploaded fares triangle data to S3 in the following format:

```javascript
{
  stageName: string,
  prices: string[]
}
```

The next page will be able to get this data and then get the needed information from the reference data tables to plug the gaps.
