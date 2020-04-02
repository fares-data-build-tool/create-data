/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `tndsService` WRITE;

TRUNCATE TABLE tndsService;

INSERT INTO `tndsService` (`nocCode`, `startDate`, `regionCode`, `regionOperatorCode`, `serviceCode`, `lineName`, `description`)
VALUES
	('IWCB', '2020-02-25', 'EA', '712CS', '12-200-_-y08-8', '200', 'Mildenhall - Beck Row - Lakenheath - Brandon - Thetford'),
	('IWCB', '2020-02-25', 'EA', '712CS', '12-84-_-y08-8', '84', 'Thetford - Barnham - Ingham - Bury St Edmunds'),
	('IWCB', '2020-02-25', 'EA', '712CS', '12-86-_-y08-8', '86', 'Brandon - Thetford - Bury St Edmunds'),
	('RBCL', '2020-02-25', 'EA', '123CS', '17-9-_-y08-1', '9', 'Kenton - Worlingworth - Dennington - Lowestoft'),
	('RBCL', '2020-02-25', 'EA', '123CS', '11-113-_-y08-3', '113', 'Eye - Mendlesham - Ipswich');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
