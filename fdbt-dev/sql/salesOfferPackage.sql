/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

LOCK TABLES `salesOfferPackage` WRITE;

TRUNCATE TABLE `salesOfferPackage`;

INSERT INTO `salesOfferPackage` (
        nocCode,
        name,
        description,
        purchaseLocation,
        paymentMethod,
        ticketFormat
    )
VALUES (
        'BLAC',
        'Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop',
        'A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop',
        'OnBus,TicketMachine,Shop',
        'Cash,Card',
        'Paper,Mobile'
    );

UNLOCK TABLES;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
