# Do a Release

This page documents the release process for the various services of the Fares Data Build Tool.

### Test Release

1. Create a feature branch off develop of the format `feature/{JIRA_TICKET}_{DESCRIPTION}` eg. `feature/TFN-300_create_matching_page`
2. Develop the feature and create a PR back into develop, making sure to fill in the PR template and ensuring all Acceptance Criteria and other requirements have been met
3. In order to merge, the PR will need to:
   1. Be approved by another member of the team
   2. Pass any tests/linting in the CI pipeline where appropriate for the repo
4. After the above the reviewer can perform the merge as a **SQUASH MERGE** and follow the **COMMIT MESSAGE FORMAT** defined in [https://www.conventionalcommits.org/en/v1.0.0-beta.2/](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
   1. As an example creating the matching page could have the commit message `feat: created page to match stops to fare stages`
   2. Any relevant extra detail about the ticket should go in the body of the commit message
   3. Any redundant commit messages should not be present in the body eg. `Fixed tests`
   4. For most merges, a body should not be necessary

### Pre-prod Release

1. After a ticket has been tested on the Test environment it can be released to pre-prod
2. A PR should be created from develop into master, or from a release branch if commits need to be cherry picked from develop
3. In order to merge, the PR will need to:
   1. Be approved by another member of the team
   2. Pass tests/linting/UI tests in the CI pipeline where appropriate for the repo
4. After the above the reviewer can perform the merge as a **MERGE COMMIT** and follow the **COMMIT MESSAGE FORMAT** defined here:
   1. Title: `Pre-prod Release`
   2. Body: A list of every feature/bug with a brief description
   3. eg.
      > Pre-prod Release
      >
      > - feat: created page to match stops to fare stages
      > - fix: redirect on fare type page goes to correct page
      > - docs: updated README with instructions to run locally

Note that releases to master are **MERGE COMMITS** as opposed to develop where they are **SQUASH MERGES**, it’s very important to stick to this

### Prod Release

1. In order to release to production, a release needs to be made in the repo in question, the easiest way to do this is to head to the GitHub repo and then to the releases page where you can create a new release from a branch, in most cases this should be master
2. The tag version should follow semver versioning ([https://semver.org/](https://semver.org/)), a feat would correspond to a minor bump, a fix would correspond to a patch bump, breaking changes would be a major bump. The tag should always start with a v eg. v0.2.1
3. The title of the release should also be the version, the description should be the list of features and fixes going out in that release
4. Creating the tag will trigger the pipeline, there is also a manual approval step in the pipeline as an extra precautionary step
