DROP TABLE IF EXISTS nocTable;

CREATE TABLE nocTable(
    `nocCode` varchar(255) NOT NULL,
    `operatorPublicName` varchar(255) DEFAULT NULL,
    `vosaPsvLicenseName` varchar(255) DEFAULT NULL,
    `opId` varchar(255) DEFAULT NULL,
    `pubNmId` varchar(255) DEFAULT NULL,
    `nocCdQual` varchar(255) DEFAULT NULL,
    `changeDate` varchar(255) DEFAULT NULL,
    `changeAgent` varchar(255) DEFAULT NULL,
    `changeComment` varchar(255) DEFAULT NULL,
    `dateCeased` varchar(255) DEFAULT NULL,
    `dataOwner` varchar(255) DEFAULT NULL,
    INDEX idx_nocCode (nocCode),
    INDEX idx_pubNmId (pubNmId)
) ENGINE = InnoDB CHARACTER SET = utf8;