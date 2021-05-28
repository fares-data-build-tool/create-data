SET
    FOREIGN_KEY_CHECKS = 0;

TRUNCATE naptanStop;

LOAD DATA
FROM
    S3 's3-eu-west-2://fdbt-naptan-data-test/Stops.csv' REPLACE INTO TABLE naptanStop FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 lines (
        atcoCode,
        naptanCode,
        plateCode,
        cleardownCode,
        commonName,
        commonNameLang,
        shortCommonName,
        shortCommonNameLang,
        landmark,
        landmarkLang,
        street,
        streetLang,
        crossing,
        crossingLang,
        indicator,
        indicatorLang,
        bearing,
        nptgLocalityCode,
        localityName,
        parentLocalityName,
        grandParentLocalityName,
        town,
        townLang,
        suburb,
        suburbLang,
        localityCentre,
        gridType,
        easting,
        northing,
        longitude,
        latitude,
        stopType,
        busStopType,
        timingStatus,
        defaultWaitTime,
        notes,
        notesLang,
        administrativeAreaCode,
        creationDateTime,
        modificationDateTime,
        revisionNumber,
        modification,
        status
    );

SET
    FOREIGN_KEY_CHECKS = 1;