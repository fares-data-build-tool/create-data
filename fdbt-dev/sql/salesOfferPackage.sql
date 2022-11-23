/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `salesOfferPackage` WRITE;

TRUNCATE TABLE `salesOfferPackage`;

INSERT INTO `salesOfferPackage` (name,description, purchaseLocations, paymentMethods, ticketFormats, nocCode) 
VALUES
('cash','Purchase method automatically created' , 'onBoard', 'cash', 'paperTicket', 'BLAC'),
('card', 'Another purchase method automatically created', 'onBoard,online', 'debitCard,creditCard', 'mobileApp,smartCard', 'BLAC');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

