NVM_INITIATE=. ${NVM_DIR}/nvm.sh &&

npm-install:
	
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-netex-output && nvm use && npm i
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-netex-output/src/netex-validator && nvm use && npm i
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-site && nvm use && npm i
	${NVM_INITIATE} cd ${FDBT_ROOT}/repos/fdbt-site/cypress_tests && nvm use && npm i