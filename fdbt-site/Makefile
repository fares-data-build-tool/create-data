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
