-- phpMyAdmin SQL Dump
-- version 3.3.7
-- http://www.phpmyadmin.net
--
-- 主機: dbhome.cs.nctu.edu.tw
-- 建立日期: Jun 25, 2016, 08:00 PM
-- 伺服器版本: 5.6.24
-- PHP 版本: 5.3.29

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫: `ycchen0216023_cs`
--
CREATE DATABASE `ycchen0216023_cs` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ycchen0216023_cs`;

-- --------------------------------------------------------

--
-- 資料表格式： `calendar`
--

DROP TABLE IF EXISTS `calendar`;
CREATE TABLE IF NOT EXISTS `calendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `token` varchar(255) CHARACTER SET utf8 NOT NULL,
  `refreshtoken` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- 列出以下資料庫的數據： `calendar`
--

INSERT INTO `calendar` (`id`, `username`, `token`, `refreshtoken`) VALUES
(1, 'test', 'ya29.bgIycoVC9Fvco4oTADXujQjtzbSZm0SP1r9xC5UMLdI6hmG8TRCFR4CGQMuz-B9-Nd-2Pg', '1/jz7N7fHnp9U0ztJexSSuKbu2qdhSwE7Hh9sWGtakK_tIgOrJDtdun6zK6XiATCKT'),
(2, 'S.W.', 'ya29.bgLiOI7cvftjRadpSmbPd146SkXYoVoRgEW3FJmQNErc9Yp8k70Ea3PAx3UnlSvdZqDX', '1/xoLOqpwXoBYjDe8-7WT_Pa80lVzbKHf5SVuN99_RaMVIgOrJDtdun6zK6XiATCKT'),
(3, 'nctu.netpro15.1@gmail.com', 'ya29.cAJgIEzlyJPb49bmg6ezqXy9i2Z9OcH6_9TdHMbsucf0pVtByUwWn9QForwDinrgLA5C', '1/9NaUEUre6Xwn7n-ZZhFQngwOnwlv4hiWO-Ywrg76TVo');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
