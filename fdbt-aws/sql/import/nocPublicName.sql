SET
    FOREIGN_KEY_CHECKS = 0;

TRUNCATE nocPublicName;

LOAD DATA
FROM
    S3 's3-eu-west-2://fdbt-noc-data-test/PublicName.csv' REPLACE INTO TABLE nocPublicName FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '' LINES TERMINATED BY '\n' IGNORE 1 lines (
        pubNmId,
        operatorPublicName,
        pubNmQual,
        ttrteEnq,
        fareEnq,
        lostPropEnq,
        disruptEnq,
        complEnq,
        twitter,
        facebook,
        linkedin,
        youtube,
        changeDate,
        changeAgent,
        changeComment,
        ceasedDate,
        dataOwner,
        website
    );

SET
    FOREIGN_KEY_CHECKS = 1;