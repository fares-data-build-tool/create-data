DROP TABLE IF EXISTS tndsJourneyPatternSection;

CREATE TABLE tndsJourneyPatternSection(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `operatorServiceId` int(11) NOT NULL,
    INDEX idx_operatorServiceId (operatorServiceId),
    CONSTRAINT fk_tndsJourneyPatternSection_tndsOperatorService_id FOREIGN KEY (operatorServiceId) REFERENCES tndsOperatorService(id),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;