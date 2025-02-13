/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `productAdditionalNocs` WRITE;

TRUNCATE TABLE `productAdditionalNocs`;

INSERT INTO `productAdditionalNocs` (productId,additionalNocCode,incomplete)
VALUES
(7, 'LNUD', true),
(7, 'NWBT', true),
(8, 'LNUD', false),
(8, 'NWBT', false);

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
