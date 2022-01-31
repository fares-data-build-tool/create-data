# Update or change the Site error page

## Overview

CloudFront is configured with error routing to serve a static HTML page from S3 in the event of origin, in our case the AWS ALB loadbalancer pointing to the Site container running in ECS on Fargate, erroring or not returning a response

We have some different error pages found here: [repos/fdbt-site/error](../../repos/fdbt-site/error)

## Steps

### To set a specific error page

- Upload the files from `repos/fdbt-site/error/<desired error page>` to the root of the `fdbt-error-page-<env>` S3 bucket
- Go to CloudFront and create a invalidation for `/`

### If you want to take the Site offline for maintenance

- Go to `repos/fdbt-site/error/outage` and edit line 47 to the desired date (and make any other desired changes)
- Upload the files from `repos/fdbt-site/error/outage` to the root of the `fdbt-error-page-<env>` S3 bucket
- Go to ECS and set the desired tasks of the fdbt-site-env to 0
- Go to CloudFront and create a invalidation for `/`
- Go to the site and confirm that the “Service unavailable” page is showing as expected (this may take a minute or so as the Fargate tasks shut down)
