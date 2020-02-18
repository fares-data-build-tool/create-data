build:
	npm run build
lint:
	npm run lint

install-dynamodb-local:
	sls dynamodb install

start-dynamodb-local:
	sls dynamodb start --seed=domain --stage=dev

run-dynamodb-local: install-dynamodb-local start-dynamodb-local
