DROP TABLE IF EXISTS operatorDetails;

CREATE TABLE operatorDetails(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nocCode` varchar(10) NOT NULL,
    `contents` text NOT NULL,
    INDEX idx_nocCode (nocCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;
