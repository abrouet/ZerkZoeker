-- MySQL dump 10.14  Distrib 5.5.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: LEIEDAL
-- ------------------------------------------------------
-- Server version	5.5.37-MariaDB-log

--
-- Table structure for table `DATA`
--

DROP TABLE IF EXISTS `DATA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DATA` (
  `id` varchar(20) NOT NULL,
  `code` varchar(20) NOT NULL,
  `municipality` varchar(50) NOT NULL,
  `cemeteryCode` varchar(50) NOT NULL,
  `cemetery` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `dim1` varchar(50) NOT NULL,
  `dim2` varchar(50) NOT NULL,
  `dim3` varchar(50) NOT NULL,
  `dim4` varchar(20) DEFAULT NULL,
  `familyName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `dateOfDeath` date DEFAULT NULL,
  `placeOfDeath` varchar(50) DEFAULT NULL,
  `birthPlace` varchar(50) DEFAULT NULL,
  `birthDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;