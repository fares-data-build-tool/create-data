PROJECT_NAME=fdbt
UNVALIDATED_NETEX_BUCKET=fdbt-unvalidated-netex-data-dev

help:
	echo && echo "\tTry running \"make run\" in the top level directory:" && echo && echo "\tcd .. && make run"

dev: docker-up wait-for-mysql data-reset wait-for-s3-and-sns create-local-buckets create-local-dynamodb-table create-sns-topics add-data-to-buckets print-help start-site


# DOCKER

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-restart:
	docker-compose restart


# NPM

start-site:
	cd ${FDBT_ROOT}/repos/fdbt-site && make run-local


# NETEX CONVERTOR

generate-single:
	./scripts/trigger_netex_convertor.sh single

generate-validate-single: generate-single validate-latest-file

generate-single-group:
	./scripts/trigger_netex_convertor.sh singleGroup

generate-validate-single-group: generate-single-group validate-latest-file

generate-multi-service:
	./scripts/trigger_netex_convertor.sh periodMultiService

generate-validate-multi-service: generate-multi-service validate-latest-file

generate-flat-fare:
	./scripts/trigger_netex_convertor.sh flatFare

generate-validate-flat-fare: generate-flat-fare validate-latest-file

generate-flat-fare-with-sop-prices:
	./scripts/trigger_netex_convertor.sh flatFareWithSopPrices

generate-validate-flat-fare-with-sop-prices: generate-flat-fare-with-sop-prices validate-latest-file

generate-flat-fare-group:
	./scripts/trigger_netex_convertor.sh flatFareGroup

generate-validate-flat-fare-group: generate-flat-fare-group validate-latest-file

generate-geo-zone:
	./scripts/trigger_netex_convertor.sh periodGeoZone

generate-validate-geo-zone: generate-geo-zone validate-latest-file

generate-geo-zone-group:
	./scripts/trigger_netex_convertor.sh periodGeoZoneGroup

generate-validate-geo-zone-group: generate-geo-zone-group validate-latest-file

generate-return:
	./scripts/trigger_netex_convertor.sh return

generate-validate-return: generate-return validate-latest-file

generate-return-circular:
	./scripts/trigger_netex_convertor.sh returnCircular

generate-validate-return-circular: generate-return-circular validate-latest-file

generate-return-circular-group:
	./scripts/trigger_netex_convertor.sh returnCircularGroup

generate-validate-return-circular-group: generate-return-circular-group validate-latest-file

generate-multi-op-geo-zone:
	./scripts/trigger_netex_convertor.sh multiOpGeoZone

generate-validate-multi-op-geo-zone: generate-multi-op-geo-zone validate-latest-file

generate-multi-op-multi-service:
	./scripts/trigger_netex_convertor.sh multiOpMultiServices

generate-validate-multi-op-multi-service: generate-multi-op-multi-service validate-latest-file

generate-scheme-operator-geo-zone:
	./scripts/trigger_netex_convertor.sh schemeOperatorGeoZone

generate-validate-scheme-operator-geo-zone: generate-scheme-operator-geo-zone validate-latest-file

generate-scheme-operator-flat-fare:
	./scripts/trigger_netex_convertor.sh schemeOperatorFlatFare

generate-validate-scheme-operator-flat-fare: generate-scheme-operator-flat-fare validate-latest-file

generate-carnet-single:
	./scripts/trigger_netex_convertor.sh carnetSingle

generate-validate-carnet-single: generate-carnet-single validate-latest-file

generate-carnet-return:
	./scripts/trigger_netex_convertor.sh carnetReturn

generate-validate-carnet-return: generate-carnet-return validate-latest-file

generate-carnet-period-geo-zone:
	./scripts/trigger_netex_convertor.sh carnetPeriodGeoZone

generate-validate-carnet-period-geo-zone: generate-carnet-period-geo-zone validate-latest-file

generate-scheme-carnet-period-geo-zone:
	./scripts/trigger_netex_convertor.sh schemeCarnetPeriod

generate-validate-scheme-carnet-period-geo-zone: generate-scheme-carnet-period-geo-zone validate-latest-file

generate-carnet-period-multi-service:
	./scripts/trigger_netex_convertor.sh carnetPeriodMultiService

