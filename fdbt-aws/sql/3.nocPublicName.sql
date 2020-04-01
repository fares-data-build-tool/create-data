/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS nocPublicName;

CREATE TABLE nocPublicName(
    `pubNmId` varchar(255) NOT NULL,
    `operatorPublicName` varchar(255) DEFAULT NULL,
    `pubNmQual` varchar(255) DEFAULT NULL,
    `ttrteEnq` varchar(255) DEFAULT NULL,
    `fareEnq` varchar(255) DEFAULT NULL,
    `lostPropEnq` varchar(255) DEFAULT NULL,
    `disruptEnq` varchar(255) DEFAULT NULL,
    `complEnq` varchar(255) DEFAULT NULL,
    `twitter` varchar(255) DEFAULT NULL,
    `facebook` varchar(255) DEFAULT NULL,
    `linkedin` varchar(255) DEFAULT NULL,
    `youtube` varchar(255) DEFAULT NULL,
    `changeDate` varchar(255) DEFAULT NULL,
    `changeAgent` varchar(255) DEFAULT NULL,
    `changeComment` varchar(255) DEFAULT NULL,
    `ceasedDate` varchar(255) DEFAULT NULL,
    `dataOwner` varchar(255) DEFAULT NULL,
    `website` varchar(255) DEFAULT NULL,
    INDEX idx_pubNmId (pubNmId),
    CONSTRAINT fk_nocPublicName_nocTable_pubNmId FOREIGN KEY (pubNmId) REFERENCES nocTable(pubNmId)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;