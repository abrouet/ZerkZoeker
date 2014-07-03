-- MySQL dump 10.14  Distrib 5.5.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: LEIEDAL
-- ------------------------------------------------------
-- Server version	5.5.37-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DATA`
--

DROP TABLE IF EXISTS `DATA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DATA` (
  `id` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
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
  `birthDate` date DEFAULT NULL,
  UNIQUE KEY `id` (`id`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;