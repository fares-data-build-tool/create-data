# Create Fares Data service NeTEx Output

[![CircleCI](https://circleci.com/gh/fares-data-build-tool/fdbt-netex-output.svg?style=svg)](https://circleci.com/gh/fares-data-build-tool/fdbt-netex-output)

Code for creating, validating and uploading NeTEx data.

The repo is split into three components:

-   `Netex Convertor`: TypeScript Lambda responsible for generating NeTEx from user uploaded data in S3 and public reference data stored in the database
-   `Netex Validator`: Python Lambda responsible for validating the NeTEx against the published XSD and uploading to another S3 bucket if the validation is succesful
-   `Netex Emailer`: TypeScript Lambda responsible for emailing validated Netex to user

## Deploying

This tool uses the Serverless Framework to manage deployments to AWS and it is split into two serverless.yml files, one for the TypeScript Lambdas and one for the Python Lambda.

To deploy these lambdas directly, you will need to have the following requirements:

-   [Serverless CLI](https://serverless.com/framework/docs/getting-started/)
-   AWS Credentials setup on your machine
-   Infrastructure in `fdbt-aws` repo all deployed

### TypeScript Lambdas

In the root directory, run:

```bash
npm install
sls deploy --stage={STAGE_TO_DEPLOY_TO}
```

### Python Lambda

In the root directory, run the following:

```bash
cd src/netex-validator
npm install
sls deploy --stage={STAGE_TO_DEPLOY_TO}
```

## Tips

There's a few concepts it's good to grasp prior to working with the netex repo.

### JSON -> XML Parsing

We use the xml2json node package to parse JSON into XML. There's some quirks to how it translates JSON to XML, here's an example to highlight these.

#### Example

```json
{
    "SalesOfferPackage": {
        "id": "SOP_1",
        "version": 1,
        "Name": {
            "$t": "Sales Offer Package 1"
        },
        "TypeOfTravelDocumentRef": {
            "version": "fxc:v1.0",
            "ref": "fxc:paperTicket"
        }
    }
}
```

becomes:

```xml
<SalesOfferPackageElement id="SOP_1" version="1.0">
    <Name>Sales Offer Package 1</Name>
    <TypeOfTravelDocumentRef version="fxc:v1.0" ref="fxc:paperTicket" />
</SalesOfferPackageElement>
```

Here, `%t` is used to denote the string contents of an XML block.

### Validating NeTEx changes

When making changes to the way we generate our NeTEx, it's important that we validate the generated NeTEx. There's two main ways in which we do this.

#### Checking for changes in generated NeTEx

We maintain a set of sample NeTEx files in the `fdbt-dev/data/netexData` folder. In order to check whether a change we've made has affected the NeTEx we generate, run the `generateAll.test.ts` test file:

```
cd ${FDBT_ROOT}/repos/fdbt-netex-output/
npm run test src/netex-convertor/generateAll.test.ts
```

This generates a set of NeTEx files based on the matching json in the `fdbt-dev/data/matchingData` folder, outputs the files to `fdbt-dev/data/generatedNetex` and compares it against the NeTEX files in `fdbt-dev/data/netexData`. You should review any differences that are flagged, and make corrections accordingly. If the differences observed are intentional, we need to update the sample NeTEx in `fdbt-dev/data/netexData` to reflect these changes.

#### Running the netex-validator

We also want to make sure that our NeTEx will pass validation by the netex-validator. To do this, bring up the environment locally, then run:

```
cd ${FDBT_ROOT}/fdbt-dev
make generate-validate-all-parallel
```

Ensure that no validation errors occur.
