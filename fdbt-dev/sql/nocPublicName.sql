/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `nocPublicName` WRITE;

TRUNCATE TABLE `nocPublicName`;

INSERT INTO `nocPublicName` (pubNmId,operatorPublicName,pubNmQual,ttrteEnq,fareEnq,lostPropEnq,disruptEnq,complEnq,twitter,facebook,linkedin,youtube,changeDate,changeAgent,changeComment,ceasedDate,dataOwner,website) VALUES
 (93427,'Blackpool Transport',NULL,'enquiries@blackpooltransport.com','01253 473001',NULL,NULL,'Rigby Road, Blackpool FY1 5DD','@BPL_Transport',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'www.blackpooltransport.com#http://www.blackpooltransport.com#')
,(93907,'Durham County Council',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
,(94088,'East Riding Of Yorkshire Council',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
,(94286,'Connexions Buses',NULL,'craig@connexionsbuses.com','01423339600',NULL,NULL,'Unit 3, South Field Lane, Tockwith, York YO26 7QP','@connexionsbuses',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#http://www.connexionsbuses.com/#')
,(94717,'Manchester Community Transport',NULL,'info@manct.org','01619469255',NULL,NULL,NULL,'@mct_travel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#http://www.manct.org/#')
,(94554,'Pilkingtonbus',NULL,'pilkingtonbus@live.co.uk','01254237083',NULL,NULL,'Argyle Street, Accrington, Lancashire BB5 1DQ','@pilkingtonbus',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#http://pilkingtonbus.com/#')
,(95086,'Preston Bus',NULL,'customer.care@prestonbus.co.uk','01772253671',NULL,NULL,'221 Deepdale Road, Preston PR1 6NY','@PrestonBus',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#http://www.prestonbus.co.uk/#')
,(95662,'The Blackburn Bus Company',NULL,'enquiries@lnud.co.uk','01274727811',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#http://www.lnud.co.uk/#')
,(96066,'Vision Bus',NULL,'info@visionbus.co.uk','01204468288',NULL,NULL,'Blackrod Interchange, Station Road, Blackrod, Bolton BL6 5JE','@VisionBus',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#https://www.visionbus.co.uk/#')
,(94889,'Warrington''s Own Buses',NULL,'travelcentre@warringtonsownbuses.co.uk','01925634296',NULL,NULL,'Wilderspool Causeway, Warrington, Cheshire WA4 6PT','@WarringtonBuses',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'#http://warringtonsownbuses.co.uk/#');

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
