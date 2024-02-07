/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS vehicleJourneys;

CREATE TABLE vehicleJourneys(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `vehicleJourneyCode` varchar(255),
    `serviceRef` varchar(50),
    `lineRef` varchar(50),
    `journeyPatternRef` varchar(50),
    INDEX idx_noc (noc),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;