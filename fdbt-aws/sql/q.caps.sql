/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS caps;

CREATE TABLE caps(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `noc` varchar(255) NOT NULL,
    `contents` text NOT NULL,
    `isExpiry` boolean NOT NULL,
    INDEX idx_noc (noc),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;