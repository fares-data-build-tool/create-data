/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS timeRestriction;

CREATE TABLE timeRestriction(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nocCode` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `contents` text NOT NULL,
    INDEX idx_nocCode (nocCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;