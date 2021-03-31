STAGE?=dev

dev: start-localstack create-local-buckets run-local

start-localstack: delete-localstack
	SERVICES=s3 ENTRYPOINT=-d localstack start
	sleep 10

delete-localstack:
	docker ps -a | awk '{ print $$1,$$2 }' | grep localstack/localstack | awk '{print $$1 }' | xargs -I {} docker rm -f {}

create-local-buckets:
	awslocal s3 mb s3://fdbt-raw-user-data-dev
	awslocal s3 mb s3://fdbt-user-data-dev
	awslocal s3 mb s3://fdbt-matching-data-dev
	awslocal s3 mb s3://fdbt-netex-data-dev

run-local:
	export STAGE=dev && npm run dev

# Cypress

open-cypress:
	cd cypress_tests && npm run openCypress

run-cypress-chrome:
	cd cypress_tests && BROWSER=chrome npm run runCypress

run-cypress-firefox:
	cd cypress_tests && BROWSER=firefox npm run runCypress

run-cypress-edge:
	cd cypress_tests && BROWSER=edge npm run runCypress

run-cypress-all: run-cypress-chrome run-cypress-firefox run-cypress-edge
