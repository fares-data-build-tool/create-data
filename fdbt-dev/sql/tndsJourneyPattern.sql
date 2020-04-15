/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `tndsJourneyPattern` WRITE;

TRUNCATE TABLE tndsJourneyPattern;

INSERT INTO `tndsJourneyPattern` (`id`, `operatorServiceId`, `destinationDisplay`, `direction`)
VALUES
	(1, 1, 'Leeds - Sheffield', 'outbound'),
	(2, 1, 'Sheffield - Leeds', 'inbound'),
	(3, 1, 'Hartlepool - Durham', 'outbound'),
	(4, 2, 'Leeds - Huddersfield', 'outbound'),
	(5, 2, 'Leeds - Huddersfield Bus Station', 'outbound'),
	(6, 3, 'Leeds - York', 'outbound'),
	(7, 4, 'Hartlepool - Middlesbrough', 'outbound'),
	(8, 5, 'Leeds - Wakefield', 'outbound');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
