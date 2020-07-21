/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS tndsJourneyPatternLink;

CREATE TABLE tndsJourneyPatternLink(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `journeyPatternId` int(11) NOT NULL,
    `fromAtcoCode` varchar(255) NOT NULL,
    `fromTimingStatus` varchar(255) DEFAULT NULL,
    `toAtcoCode` varchar(255) NOT NULL,
    `toTimingStatus` varchar(255) DEFAULT NULL,
    `runtime` varchar(255) DEFAULT NULL,
    `orderInSequence` int(11) NOT NULL,
    INDEX idx_journeyPatternId (journeyPatternId),
    CONSTRAINT fk_tndsJourneyPatternLink_tndsJourneyPattern_id FOREIGN KEY (journeyPatternId) REFERENCES tndsJourneyPattern(id),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;