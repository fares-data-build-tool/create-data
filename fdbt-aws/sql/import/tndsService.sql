SET
    FOREIGN_KEY_CHECKS = 0;

TRUNCATE tndsService;

LOAD DATA
FROM
    S3 's3-eu-west-2://fdbt-tnds-data-test/servicereport.csv' REPLACE INTO TABLE tndsService FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '' LINES TERMINATED BY '\n' IGNORE 1 lines (
        @rowId,
        @regionCode,
        @regionOperatorCode,
        @serviceCode,
        @lineName,
        @description,
        @startDate,
        @nocCode
    )
SET
    regionCode = @regionCode,
    regionOperatorCode = @regionOperatorCode,
    serviceCode = @serviceCode,
    lineName = @lineName,
    description = @description,
    startDate = @startDate,
    nocCode = @nocCode;

SET
    FOREIGN_KEY_CHECKS = 1;