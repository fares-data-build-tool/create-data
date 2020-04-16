PROJECT_NAME=fdbt

dev: docker-up wait-for-mysql data-reset wait-for-s3 create-local-buckets print-help start-site


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


# DATA

data-reset:
	./scripts/create_mysql_tables.sh
	./scripts/data_reset.sh


# UTILITY

wait-for-s3:
	./scripts/wait_for_s3.sh

wait-for-mysql:
	./scripts/wait_for_mysql.sh

create-local-buckets:
	awslocal s3 mb s3://fdbt-raw-user-data-dev
	awslocal s3 mb s3://fdbt-user-data-dev
	awslocal s3 mb s3://fdbt-matching-data-dev
	awslocal s3 mb s3://fdbt-netex-data-dev

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
