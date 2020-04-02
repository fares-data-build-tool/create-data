/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `tndsJourneyPatternSection` WRITE;

TRUNCATE TABLE tndsJourneyPatternSection;

INSERT INTO `tndsJourneyPatternSection` (`id`, `operatorServiceId`)
VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 2),
	(5, 2),
	(6, 3),
	(7, 4),
	(8, 5);

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
