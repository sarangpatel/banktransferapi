-- Adminer 4.7.6 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `balance` float NOT NULL DEFAULT '0',
  `type` enum('Savings','Current','BasicSavings') COLLATE utf8_unicode_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_id` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `accounts` (`id`, `user_id`, `account_id`, `balance`, `type`, `created_on`, `is_active`) VALUES
(1,	1,	112,	994200,	'Savings',	'2020-12-14 12:44:52',	1),
(2,	1,	113,	16400,	'BasicSavings',	'2020-12-14 12:45:20',	1),
(3,	2,	114,	1000000,	'Savings',	'2020-12-14 12:44:52',	1),
(4,	3,	115,	1000000,	'Savings',	'2020-12-14 12:44:52',	1),
(5,	1,	116,	95600,	'Current',	'2020-12-14 12:45:20',	1),
(6,	5,	117,	1000000,	'Savings',	'2020-12-14 12:44:52',	1),
(7,	6,	118,	1000000,	'Savings',	'2020-12-14 12:44:52',	1),
(9,	2,	119,	40000,	'BasicSavings',	'2020-12-14 12:44:52',	1),
(10,	4,	121,	1000400,	'Savings',	'2020-12-14 12:44:52',	1),
(11,	3,	125,	43400,	'Current',	'2020-12-14 12:44:52',	1);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `users` (`id`, `name`, `created_on`, `is_active`) VALUES
(1,	'Sarang Patel',	'2020-12-14 12:41:20',	1),
(2,	'Krish Kant',	'2020-12-14 12:41:20',	1),
(3,	'Shyam Hai',	'2020-12-14 12:41:22',	1),
(4,	'Niten Kumar',	'2020-12-14 12:41:27',	1),
(5,	'Raman Raghav',	'2020-12-14 12:41:34',	1),
(6,	'Mohit Kumar',	'2020-12-14 12:41:38',	1),
(7,	'Girish Chand Pathak',	'2020-12-14 12:41:48',	1),
(8,	'Mohnish Bahl',	'2020-12-14 12:41:54',	1),
(9,	'Madhav Krishan',	'2020-12-14 12:42:03',	1),
(10,	'Romi Dsouza',	'2020-12-14 12:42:09',	1),
(11,	'Umang Nath',	'2020-12-14 12:42:10',	1),
(12,	'Kriti Singh',	'2020-12-14 12:42:16',	1);

-- 2020-12-14 14:15:57
