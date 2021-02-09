def public_name_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE nocPublicName;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/PublicName.csv' REPLACE INTO TABLE nocPublicName FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( pubNmId, operatorPublicName, pubNmQual, ttrteEnq, fareEnq, lostPropEnq, disruptEnq, complEnq, twitter, facebook, linkedin, youtube, changeDate, changeAgent, changeComment, ceasedDate, dataOwner, website );", "SET FOREIGN_KEY_CHECKS = 1;"]


def noc_table_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE nocTable;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/NOCTable.csv' REPLACE INTO TABLE nocTable FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( nocCode, operatorPublicName, vosaPsvLicenseName, opId, pubNmId, nocCdQual, changeDate, changeAgent, changeComment, dateCeased, dataOwner );", "SET FOREIGN_KEY_CHECKS = 1;"]


def noc_lines_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE nocLine;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/NOCLines.csv' REPLACE INTO TABLE nocLine FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( nocLineNo, nocCode, pubNm, refNm, licence, mode, tlRegOwn, ebsrAgent, lo, sw, wm, wa, yo, nw, ne, sc, se, ea, em, ni, nx, megabus, newBharat, terravision, ncsd, easybus, yorksRt, travelEnq, comment, auditDate, auditEditor, auditComment, duplicate, dateCeased, cessationComment );", "SET FOREIGN_KEY_CHECKS = 1;"]


def stops_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE naptanStop;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/Stops.csv' REPLACE INTO TABLE naptanStop FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\r\\n' IGNORE 1 lines ( atcoCode, naptanCode, plateCode, cleardownCode, commonName, commonNameLang, shortCommonName, shortCommonNameLang, landmark, landmarkLang, street, streetLang, crossing, crossingLang, indicator, indicatorLang, bearing, nptgLocalityCode, localityName, parentLocalityName, grandParentLocalityName, town, townLang, suburb, suburbLang, localityCentre, gridType, easting, northing, longitude, latitude, stopType, busStopType, timingStatus, defaultWaitTime, notes, notesLang, administrativeAreaCode, creationDateTime, modificationDateTime, revisionNumber, modification, status );", "SET FOREIGN_KEY_CHECKS = 1;"]
