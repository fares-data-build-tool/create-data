DROP TABLE IF EXISTS tndsJourneyPatternLink;

CREATE TABLE tndsJourneyPatternLink(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `journeyPatternSectionId` int(11) NOT NULL,
    `fromAtcoCode` varchar(255) NOT NULL,
    `fromTimingStatus` varchar(255) DEFAULT NULL,
    `toAtcoCode` varchar(255) NOT NULL,
    `toTimingStatus` varchar(255) DEFAULT NULL,
    `runtime` varchar(255) DEFAULT NULL,
    `order` int(11) NOT NULL,
    INDEX idx_journeyPatternSectionId (journeyPatternSectionId),
    CONSTRAINT fk_tndsJourneyPatternLink_tndsJourneyPatternSection_id FOREIGN KEY (journeyPatternSectionId) REFERENCES tndsJourneyPatternSection(id),
    CONSTRAINT fk_tndsJourneyPatternLink_fromAtcoCode_naptanStop_atcoCode FOREIGN KEY (fromAtcoCode) REFERENCES naptanStop(atcoCode),
    CONSTRAINT fk_tndsJourneyPatternLink_toAtcoCode_naptanStop_atcoCode FOREIGN KEY (toAtcoCode) REFERENCES naptanStop(atcoCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;