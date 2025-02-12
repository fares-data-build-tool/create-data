/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `products` WRITE;

TRUNCATE TABLE `products`;

INSERT INTO `products` (nocCode,matchingJsonLink,lineId,dateModified,fareType,startDate,endDate,servicesRequiringAttention,fareTriangleModified,incomplete)
VALUES
('BLAC', 'BLAC/single/BLAC28ac10f0_1669718716180.json', '4YyoI0', '2022-11-29 10:45:16', 'single', '2020-02-01 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false),
('BLAC', 'BLAC/return/BLAC06cacdb0_1669718799461.json', '4YyoI0', '2022-11-29 10:46:40', 'return', '2020-02-01 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false),
('BLAC', 'BLAC/flatFare/BLAC510a23b9_1669718842930.json', '', '2022-11-29 10:47:23', 'flatFare', '2020-02-01 00:00:00', '2045-12-01 23:59:59', NULL, NULL, false),
('BLAC', 'BLAC/period/BLAC3ac061cd_1669718965369.json', '', '2022-11-29 10:49:25', 'period', '1999-03-01 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false),
('BLAC', 'BLAC/flatFare/BLACb3f31902_1669719006084.json', '', '2022-11-29 10:50:06', 'flatFare', '2020-02-01 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false),
('BLAC', 'BLAC/multiOperator/BLACdc15ca79_1669719059910.json', '', '2022-11-29 10:51:00', 'multiOperator', '2020-03-12 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false),
('BLAC', 'BLAC/multiOperatorExt/BLAC38f1952d_1738684176462.json', '', '2022-11-29 10:51:00', 'multiOperatorExt', '2020-03-12 00:00:00', '0000-00-00 00:00:00', NULL, NULL, true),
('BLAC', 'BLAC/multiOperatorExt/BLACc90fe5a8_1738686874177.json', '', '2022-11-29 10:51:00', 'multiOperatorExt', '2020-03-12 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false),
('BLAC', 'BLAC/period/BLAC84085f49_1669719096560.json', '', '2022-11-29 10:51:37', 'period', '2020-01-01 00:00:00', '0000-00-00 00:00:00', NULL, NULL, false);

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
