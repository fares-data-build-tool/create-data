# Building and Patching of Container based Applications

## Overview

The Create Fares Data site is build as a Container Image and is deployed via AWS Elastic Container Service on Fargate. Running on Fargate, which is a serverless, pay-as-you-go compute engine provides further runtime isolation and removing operational overhead of maintaining and securing a host operating system, than if we were running this on an EC2 instance

## Tools

- CircleCI - build runner
- AWS ECS on Fargate - container runtime
- Docker - container build tool
- AWS ECR - container repository
- AWS ECR Image Scanning - container image scanning
- AWS CloudFormation - defines the AWS ECS and ECR configurations

## Base Image

The official Docker Node base image is used as the parent image of the site container

[https://hub.docker.com/\_/node](https://hub.docker.com/_/node)

During the build process for every new commit, we run the package manager update and upgrade process, to ensure that we have the latest patches installed into our image

## Build Process

- At the start of each container build, CircleCI will pull in the latests parent image to ensure we are getting the latest upstream build
- Then we start the first stage of the Docker multistage build where we compile and build the Create Fares Data application, this ensures that the NodeJS development tooling needed to build the site is not included in the published image
- Then the second stage of the build runs that runs the package manager update and upgrade process, installs the required dependencies and copies the generated application from the the first stage of the build
- Next, the built image is pushed from CircleCI into the ECR repository. As the image is received a security scan is triggered against the image to check for vulnerabilities against the CVE database
- From here the build then continues, deploying the application out to the test environment where further automated and manual testing are performed
