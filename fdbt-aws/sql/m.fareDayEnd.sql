DROP TABLE IF EXISTS fareDayEnd;

CREATE TABLE fareDayEnd(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nocCode` varchar(255) NOT NULL,
    `time` char(4) NOT NULL,
    INDEX idx_nocCode (nocCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;
