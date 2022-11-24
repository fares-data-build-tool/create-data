/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `passengerType` WRITE;

TRUNCATE TABLE `passengerType`;

INSERT INTO `passengerType` (name,contents,isGroup,nocCode) 
VALUES
('Small People', '{"id":"","passengerType":"child","ageRangeMin":"","ageRangeMax":"18"}', 0, 'BLAC'),
('Test Students', '{"id":"","passengerType":"student","ageRangeMin":"","ageRangeMax":"","proofDocuments":["studentCard"]}', 0, 'BLAC'),
('Big People', '{"id":"","passengerType":"adult","ageRangeMin":"","ageRangeMax":""}', 0, 'BLAC'),
('Test Group', '{"name":"Test Group","maxGroupSize":"6","companions":[{"id":1,"name":"Small People","minNumber":"","maxNumber":"4"},{"id":2,"name":"Test Students","minNumber":"2","maxNumber":"3"}]}', 1, 'BLAC');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
