npm-install:
	cd ${FDBT_ROOT}/repos/fdbt-netex-output && npm i
	cd ${FDBT_ROOT}/repos/fdbt-netex-output/src/netex-validator && npm i
	cd ${FDBT_ROOT}/repos/fdbt-site && npm i
	cd ${FDBT_ROOT}/repos/fdbt-site/cypress_tests && npm i