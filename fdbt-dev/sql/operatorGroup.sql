/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `operatorGroup` WRITE;

TRUNCATE TABLE `operatorGroup`;

INSERT INTO `operatorGroup` (name, contents, nocCode) 
VALUES
('test', '[{"nocCode":"LNUD","name":"The Blackburn Bus Company"},{"nocCode":"NWBT","name": "Pilkingtonbus"}]', 'BLAC');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

