/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `tndsOperatorService` WRITE;

TRUNCATE TABLE tndsOperatorService;

INSERT INTO `tndsOperatorService` (`id`, `nocCode`, `lineName`, `startDate`, `operatorShortName`, `serviceDescription`)
VALUES
	(1, 'IWCB', '200', '2020-02-25', 'Infinity Buses', 'Mildenhall - Beck Row - Lakenheath - Brandon - Thetford'),
	(2, 'IWCB', '84', '2020-02-25', 'Infinity Buses', 'Thetford - Barnham - Ingham - Bury St Edmunds'),
	(3, 'IWCB', '86', '2020-02-25', 'Infinity Buses', 'Brandon - Thetford - Bury St Edmunds'),
	(4, 'RBCL', '9', '2020-02-25', 'Rubbish Buses', 'Kenton - Worlingworth - Dennington - Lowestoft'),
	(5, 'RBCL', '113', '2020-02-25', 'Rubbish Buses', 'Eye - Mendlesham - Ipswich');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