generate-validate-carnet-period-multi-service: generate-carnet-period-multi-service validate-latest-file

generate-carnet-flat-fare:
	./scripts/trigger_netex_convertor.sh carnetFlatFare

generate-validate-carnet-flat-fare: generate-carnet-flat-fare validate-latest-file

generate-scheme-carnet-flat-fare:
	./scripts/trigger_netex_convertor.sh schemeCarnetFlatFare

generate-validate-scheme-carnet-flat-fare: generate-scheme-carnet-flat-fare validate-latest-file

generate-hybrid-period:
	./scripts/trigger_netex_convertor.sh hybridPeriod

generate-validate-hybrid-period: generate-hybrid-period validate-latest-file

generate-p2p-period:
	./scripts/trigger_netex_convertor.sh periodPointToPoint

generate-validate-p2p-period: generate-p2p-period validate-latest-file

generate-flat-fare-geo-zone:
	./scripts/trigger_netex_convertor.sh flatFareGeoZone

generate-validate-flat-fare-geo-zone: generate-flat-fare-geo-zone validate-latest-file

generate-return-with-extra-service:
	./scripts/trigger_netex_convertor.sh returnWithExtraService

generate-validate-return-with-extra-service: generate-return-with-extra-service validate-latest-file

generate-scheme-multiple-services:
	./scripts/trigger_netex_convertor.sh schemeOperatorMultiServices

generate-validate-scheme-multiple-services: generate-scheme-multiple-services validate-latest-file

generate-scheme-carnet-multiple-services:
	./scripts/trigger_netex_convertor.sh schemeCarnetMultipleServices

generate-validate-scheme-carnet-multiple-services: generate-scheme-carnet-multiple-services validate-latest-file

generate-single-group-multiple-adults:
	./scripts/trigger_netex_convertor.sh singleGroupMultipleAdults

generate-validate-single-group-multiple-adults: generate-single-group-multiple-adults validate-latest-file

validate-netex:
	./scripts/trigger_netex_validator.sh $(file)

validate-latest-file:
	./scripts/validate_latest_netex.sh

copy-latest-netex:
	EDGE_PORT=4572 awslocal s3 cp s3://fdbt-unvalidated-netex-data-dev/$(EDGE_PORT=4572 awslocal s3 ls s3://fdbt-unvalidated-netex-data-dev --recursive | sort | tail -n 1 | awk '{print $NF}') .

generate-validate-all: add-data-to-buckets
	./scripts/generate_validate_all_netex.sh

generate-validate-all-parallel: add-data-to-buckets
	./scripts/generate_validate_all_netex_parallel.sh

generate-validate-all-parallel-quiet: add-data-to-buckets
	./scripts/generate_validate_all_netex_parallel.sh | grep -E "Uploading file|valid schema|ERROR"

generate-netex-emailer:
	./scripts/trigger_netex_emailer.sh $(file)

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
	EDGE_PORT=4572 awslocal s3 mb s3://fdbt-raw-user-data-dev
	EDGE_PORT=4572 awslocal s3 mb s3://fdbt-user-data-dev
	EDGE_PORT=4572 awslocal s3 mb s3://fdbt-matching-data-dev
	EDGE_PORT=4572 awslocal s3 mb s3://fdbt-netex-data-dev
	EDGE_PORT=4572 awslocal s3 mb s3://fdbt-unvalidated-netex-data-dev
	EDGE_PORT=4572 awslocal s3 mb s3://fdbt-products-data-dev

create-local-dynamodb-table:
	EDGE_PORT=4569 awslocal dynamodb create-table --attribute-definitions AttributeName=id,AttributeType=S --table-name sessions --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST
	EDGE_PORT=4569 awslocal dynamodb update-time-to-live --table-name sessions --time-to-live-specification "Enabled=true, AttributeName=expires"

create-sns-topics:
	EDGE_PORT=4575 awslocal sns create-topic --name AlertsTopic

add-data-to-buckets:
	EDGE_PORT=4572 awslocal s3 sync ./data/matchingData/ s3://fdbt-matching-data-dev/BLAC
	EDGE_PORT=4572 awslocal s3 sync ./data/netexData/ s3://fdbt-netex-data-dev/BLAC

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
