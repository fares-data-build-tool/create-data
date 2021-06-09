NVM_INITIATE=. ${NVM_DIR}/nvm.sh &&

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run: ## Run everything locally
	cd fdbt-dev && $(MAKE) dev

install: ## Install all node modules
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-netex-output && nvm use && npm i
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-netex-output/src/netex-validator && nvm use && npm i
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-site && nvm use && npm i
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-site/cypress_tests && nvm use && npm i

audit-fix: ## Fix all npm audit issues
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-netex-output && nvm use && npm audit fix
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-netex-output/src/netex-validator && nvm use && npm audit fix
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-site && nvm use && npm audit fix
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-site/cypress_tests && nvm use && npm audit fix

cypress: ## Open cypress console to run UI tests
	cd repos/fdbt-site && $(MAKE) open-cypress
