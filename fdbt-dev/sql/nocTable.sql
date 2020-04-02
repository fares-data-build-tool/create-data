/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `nocTable` WRITE;

TRUNCATE TABLE nocTable;

INSERT INTO `nocTable` (`nocCode`, `operatorPublicName`, `vosaPsvLicenseName`, `opId`, `pubNmId`, `nocCdQual`, `changeDate`, `changeAgent`, `changeComment`, `dateCeased`, `dataOwner`)
VALUES
	('IWCB', 'Infinity Buses', 'Infinity Works Consulting Buses Ltd', '135427', '93089', '', '', '', '', '', ''),
	('RBCL', 'Rubbish Buses', 'Rubbish Bus Company Ltd', '138133', '95943', '', '', '', '', '', '');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
