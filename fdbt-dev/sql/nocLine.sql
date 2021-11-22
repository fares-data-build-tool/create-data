/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `nocLine` WRITE;

TRUNCATE TABLE `nocLine`;

INSERT INTO `nocLine` (nocLineNo,nocCode,pubNm,refNm,licence,mode,tlRegOwn,ebsrAgent,lo,sw,wm,wa,yo,nw,ne,sc,se,ea,em,ni,nx,megabus,newBharat,terravision,ncsd,easybus,yorksRt,travelEnq,comment,auditDate,auditEditor,auditComment,duplicate,dateCeased,cessationComment) VALUES
 (9478,'BLAC','Blackpool Transport','Blackpool Transport','PC0001061','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'BLAC',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-08 00:00:00','Amy Brown','Replaced Trapeze code with new local code','OK',NULL,NULL)
,(9845,'DCCL','Durham County Council','Durham County Council','PB1076995','Bus','NE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'DCC',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2013-08-30 00:00:00','John Prince','Replace blank PublicName with ReferenceName','OK',NULL,NULL)
,(9988,'ERDG','East Riding Of Yorkshire Council','Fleet Management & Passenger Transport Unit','PB0004001','Bus','YO',NULL,NULL,NULL,NULL,NULL,'ERYC',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2011-07-15 00:00:00','John Prince','Add YO code of ERYC','OK',NULL,NULL)
,(10327,'HCTY','Connexions Buses','Harrogate Coach Travel Ltd','PB1003659','Bus','YO',NULL,NULL,NULL,NULL,NULL,'HG',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'HG',NULL,NULL,'2011-08-18 00:00:00','J Prince','Added for different Trading Name Harr Coach Tr','OK',NULL,NULL)
,(10754,'MCTR','Manchester Community Transport','Manchester Community Transport','PC0005332','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'WML',NULL,NULL,NULL,NULL,'MCTR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-09 00:00:00','Amy Brown','Replaced Trapeze code with new local code','OK',NULL,NULL)
,(10755,'MCTR','Manchester Community Transport','Manchester Community Transport','PC0005332','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'MCT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-09 00:00:00','Amy Brown','Replaced Trapeze code with new local code','Dup',NULL,NULL)
,(12298,'MCTR','Manchester Community Transport',NULL,'PC0005332','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'MCTR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
,(11036,'NWBT','Pilkingtonbus',NULL,'PC1089172','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'BTL',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-09 00:00:00','Amy Brown','Replaced Trapeze code with new local code','OK',NULL,NULL)
,(11037,'NWBT','Pilkingtonbus',NULL,'PC1089172','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'NWBT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-09 00:00:00','Amy Brown','Replaced Trapeze code with new local code','Dup',NULL,NULL)
,(11121,'PBLT','Preston Bus','Preston Bus Ltd, formerly Stagecoach in Preston','PC0001777','Bus','NW',NULL,NULL,NULL,NULL,NULL,'PBL','PBT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-08 00:00:00','Amy Brown','Replaced Trapeze code with new local code','OK',NULL,'Unceased 22/5/15')
,(12190,'PBLT','Preston Bus','Preston Bus Ltd, formerly Stagecoach in Preston','PC0001777','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'2914',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-30 00:00:00','Amy Brown','Added NW local code',NULL,NULL,NULL)
,(12301,'PBLT','Preston Bus',NULL,'PC0001777','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'PBLT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
,(11803,'LNUD','The Blackburn Bus Company','The Blackburn Bus Company','PB0004246','Bus','YO',NULL,NULL,NULL,NULL,NULL,'TLC',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TLC',NULL,NULL,'2010-03-31 00:00:00','Mark Fell','Intial NOC Build','OK',NULL,NULL)
,(12278,'VISB','Vision Bus','Vision Bus','PC1134111','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'VIS',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2017-08-29 00:00:00','Amy Brown','Added for Ian Barratt',NULL,NULL,NULL)
,(12284,'VISB','Vision Bus','Vision Bus','PC1134111','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'VBL',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2017-10-09 00:00:00','Amy Brown','Added new local code for Michelle Smith',NULL,NULL,NULL)
,(12306,'VISB','Vision Bus',NULL,'PC1134111','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'VISB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
,(12330,'VISB','Vision Bus','Vision Bus','PC1134111','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'BLB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2018-04-04 00:00:00','Amy Brown','Added new local code for Ian Barratt',NULL,NULL,NULL)
,(11950,'WBTR','Warrington''s Own Buses','Warrington Borough Transport','PC0001977','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'WBT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-08 00:00:00','Amy Brown','Replaced Trapeze code with new local code','OK',NULL,NULL)
,(11951,'WBTR','Warrington''s Own Buses','Warrington Borough Transport','PC0001977','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'NW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-08 00:00:00','Amy Brown','Replaced Trapeze code with new local code','Dup',NULL,NULL)
,(11952,'WBTR','Warrington''s Own Buses','Warrington Borough Transport','PC0001977','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'WBTR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-08 00:00:00','Amy Brown','Replaced Trapeze code with new local code','Dup',NULL,NULL)
,(11953,'WBTR','Warrington''s Own Buses','Warrington Borough Transport','PC0001977','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'2266',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-19 00:00:00','Amy Brown','Added local code back in','Dup',NULL,NULL)
,(11954,'WBTR','Warrington''s Own Buses','Warrington Borough Transport','PC0001977','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'2802',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-27 00:00:00','Amy Brown','Added NW code','Dup',NULL,NULL)
,(11955,'WBTR','Warrington''s Own Buses','Warrington Borough Transport','PC0001977','Bus','NW',NULL,NULL,NULL,NULL,NULL,NULL,'WOB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-06-03 00:00:00','Amy Brown','Replaced Trapeze code with new local code','Dup',NULL,NULL);

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
