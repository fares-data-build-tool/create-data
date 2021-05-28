/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS salesOfferPackage;

CREATE TABLE salesOfferPackage(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nocCode` varchar(255) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    `purchaseLocations` varchar(255) DEFAULT NULL,
    `paymentMethods` varchar(255) DEFAULT NULL,
    `ticketFormats` varchar(255) DEFAULT NULL,
    INDEX idx_nocCode (nocCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;