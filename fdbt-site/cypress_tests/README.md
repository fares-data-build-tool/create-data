# Cypress UI Tests

Cypress UI test project, to prove key user journeys work.

## Getting Started

### Install dependencies

Run the following to install the required dependencies, including Cypress:

```bash
cd ${FDBT_ROOT}/repos/fdbt-site/cypress_tests && npm i
```

### Install browsers

We run the tests on Chrome, Firefox and Edge - follow the download and installation instructions for each of these.

Note - for those using Ubuntu, there are instructions [https://www.omgubuntu.co.uk/2021/01/how-to-install-edge-on-ubuntu-linux](here) on how to install the developer version of Edge (at the time of writing, there is not a stable version of Edge for Linux distributions).

## Running the tests locally in interactive mode

- Bring up the site locally as per instructions in fdbt-dev.
- To open Cypress in interactive mode, run the following:

```bash
cd ${FDBT_ROOT}/repos/fdbt-site
make open-cypress
```

- You can now manually run any or all of the cypress tests, choosing which browser you wish the test to run on.
- This mode allows you to look back through the state of the site at different points in the test execution, which can be useful in debugging issues.

## Running the tests locally via the CLI

- To run the tests via the CLI, run the following:

```bash
cd ${FDBT_ROOT}/repos/fdbt-site
make run-cypress-[chrome|firefox|edge|all]
```

- This will not open the interactive test-runner, but will save screenshots and videos in the cypress directory if any errors occur.
