/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS txcOperatorLine;

CREATE TABLE txcOperatorLine(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nocCode` varchar(255) DEFAULT NULL,
    `lineName` varchar(255) DEFAULT NULL,
    `lineId` varchar(255) DEFAULT NULL,
    `startDate` date DEFAULT NULL,
    `operatorShortName` varchar(255) DEFAULT NULL,
    `serviceDescription` varchar(255) DEFAULT NULL,
    `serviceCode` varchar(255) DEFAULT NULL,
    `regionCode` varchar(10) DEFAULT NULL,
    `dataSource` enum('tnds', 'bods') NOT NULL,
    `origin` varchar(255) DEFAULT NULL,
    `destination` varchar(255) DEFAULT NULL,
    INDEX idx_nocCode (nocCode),
    INDEX idx_lineName (lineName),
    INDEX idx_startDate (startDate),
    INDEX idx_dataSource (dataSource),
    CONSTRAINT fk_txcOperatorLine_nocTable_nocCode FOREIGN KEY (nocCode) REFERENCES nocTable(nocCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;