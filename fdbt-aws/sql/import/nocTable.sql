SET
    FOREIGN_KEY_CHECKS = 0;

TRUNCATE nocTable;

LOAD DATA
FROM
    S3 's3-eu-west-2://fdbt-noc-data-test/NOCTable.csv' REPLACE INTO TABLE nocTable FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '' LINES TERMINATED BY '\n' IGNORE 1 lines (
        nocCode,
        operatorPublicName,
        vosaPsvLicenseName,
        opId,
        pubNmId,
        nocCdQual,
        changeDate,
        changeAgent,
        changeComment,
        dateCeased,
        dataOwner
    );

SET
    FOREIGN_KEY_CHECKS = 1;