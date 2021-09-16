DROP TABLE IF EXISTS products;

CREATE TABLE products(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nocCode` varchar(10) NOT NULL,
    `matchingJsonLink` varchar(255) NOT NULL,
    `lineId` varchar(100) NOT NULL,
    `dateModified` datetime NOT NULL,
    `fareType` varchar(20) NOT NULL,
    `startDate` date NOT NULL,
    `endDate` date NOT NULL,
    INDEX idx_nocCode (nocCode),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET = utf8;
