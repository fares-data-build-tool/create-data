/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
LOCK TABLES `nocTable` WRITE;

TRUNCATE TABLE `nocTable`;

INSERT INTO `nocTable` (nocCode,operatorPublicName,vosaPsvLicenseName,opId,pubNmId,nocCdQual,changeDate,changeAgent,changeComment,dateCeased,dataOwner) VALUES
 ('BLAC','Blackpool Transport','Blackpool Transport Services Ltd',135742,93427,NULL,NULL,NULL,NULL,NULL,NULL)
,('DCCL','Durham County Council','Durham County Council',136214,93907,NULL,NULL,NULL,NULL,NULL,NULL)
,('ERDG','East Riding Of Yorkshire Council','East Riding Of Yorkshire Council',136225,94088,NULL,NULL,NULL,NULL,NULL,NULL)
,('HCTY','Connexions Buses','Harrogate Coach Travel Ltd',136580,94286,NULL,NULL,NULL,NULL,NULL,NULL)
,('MCTR','Manchester Community Transport','Manchester Community Transport Limited',137055,94717,NULL,NULL,NULL,NULL,NULL,NULL)
,('MCTR2','Manchester Community Transport 2','Manchester Community Transport 2 Limited',137056,94718,NULL,NULL,NULL,NULL,NULL,NULL)
,('MCTR3','Manchester Community Transport 3','Manchester Community Transport 3 Limited',137057,94719,NULL,NULL,NULL,NULL,NULL,NULL)
,('NWBT','Pilkingtonbus','Boomerang Travel Ltd',135752,94554,NULL,NULL,NULL,NULL,NULL,NULL)
,('PBLT','Preston Bus','Preston Bus Ltd',137430,95086,NULL,NULL,NULL,NULL,NULL,NULL)
,('LNUD','The Blackburn Bus Company','The Blackburn Bus Company',137812,95662,NULL,NULL,NULL,NULL,NULL,NULL)
,('VISB','Vision Bus',NULL,138244,96066,NULL,NULL,NULL,NULL,NULL,NULL)
,('WBTR','Warrington''s Own Buses','Warrington Borough Transport Ltd',138008,94889,NULL,NULL,NULL,NULL,NULL,NULL);

UNLOCK TABLES;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
