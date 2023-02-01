DROP TABLE IF EXISTS caps;

CREATE TABLE caps(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `noc` varchar(10) NOT NULL,
    `contents` text NOT NULL,
    `isExpiry` int(11) NOT NULL,
    INDEX idx_noc (noc),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;
