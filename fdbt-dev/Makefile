PROJECT_NAME=fdbt

dev: docker-up wait-for-mysql data-reset wait-for-s3-and-sns create-local-buckets create-sns-topics add-data-to-buckets print-help start-site


# DOCKER

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-restart:
	docker-compose restart


# NPM

start-site:
	npm --prefix ${FDBT_ROOT}/repos/fdbt-site run dev


# NETEX CONVERTOR

generate-point-to-point:
	./scripts/trigger_netex_convertor.sh fdbt-matching-data-dev pointToPoint

generate-multi-service:
	./scripts/trigger_netex_convertor.sh fdbt-matching-data-dev periodMultiService

generate-flat-fare:
	./scripts/trigger_netex_convertor.sh fdbt-matching-data-dev flatFare

generate-geo-zone:
	./scripts/trigger_netex_convertor.sh fdbt-matching-data-dev periodGeoZone

generate-return-service:
	./scripts/trigger_netex_convertor.sh fdbt-matching-data-dev return

generate-return-service-circular:
	./scripts/trigger_netex_convertor.sh fdbt-matching-data-dev returnCircular

validate-netex:
	./scripts/trigger_netex_validator.sh fdbt-unvalidated-netex-data-dev $(file)

validate-latest-file:
	./scripts/validate_latest_netex.sh fdbt-unvalidated-netex-data-dev


# DATA

data-reset:
	./scripts/create_mysql_tables.sh
	./scripts/data_reset.sh


# UTILITY

wait-for-s3-and-sns:
	./scripts/wait_for_s3_sns.sh

wait-for-mysql:
	./scripts/wait_for_mysql.sh

create-local-buckets:
	awslocal s3 mb s3://fdbt-raw-user-data-dev
	awslocal s3 mb s3://fdbt-user-data-dev
	awslocal s3 mb s3://fdbt-matching-data-dev
	awslocal s3 mb s3://fdbt-netex-data-dev
	awslocal s3 mb s3://fdbt-unvalidated-netex-data-dev

create-sns-topics:
	awslocal sns create-topic --name AlertsTopic

add-data-to-buckets:
	awslocal s3 sync ./data/matchingData/ s3://fdbt-matching-data-dev/

print-help:
	@echo "\n\n**************************\n"
	@echo "Site running on http://localhost:5555\n"
	@echo "S3 running on http://localhost:4572\n"
	@echo "MySQL running on 127.0.0.1:3306\n"
	@echo "**************************\n"


# DELETE

delete-all: delete-containers delete-images

delete-containers:
	docker rm -f $(shell docker ps --filter name=${PROJECT_NAME} -aq)

delete-images:
	docker rmi -f $(shell docker images ${PROJECT_NAME}* -qa)
