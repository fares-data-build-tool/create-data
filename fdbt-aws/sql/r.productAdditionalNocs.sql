/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

DROP TABLE IF EXISTS productAdditionalNocs;

CREATE TABLE productAdditionalNocs(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `productId` int(11) NOT NULL,
    `additionalNocCode` varchar(10) NOT NULL,
    `incomplete` BOOLEAN NOT NULL,
    INDEX idx_additionalNocCode (additionalNocCode),
    PRIMARY KEY (`id`),
    CONSTRAINT fk_productAdditionalNocs_products_id FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
