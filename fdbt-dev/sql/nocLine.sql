/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `nocLine` WRITE;

TRUNCATE TABLE nocLine;

INSERT INTO `nocLine` (`nocLineNo`, `nocCode`, `pubNm`, `refNm`, `licence`, `mode`, `tlRegOwn`, `ebsrAgent`, `lo`, `sw`, `wm`, `wa`, `yo`, `nw`, `ne`, `sc`, `se`, `ea`, `em`, `ni`, `nx`, `megabus`, `newBharat`, `terravision`, `ncsd`, `easybus`, `yorksRt`, `travelEnq`, `comment`, `auditDate`, `auditEditor`, `auditComment`, `duplicate`, `dateCeased`, `cessationComment`)
VALUES
	('9080', 'IWCB', 'Infinity Buses', 'Infinity Buses (ATOC)', '', 'Bus', 'Admin', '', '', '', '=AW', '=AW', '', '', 'AW', '', '=AW', '=AW', '=AW', '', '', '', '', '', '', '', '', '', '', '2018-11-06 00:00:00', 'Amy Brown', 'Updated public name', 'OK', '', ''),
	('9081', 'RBCL', 'Rubbish Buses', 'rbc (ATOC)', '', 'Bus', 'Admin', '', '', '', '=CC', '=CC', '', '', 'CC', '', '=CC', '=CC', '=CC', '', '', '', '', '', '', '', '', '', '', '2010-03-31 00:00:00', 'Mark Fell', 'Intial NOC Build', 'OK', '', '');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
