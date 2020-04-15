/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS tndsJourneyPattern;

CREATE TABLE tndsJourneyPattern(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `operatorServiceId` int(11) NOT NULL,
    `destinationDisplay` varchar(255) DEFAULT NULL,
    `direction` varchar(50) DEFAULT NULL,
    INDEX idx_operatorServiceId (operatorServiceId),
    CONSTRAINT fk_tndsJourneyPattern_tndsOperatorService_id FOREIGN KEY (operatorServiceId) REFERENCES tndsOperatorService(id),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;