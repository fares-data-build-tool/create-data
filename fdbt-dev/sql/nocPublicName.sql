/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `nocPublicName` WRITE;

TRUNCATE TABLE nocPublicName;

INSERT INTO `nocPublicName` (`pubNmId`, `operatorPublicName`, `pubNmQual`, `ttrteEnq`, `fareEnq`, `lostPropEnq`, `disruptEnq`, `complEnq`, `twitter`, `facebook`, `linkedin`, `youtube`, `changeDate`, `changeAgent`, `changeComment`, `ceasedDate`, `dataOwner`, `website`)
VALUES
	('93089', 'Infinity Buses', '', 'iwcbuses@example.com', '00000 000000', '', '', '78 Wellington Street, Leeds, LS16 6RP', '', '', '', '', '', '', '', '', '', 'www.iwcbus.fake'),
	('95943', 'Rubbish Buses', '', 'rubbishbuses@example.com', '00000 111000', '', '', '123 Rubbish Road, ', '', '', '', '', '', '', '', '', '', 'www.rubbishbus.fake#http://www.rubbishbus.fake#');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
