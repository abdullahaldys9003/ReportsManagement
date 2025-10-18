-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- ظ…ط¶ظٹظپ: 127.0.0.1
-- ظˆظ‚طھ ط§ظ„ط¬ظٹظ„: 23 ط³ط¨طھظ…ط¨ط± 2025 ط§ظ„ط³ط§ط¹ط© 21:48
-- ط¥طµط¯ط§ط± ط§ظ„ط®ط§ط¯ظ…: 12.0.2-MariaDB
-- ظ†ط³ط®ط© PHP: 8.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- ظ‚ط§ط¹ط¯ط© ط¨ظٹط§ظ†ط§طھ: `departments_system`
--

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `alert_checkpoints`
--

CREATE TABLE `alert_checkpoints` (
  `id` int(11) NOT NULL,
  `alert_id` int(11) NOT NULL,
  `checkpoint_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `checkpoints`
--

CREATE TABLE `checkpoints` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `address` varchar(70) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `neighborhoods_id` int(11) NOT NULL,
  `districts_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `department`
--

INSERT INTO `department` (`id`, `department_name`, `address`, `created_at`, `neighborhoods_id`, `districts_id`) VALUES
(1, 'ظ‚ط³ظ… ط¹طµظٹظپط±ط© ', '', '2025-09-02 16:28:23', 1, 1),
(2, 'ظ‚ط³ظ… ط§ظ„ط«ظˆط±ط© ', '', '2025-09-02 16:29:04', 4, 1),
(3, 'ظ‚ط³ظ… ط§ظ„طھط­ط±ظٹط±', '', '2025-09-02 16:30:36', 8, 1),
(4, 'ظ‚ط³ظ… ط§ظ„ط¬ط¨ط¬ط¨', '', '2025-09-02 16:34:23', 13, 2),
(5, 'ظ‚ط³ظ… ط§ظ„ط®ط²ظٹظ…ط©', '', '2025-09-02 16:35:23', 14, 2);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `governorate_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `districts`
--

INSERT INTO `districts` (`id`, `name`, `governorate_id`) VALUES
(1, 'ط§ظ„ظ‚ط§ظ‡ط±ط©', 1),
(2, 'ط¬ط¨ظ„ ط­ط¨ط´ظٹ', 1),
(3, 'ط§ظ„ظ…ط³ط±ط§ط®', 1),
(4, 'ظ…ط¯ظٹظ†ط© طھط¹ط²', 1),
(5, 'ط§ظ„ظ…ط³ط±ط§ط®', 1),
(6, 'ط§ظ„ط´ظ…ط§ظٹطھظٹظ†', 1),
(7, 'ط¬ط¨ظ„ط©', 1),
(8, 'ط­ظٹظپط§ظ†', 1),
(9, 'ظ…ظ‚ط¨ظ†ط©', 1),
(10, 'ط§ظ„ظ…ظˆط§ط³ط·', 1),
(11, 'ط§ظ„ظ…ط¹ط§ظپط±', 1),
(12, 'ط³ط§ظ…ط¹', 1),
(13, 'طµط§ظ„ط©', 1),
(14, 'ظ…ط´ط±ط¹ط© ظˆط­ط¯ظ†ط§ظ†', 1),
(15, 'ط§ظ„ط¹ط§ط±ط¶ط©', 1),
(16, 'ظ…ط³ظˆط±ط©', 1);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `name_full` varchar(110) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `number_phone` varchar(20) NOT NULL,
  `position_type` varchar(60) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `employees`
--

INSERT INTO `employees` (`employee_id`, `name_full`, `username`, `password`, `email`, `number_phone`, `position_type`, `created_at`, `department_id`) VALUES
(2, 'ehabbbb', 'amaarr', 'ammmsmms', 'amarrr@gmail.com', '77', '??????', '2025-08-20 18:59:04', 1),
(8, 'lkfglf', 'gffgf', 'fgfg', 'fgfgf', 'fgfgfggfg', 'gfgfg', '2025-08-30 18:42:26', 1);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `governorates`
--

CREATE TABLE `governorates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `governorates`
--

INSERT INTO `governorates` (`id`, `name`) VALUES
(1, 'طھط¹ط²'),
(2, 'طµظ†ط¹ط§ط، '),
(3, 'ط§ط¨ ');

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `logs_activity`
--

CREATE TABLE `logs_activity` (
  `id_activity` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `table_target` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `id_record` int(11) NOT NULL,
  `action` enum('create','update','delete','login','logout','status_change') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `logs_activity`
--

INSERT INTO `logs_activity` (`id_activity`, `id_user`, `table_target`, `createdAt`, `id_record`, `action`) VALUES
(1, 2, 'ط§ظ„ط¨ظ„ط§ط؛ط§طھ ', '2025-08-21 18:47:52', 2, 'create'),
(2, 2, 'ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ', '2025-08-21 18:49:09', 2, 'create'),
(3, 2, 'ط§ظ„ط¨ظ„ط§ط؛ط§طھ ', '2025-08-21 18:49:09', 13, 'create'),
(5, 2, 'reports', '2025-09-03 19:13:54', 49, 'create'),
(6, 2, 'reports', '2025-09-03 19:14:00', 50, 'create'),
(7, 2, 'reports', '2025-09-13 20:58:47', 57, 'create'),
(8, 2, 'reports', '2025-09-13 20:58:57', 58, 'create'),
(9, 2, 'reports', '2025-09-13 20:59:39', 59, 'create'),
(10, 2, 'reports', '2025-09-13 21:39:28', 60, 'create'),
(11, 2, 'reports', '2025-09-14 07:47:25', 61, 'create'),
(12, 2, 'reports', '2025-09-20 23:33:48', 62, 'create');

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `neighborhoods`
--

CREATE TABLE `neighborhoods` (
  `id` int(11) NOT NULL,
  `name` varchar(15) NOT NULL,
  `district_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `neighborhoods`
--

INSERT INTO `neighborhoods` (`id`, `name`, `district_id`) VALUES
(1, 'ط¹طµظٹظپط±ط©', 1),
(2, 'ط§ظ„ظ‚ط§ظ‡ط±ط©', 1),
(3, 'ط§ظ„ظ…ظٹط¯ط§ظ†', 1),
(4, 'ط§ظ„ط«ظˆط±ط©', 1),
(5, 'ط§ظ„ط³ظ„ط§ظ…', 1),
(6, 'ط§ظ„ط­ط±ظٹط©', 1),
(7, 'ط§ظ„ظˆط­ط¯ط©', 1),
(8, 'ط§ظ„طھط­ط±ظٹط±', 1),
(9, 'ط§ظ„ط´ظ‡ط¯ط§ط،', 1),
(10, 'ط§ظ„ط²ظ‡ط±ط§ط،', 1),
(11, 'ط§ظ„ط§طµط¨ط­ظٹ', 1),
(12, 'ط§ظ„ظ…ط±ظƒط²', 2),
(13, 'ط§ظ„ط¬ط¨ط¬ط¨', 2),
(14, 'ط§ظ„ط®ط²ظٹظ…ط©', 2),
(15, 'ط§ظ„ط³ظ‡ظ„ظٹط©', 2),
(16, 'ط§ظ„ط¹ط§ط±ط¶ط©', 2),
(17, 'ط§ظ„ظ…ط±ظƒط²', 3),
(18, 'ط§ظ„ط¹ط±ط´', 3),
(19, 'ط§ظ„ط®ط¶ط±ط§ط،', 3),
(20, 'ط§ظ„ظ…ظ†طµظˆط±ط©', 3),
(21, 'ط§ظ„ظپط¶ظٹظ„ط©', 3),
(22, 'ط§ظ„ظ…ط±ظƒط²', 4),
(24, 'ط§ظ„ط­ظˆط¨ط§ظ†', 4),
(25, 'ط§ظ„ط®ط¯ظٹط±', 4),
(26, 'ط§ظ„ط±ط²ط§ط¹', 4),
(27, 'ط§ظ„ظ…ط±ظƒط²', 5),
(28, 'ط§ظ„ط¬ط¨ظ„ظٹ', 5),
(29, 'ط§ظ„ط³ظ‡ظ„ظٹ', 5),
(30, 'ط§ظ„ط؛ط±ط¨ظٹ', 5),
(31, 'ط§ظ„ط´ط±ظ‚ظٹ', 5),
(32, 'ط§ظ„ظ…ط±ظƒط²', 6),
(33, 'ط§ظ„ط´ط±ظپ', 6),
(34, 'ط§ظ„ط¸ظ‡ط±', 6),
(35, 'ط§ظ„ظˆط§ط¯ظٹ', 6),
(36, 'ط§ظ„ط¬ط¨ظ„', 6),
(37, 'ط§ظ„ظ…ط±ظƒط²', 7),
(38, 'ط§ظ„ط´ط±ظپ', 7),
(39, 'ط§ظ„ظˆط§ط¯ظٹ', 7),
(40, 'ط§ظ„ط¬ط¨ظ„', 7),
(41, 'ط§ظ„ط³ط§ط­ظ„', 7),
(42, 'ط§ظ„ظ…ط±ظƒط²', 8),
(43, 'ط§ظ„ط´ط±ظپ', 8),
(44, 'ط§ظ„ظˆط§ط¯ظٹ', 8),
(45, 'ط§ظ„ط¬ط¨ظ„', 8),
(46, 'ط§ظ„ط³ط§ط­ظ„', 8),
(47, 'ط§ظ„ظ…ط±ظƒط²', 9),
(48, 'ط§ظ„ط´ط±ظپ', 9),
(49, 'ط§ظ„ظˆط§ط¯ظٹ', 9),
(50, 'ط§ظ„ط¬ط¨ظ„', 9),
(51, 'ط§ظ„ط³ط§ط­ظ„', 9),
(52, 'ط§ظ„ظ…ط±ظƒط²', 10),
(53, 'ط§ظ„ط´ط±ظپ', 10),
(54, 'ط§ظ„ظˆط§ط¯ظٹ', 10),
(55, 'ط§ظ„ط¬ط¨ظ„', 10),
(56, 'ط§ظ„ط³ط§ط­ظ„', 10),
(57, 'ط§ظ„ظ…ط±ظƒط²', 11),
(58, 'ط§ظ„ط´ط±ظپ', 11),
(59, 'ط§ظ„ظˆط§ط¯ظٹ', 11),
(60, 'ط§ظ„ط¬ط¨ظ„', 11),
(61, 'ط§ظ„ط³ط§ط­ظ„', 11),
(62, 'ط§ظ„ظ…ط±ظƒط²', 12),
(63, 'ط§ظ„ط´ط±ظپ', 12),
(64, 'ط§ظ„ظˆط§ط¯ظٹ', 12),
(65, 'ط§ظ„ط¬ط¨ظ„', 12),
(66, 'ط§ظ„ط³ط§ط­ظ„', 12),
(67, 'ط§ظ„ظ…ط±ظƒط²', 13),
(68, 'ط§ظ„ط´ط±ظپ', 13),
(69, 'ط§ظ„ظˆط§ط¯ظٹ', 13),
(70, 'ط§ظ„ط¬ط¨ظ„', 13),
(71, 'ط§ظ„ط³ط§ط­ظ„', 13);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `police_alerts`
--

CREATE TABLE `police_alerts` (
  `alert_id` int(11) NOT NULL,
  `alert_title` varchar(255) NOT NULL,
  `alert_message` text NOT NULL,
  `alert_date` datetime DEFAULT current_timestamp(),
  `target_department` enum('All','Traffic','Criminal','Patrol','Custom') DEFAULT 'All',
  `is_sent` tinyint(1) DEFAULT 0,
  `status` enum('in_progress','completed','rejected') NOT NULL,
  `department_id` int(11) NOT NULL,
  `suspects_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `police_alerts`
--

INSERT INTO `police_alerts` (`alert_id`, `alert_title`, `alert_message`, `alert_date`, `target_department`, `is_sent`, `status`, `department_id`, `suspects_id`) VALUES
(2, 'ظ…طھط§ط¨ط¹ظ‡ ط§ظ„ط¨ظ„ط§ط؛', 'ط§ظ„ظ‚ط¨ط¶ ط¹ظ„ظ‰ ط³ط¹ظٹط¯ ', '2025-09-17 00:54:34', 'All', 0, 'completed', 3, 31),
(3, 'kKan', 'Snsn', '2025-09-18 00:51:16', 'All', 0, 'in_progress', 5, 31),
(4, 'kKan', 'Snsn', '2025-09-18 00:51:22', 'All', 0, 'in_progress', 2, 31),
(5, 'ط³ظ„ط§', 'Jsjsjjsjs', '2025-09-18 20:59:06', 'All', 0, 'in_progress', 3, 31);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `reporters`
--

CREATE TABLE `reporters` (
  `id` int(11) NOT NULL,
  `name_reporter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_reporter` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_reporter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_national_reporter` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_reporter` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `districts_id` int(11) NOT NULL,
  `neighborhoods_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `reporters`
--

INSERT INTO `reporters` (`id`, `name_reporter`, `phone_reporter`, `email_reporter`, `id_national_reporter`, `address_reporter`, `districts_id`, `neighborhoods_id`) VALUES
(1, 'ظ…ط­ظ…ط¯ ط¹ظ„ظٹ ط³ط¹ظٹط¯ ظ‚ط§ط¦ط¯ ', '772736183', 'mohhamed@gmail.com', '7779182882', 'ط§ظ„ط±ظˆط¸ط© ', 1, 1),
(6, 'ط£ط­ظ…ط¯ ط¹ظ„ظٹ ط³ط¹ظٹط¯', '777123456', 'ahmed@example.com', '1234567890', 'طµظ†ط¹ط§ط، - ط´ط§ط±ط¹ ط§ظ„ط²ط¨ظٹط±ظٹ', 1, 1),
(46, 'ظ…ط­ظ…ط¯ ط¹ط¨ط¯ ط§ظ„ط±ط­ظ…ظ†', '775678901', 'mohamed.abdulrahman@email.com', '2233445566', 'ط´ط§ط±ط¹ ط§ظ„ط´ظ‡ط¯ط§ط، - ظ…ط¨ظ†ظ‰ 7', 1, 8),
(47, 'ط£ظ…ظٹط±ط© ط­ط³ظ† ط¹ظ„ظٹ', '776789012', 'amira.hassan@email.com', '3344556677', 'ط­ظٹ ط§ظ„ظˆط­ط¯ط© - ظ…ط¨ظ†ظ‰ 18', 1, 6),
(48, 'ط®ط§ظ„ط¯ ط¥ط¨ط±ط§ظ‡ظٹظ… ط£ط­ظ…ط¯', '777890123', 'khaled.ibrahim@email.com', '4455667788', 'ط­ظٹ ط§ظ„ط­ط±ظٹط© - ظ…ط¨ظ†ظ‰ 25', 1, 5),
(49, 'ظ†ظˆط±ط© ط³ط¹ظٹط¯ ظ…ط­ظ…ط¯', '778901234', 'nora.saeed@email.com', '5566778899', 'ط­ظٹ ط§ظ„طھط­ط±ظٹط± - ظ…ط¨ظ†ظ‰ 30', 1, 7),
(50, 'ظٹط§ط³ط± ط¹ط¨ط¯ ط§ظ„ظ„ظ‡', '779012345', 'yasser.abdullah@email.com', '6677889900', 'ط­ظٹ ط§ظ„ط²ظ‡ط±ط§ط، - ظ…ط¨ظ†ظ‰ 9', 1, 9),
(51, 'ظ‡ط¯ظٹظ„ ط¹ظ„ظٹ ط­ط³ظٹظ†', '770123456', 'hadeel.ali@email.com', '7788990011', 'ط­ظٹ ط§ظ„ط§طµط¨ط­ظٹ - ظ…ط¨ظ†ظ‰ 14', 1, 10),
(52, 'ط¹ظ…ط± ظ…ط­ظ…ط¯ ط³ط§ظ„ظ…', '771234567', 'omar.mohamed@email.com', '8899001122', 'ط´ط§ط±ط¹ ط§ظ„ط«ظˆط±ط© - ظ…ط¨ظ†ظ‰ 22', 1, 3),
(53, 'ظ„ظٹظ†ط§ ط£ط­ظ…ط¯ ط¹ط¨ط¯', '772345678', 'lena.ahmed@email.com', '9900112233', 'ط­ظٹ ط§ظ„ط³ظ„ط§ظ… - ظ…ط¨ظ†ظ‰ 11', 1, 4),
(54, 'ظ…ط­ظ…ط¯ ط¹ط¨ط¯ ط§ظ„ط±ط­ظ…ظ†', '775678901', 'mohamed.abdulrahman@email.com', '2233445566', 'ط´ط§ط±ط¹ ط§ظ„ط´ظ‡ط¯ط§ط، - ظ…ط¨ظ†ظ‰ 7', 1, 8),
(55, 'ط£ظ…ظٹط±ط© ط­ط³ظ† ط¹ظ„ظٹ', '776789012', 'amira.hassan@email.com', '3344556677', 'ط­ظٹ ط§ظ„ظˆط­ط¯ط© - ظ…ط¨ظ†ظ‰ 18', 1, 6),
(56, 'ط®ط§ظ„ط¯ ط¥ط¨ط±ط§ظ‡ظٹظ… ط£ط­ظ…ط¯', '777890123', 'khaled.ibrahim@email.com', '4455667788', 'ط­ظٹ ط§ظ„ط­ط±ظٹط© - ظ…ط¨ظ†ظ‰ 25', 1, 5),
(57, 'ظ†ظˆط±ط© ط³ط¹ظٹط¯ ظ…ط­ظ…ط¯', '778901234', 'nora.saeed@email.com', '5566778899', 'ط­ظٹ ط§ظ„طھط­ط±ظٹط± - ظ…ط¨ظ†ظ‰ 30', 1, 7),
(58, 'ظٹط§ط³ط± ط¹ط¨ط¯ ط§ظ„ظ„ظ‡', '779012345', 'yasser.abdullah@email.com', '6677889900', 'ط­ظٹ ط§ظ„ط²ظ‡ط±ط§ط، - ظ…ط¨ظ†ظ‰ 9', 1, 9),
(59, 'ظ‡ط¯ظٹظ„ ط¹ظ„ظٹ ط­ط³ظٹظ†', '770123456', 'hadeel.ali@email.com', '7788990011', 'ط­ظٹ ط§ظ„ط§طµط¨ط­ظٹ - ظ…ط¨ظ†ظ‰ 14', 1, 10),
(60, 'ط¹ظ…ط± ظ…ط­ظ…ط¯ ط³ط§ظ„ظ…', '771234567', 'omar.mohamed@email.com', '8899001122', 'ط´ط§ط±ط¹ ط§ظ„ط«ظˆط±ط© - ظ…ط¨ظ†ظ‰ 22', 1, 3),
(61, 'ظ„ظٹظ†ط§ ط£ط­ظ…ط¯ ط¹ط¨ط¯', '772345678', 'lena.ahmed@email.com', '9900112233', 'ط­ظٹ ط§ظ„ط³ظ„ط§ظ… - ظ…ط¨ظ†ظ‰ 11', 1, 4),
(77, 'ظ…ط­ظ…ط¯ ط¹ظ„ظٹ ط³ط¹ظٹط¯', '77782888', 'alijsjsjsjs', '8181818', '828828', 9, 48),
(78, 'ظ…ط­ظ…ط¯ ط¹ظ„ظٹ ط³ط¹ظٹط¯', '77782888', 'alijsjsjsjs', '8181818', '828828', 9, 48),
(79, 'ط§ظٹظ‡ط§ط¨ ظپظٹطµظ„ ظ†ط¹ظ…ط§ظ† ط§ظ„ظ†ط¹ظ…ط§ظ†ظٹ ', '777282882', 'abdullahaldys@gmail.ckm', '8263829472738', 'ط·ظٹط¨ط© ', 1, 1),
(80, 'ط§ظٹظ‡ط§ط¨ ظپظٹطµظ„ ظ†ط¹ظ…ط§ظ† ط§ظ„ظ†ط¹ظ…ط§ظ†ظٹ ', '777282882', 'abdullahaldys@gmail.ckm', '8263829472738', 'ط·ظٹط¨ط© ', 1, 1),
(81, 'ط§ظٹظ‡ط§ط¨ ظپظٹطµظ„ ظ†ط¹ظ…ط§ظ† ط§ظ„ظ†ط¹ظ…ط§ظ†ظٹ ', '777282882', 'abdullahaldys@gmail.ckm', '8263829472738', 'ط·ظٹط¨ط© ', 1, 1),
(82, 'ظ‚ط§ط¦ط¯ ط¹ط¨ط¯ط§ظ„ظ„ظ‡ ط§ط­ظ…ط¯ ط¹ظ„ظٹ ', '0583728373', 'abdullahaldys9003@gmail.com', '1837383827', 'Jsjsnsnsnsnjs', 1, 4),
(83, 'ghghgh hgghh', '776567676', 'abf@gmail.com', '8776654567', 'hghghghghgghgghh', 2, 13),
(84, 'ط¹ظ…ط§ط±', '777222888', 'abdullahaldys9004@gmail.com', '828282882', 'Jsjsjsjsj', 2, 13);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `description` text NOT NULL,
  `main_id` int(11) UNSIGNED NOT NULL,
  `sub_id` int(11) UNSIGNED NOT NULL,
  `status_report` enum('opened','closed','prosse') NOT NULL DEFAULT 'opened',
  `districts_id` int(11) NOT NULL,
  `neighborhoods_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `reports`
--

INSERT INTO `reports` (`report_id`, `created_at`, `description`, `main_id`, `sub_id`, `status_report`, `districts_id`, `neighborhoods_id`) VALUES
(49, '2025-09-03 19:13:54', 'ظ‚ظ†ظ„ ط°ط§ظ„ظƒ ط¨ط§ظ„ط´ط®طµ ', 1, 16, 'opened', 8, 43),
(50, '2025-09-03 19:14:00', 'ظ‚ظ†ظ„ ط°ط§ظ„ظƒ ط¨ط§ظ„ط´ط®طµ ', 1, 16, 'opened', 8, 43),
(57, '2025-09-13 20:58:47', 'ظ‚ط§ظ…  ظپظٹ ط§ظ„ط§ط¹طھط¯ط§ط، ط¹ظ„ظ‰ ظ…ط¬ظ…ظˆطھط¹ ط§ط´ط®ط§طµ ظپظٹ ط·ظٹط¨ط© ط¨ط§ظ„ط³ظ„ط§ط­ ', 2, 21, 'opened', 2, 13),
(58, '2025-09-13 20:58:57', 'ظ‚ط§ظ…  ظپظٹ ط§ظ„ط§ط¹طھط¯ط§ط، ط¹ظ„ظ‰ ظ…ط¬ظ…ظˆطھط¹ ط§ط´ط®ط§طµ ظپظٹ ط·ظٹط¨ط© ط¨ط§ظ„ط³ظ„ط§ط­ ', 2, 21, 'opened', 2, 13),
(59, '2025-09-13 20:59:39', 'ظ‚ط§ظ…  ظپظٹ ط§ظ„ط§ط¹طھط¯ط§ط، ط¹ظ„ظ‰ ظ…ط¬ظ…ظˆطھط¹ ط§ط´ط®ط§طµ ظپظٹ ط·ظٹط¨ط© ط¨ط§ظ„ط³ظ„ط§ط­ ', 2, 21, 'opened', 2, 13),
(60, '2025-09-13 21:39:28', 'Nsnsnsnnsjsjajajsjjsj', 1, 16, 'prosse', 1, 3),
(61, '2025-09-14 07:47:25', 'ط§ظ„ط§ظ„ط§ظ„ط§ظ„ط§ط§ظ„ط§ظ„ط§ظ„ط§ظ„ط§ظ„ط§ط§ظ„ط§ط§ظ„ط§ظ„ط§', 1, 16, 'closed', 1, 1),
(62, '2025-09-20 23:33:48', 'ط§ط¹طھط¯ط§ط¤ ط¨ط§ظ„ط³ظ„ط§ط­ ط¹ظ„ظ‰ ط§ظ…ط±ط£ط© ظپظٹ ط§ظ„ط³ظˆظ‚ ', 2, 21, 'closed', 2, 12);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `report_department`
--

CREATE TABLE `report_department` (
  `report_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `report_department`
--

INSERT INTO `report_department` (`report_id`, `department_id`, `created_at`) VALUES
(1, 1, '2025-09-01 22:54:57'),
(1, 2, '2025-09-01 22:55:24'),
(6, 1, '2025-09-01 22:55:24'),
(6, 2, '2025-09-01 22:55:36'),
(49, 1, '2025-09-03 16:13:54'),
(50, 1, '2025-09-03 16:14:00'),
(57, 1, '2025-09-13 17:58:47'),
(58, 1, '2025-09-13 17:58:57'),
(59, 1, '2025-09-13 17:59:39'),
(60, 1, '2025-09-13 18:39:28'),
(61, 1, '2025-09-14 04:47:25'),
(62, 1, '2025-09-20 20:33:48');

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `report_main_types`
--

CREATE TABLE `report_main_types` (
  `id` int(11) UNSIGNED NOT NULL,
  `type_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `report_main_types`
--

INSERT INTO `report_main_types` (`id`, `type_name`) VALUES
(1, 'ط¬ط±ط§ط¦ظ… ط§ظ„ط³ط±ظ‚ط©'),
(2, 'ط¬ط±ط§ط¦ظ… ط§ظ„ط§ط¹طھط¯ط§ط،'),
(3, 'ط¬ط±ط§ط¦ظ… ط§ظ„ظ…ط®ط¯ط±ط§طھ'),
(4, 'ط¬ط±ط§ط¦ظ… ط§ظ„ط§ط®طھط·ط§ظپ'),
(5, 'ط¬ط±ط§ط¦ظ… ط§ظ„طھظ‡ط¯ظٹط¯ ظˆط§ظ„ط§ط¨طھط²ط§ط²'),
(6, 'ط¬ط±ط§ط¦ظ… ط§ظ„ظ‚طھظ„'),
(7, 'ط¬ط±ط§ط¦ظ… ط§ظ„ط­ط±ط§ط¦ظ‚ ط§ظ„ظ…طھط¹ظ…ط¯ط©'),
(8, 'ط¬ط±ط§ط¦ظ… ط§ظ„طھط²ظˆظٹط±'),
(9, 'ط¬ط±ط§ط¦ظ… ط§ظ„ط£ط³ظ„ط­ط© ط؛ظٹط± ط§ظ„ظ…ط±ط®طµط©'),
(10, 'ط¬ط±ط§ط¦ظ… ط§ظ„ظپط³ط§ط¯');

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `report_reporter`
--

CREATE TABLE `report_reporter` (
  `report_id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `report_reporter`
--

INSERT INTO `report_reporter` (`report_id`, `reporter_id`) VALUES
(1, 1),
(49, 77),
(50, 78),
(57, 79),
(58, 80),
(59, 81),
(60, 82),
(61, 83),
(62, 84);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `report_sub_types`
--

CREATE TABLE `report_sub_types` (
  `id` int(6) UNSIGNED NOT NULL,
  `main_type_id` int(6) UNSIGNED NOT NULL,
  `sub_type_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `report_sub_types`
--

INSERT INTO `report_sub_types` (`id`, `main_type_id`, `sub_type_name`) VALUES
(16, 1, 'ط³ط±ظ‚ط© ظ…ظ†ط§ط²ظ„'),
(17, 1, 'ط³ط±ظ‚ط© ظ…ط­ظ„ط§طھ طھط¬ط§ط±ظٹط©'),
(18, 1, 'ط³ط±ظ‚ط© ط³ظٹط§ط±ط§طھ'),
(19, 1, 'ط³ط±ظ‚ط© ظ…ط³ظ„ط­ط©'),
(20, 1, 'ظ†ط´ظ„ ظˆط³ط±ظ‚ط© ظ…ط­ط§ظپط¸'),
(21, 2, 'ط§ط¹طھط¯ط§ط، ط¨ط§ظ„ط³ظ„ط§ط­ ط§ظ„ط£ط¨ظٹط¶'),
(22, 2, 'ط§ط¹طھط¯ط§ط، ط¨ط§ظ„ط³ظ„ط§ط­ ط§ظ„ظ†ط§ط±ظٹ'),
(23, 2, 'ط§ط¹طھط¯ط§ط، ط¬ط³ط¯ظٹ ظ…ط¨ط±ط­'),
(24, 2, 'ط§ط¹طھط¯ط§ط، ط¬ظ†ط³ظٹ'),
(25, 3, 'ط§طھط¬ط§ط± ط¨ط§ظ„ظ…ط®ط¯ط±ط§طھ'),
(26, 3, 'طھظˆط²ظٹط¹ ظ…ط®ط¯ط±ط§طھ'),
(27, 3, 'ط­ظٹط§ط²ط© ظ…ط®ط¯ط±ط§طھ ط¨ظƒظ…ظٹط§طھ ظƒط¨ظٹط±ط©'),
(28, 4, 'ط§ط®طھط·ط§ظپ ط·ظپظ„'),
(29, 4, 'ط§ط®طھط·ط§ظپ ط¨ط§ظ„ط؛'),
(30, 4, 'ط§ط®طھط·ط§ظپ ط·ظ„ط¨ ظپط¯ظٹط©'),
(31, 5, 'طھظ‡ط¯ظٹط¯ ط¨ط§ظ„ظ‚طھظ„'),
(32, 5, 'ط§ط¨طھط²ط§ط² ط¥ظ„ظƒطھط±ظˆظ†ظٹ'),
(33, 5, 'ط§ط¨طھط²ط§ط² ظ…ط§ظ„ظٹ'),
(34, 6, 'ظ‚طھظ„ ط¹ظ…ط¯'),
(35, 6, 'ظ‚طھظ„ ط®ط·ط£'),
(36, 6, 'ط´ط±ظˆط¹ ظ‚طھظ„'),
(37, 7, 'ط­ط±ظٹظ‚ ظ…طھط¹ظ…ط¯ ظ„ظ…ط¨ظ†ظ‰'),
(38, 7, 'ط­ط±ظٹظ‚ ظ…طھط¹ظ…ط¯ ظ„ظ…ط±ظƒط¨ط©'),
(39, 8, 'طھط²ظˆظٹط± ظ…ط³طھظ†ط¯ط§طھ ط±ط³ظ…ظٹط©'),
(40, 8, 'طھط²ظˆظٹط± ط¹ظ…ظ„ط©'),
(41, 8, 'طھط²ظˆظٹط± ط´ظ‡ط§ط¯ط§طھ'),
(42, 9, 'ط­ظٹط§ط²ط© ط£ط³ظ„ط­ط© ط؛ظٹط± ظ…ط±ط®طµط©'),
(43, 9, 'ط§طھط¬ط§ط± ط¨ط§ظ„ط£ط³ظ„ط­ط©'),
(44, 10, 'ط±ط´ظˆط©'),
(45, 10, 'ط§ط®طھظ„ط§ط³ ط£ظ…ظˆط§ظ„ ط¹ط§ظ…ط©'),
(46, 10, 'طھط²ظˆظٹط± ط¹ط·ط§ط،ط§طھ');

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `report_suspect`
--

CREATE TABLE `report_suspect` (
  `report_id` int(11) NOT NULL,
  `suspect_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `report_suspect`
--

INSERT INTO `report_suspect` (`report_id`, `suspect_id`) VALUES
(49, 31),
(50, 32),
(57, 33),
(58, 34),
(59, 35),
(60, 36),
(61, 37),
(62, 38);

-- --------------------------------------------------------

--
-- ط¨ظ†ظٹط© ط§ظ„ط¬ط¯ظˆظ„ `suspects`
--

CREATE TABLE `suspects` (
  `id` int(11) NOT NULL,
  `full_name` varchar(230) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `status` enum('Wanted','Arrested','Cleared','Suspected') NOT NULL DEFAULT 'Wanted',
  `age` int(4) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `national_id` varchar(15) NOT NULL,
  `districts_id` int(11) NOT NULL,
  `neighborhoods_id` int(11) NOT NULL,
  `gender` enum('male','female') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ط¥ط±ط¬ط§ط¹ ط£ظˆ ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ط¯ظˆظ„ `suspects`
--

INSERT INTO `suspects` (`id`, `full_name`, `phone`, `address`, `status`, `age`, `created_at`, `national_id`, `districts_id`, `neighborhoods_id`, `gender`) VALUES
(31, 'ط§ط­ظ…ط¯ ظ‚ط§ط¦ط¯ ط¹ط¨ط¯ط§ظ„ظ„ظ‡ ط§ط­ظ…ط¯ ', '7784549282', 'ط¬ظˆط§ط± ط·ظٹط¨ط©', 'Arrested', 52, '2025-09-03 19:13:54', '828288283', 1, 8, 'male'),
(32, 'ط§ط³ط¹ط¯ ط­ظ…ظٹط¯ ط³ظٹظپ ط§ظ„ط³ط¹ط¯ط§ظˆظٹ', '7784549282', 'ط¬ظˆط§ط± ط¨ظ‚ط§ظ„ط© ظ‡ط´ط§ظ…', 'Wanted', 22, '2025-09-03 19:14:00', '72626283838383', 1, 8, 'male'),
(37, 'kjkjkjkjkjk', '776767676', 'jhjhjhjhjhjhjj', 'Arrested', 55, '2025-09-14 07:47:25', '4564645454', 2, 13, 'male'),
(38, 'ط³ط¹ظٹط¯ ظ‚ط§ط¦ط¯ ط¹ط¨ط¯ط§ظ„ظ„ظ‡ ط§ط­ظ…ط¯ ط¹ظ„ظٹ ط³ط¹ظٹط¯ ', '777222888', 'ظ†ظٹظ†ظ†ظٹظ†ظٹظ†ظٹ', 'Wanted', 77, '2025-09-20 23:33:48', '828282', 2, 12, 'male');

--
-- Indexes for dumped tables
--

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `alert_checkpoints`
--
ALTER TABLE `alert_checkpoints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alert_id` (`alert_id`),
  ADD KEY `checkpoint_id` (`checkpoint_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `checkpoints`
--
ALTER TABLE `checkpoints`
  ADD PRIMARY KEY (`id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD KEY `districts_id` (`districts_id`),
  ADD KEY `neighborhoods_id` (`neighborhoods_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `governorate_id` (`governorate_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `department_id` (`department_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `governorates`
--
ALTER TABLE `governorates`
  ADD PRIMARY KEY (`id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `logs_activity`
--
ALTER TABLE `logs_activity`
  ADD PRIMARY KEY (`id_activity`),
  ADD KEY `id_user` (`id_user`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `neighborhoods`
--
ALTER TABLE `neighborhoods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `district_id` (`district_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `police_alerts`
--
ALTER TABLE `police_alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `suspects_id` (`suspects_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `reporters`
--
ALTER TABLE `reporters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `districts_id` (`districts_id`),
  ADD KEY `neighborhoods_id` (`neighborhoods_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `main_id` (`main_id`),
  ADD KEY `sub_id` (`sub_id`),
  ADD KEY `districts_id` (`districts_id`),
  ADD KEY `neighborhoods_id` (`neighborhoods_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `report_department`
--
ALTER TABLE `report_department`
  ADD PRIMARY KEY (`report_id`,`department_id`),
  ADD KEY `department_id` (`department_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `report_main_types`
--
ALTER TABLE `report_main_types`
  ADD PRIMARY KEY (`id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `report_reporter`
--
ALTER TABLE `report_reporter`
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `report_id` (`report_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `report_sub_types`
--
ALTER TABLE `report_sub_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `main_type_id` (`main_type_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `report_suspect`
--
ALTER TABLE `report_suspect`
  ADD KEY `report_id` (`report_id`),
  ADD KEY `suspect_id` (`suspect_id`);

--
-- ظپظ‡ط§ط±ط³ ظ„ظ„ط¬ط¯ظˆظ„ `suspects`
--
ALTER TABLE `suspects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `districts_id` (`districts_id`),
  ADD KEY `neighborhoods_id` (`neighborhoods_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alert_checkpoints`
--
ALTER TABLE `alert_checkpoints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `checkpoints`
--
ALTER TABLE `checkpoints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `governorates`
--
ALTER TABLE `governorates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `logs_activity`
--
ALTER TABLE `logs_activity`
  MODIFY `id_activity` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `neighborhoods`
--
ALTER TABLE `neighborhoods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `police_alerts`
--
ALTER TABLE `police_alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reporters`
--
ALTER TABLE `reporters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `report_main_types`
--
ALTER TABLE `report_main_types`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `report_sub_types`
--
ALTER TABLE `report_sub_types`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `suspects`
--
ALTER TABLE `suspects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- ط§ظ„ظ‚ظٹظˆط¯ ط§ظ„ظ…ظپط±ظˆط¶ط© ط¹ظ„ظ‰ ط§ظ„ط¬ط¯ط§ظˆظ„ ط§ظ„ظ…ظ„ظ‚ط§ط©
--

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `alert_checkpoints`
--
ALTER TABLE `alert_checkpoints`
  ADD CONSTRAINT `alert_checkpoints_ibfk_1` FOREIGN KEY (`alert_id`) REFERENCES `police_alerts` (`alert_id`),
  ADD CONSTRAINT `alert_checkpoints_ibfk_2` FOREIGN KEY (`checkpoint_id`) REFERENCES `checkpoints` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `department_ibfk_1` FOREIGN KEY (`districts_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `department_ibfk_2` FOREIGN KEY (`neighborhoods_id`) REFERENCES `neighborhoods` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`governorate_id`) REFERENCES `governorates` (`id`) ON DELETE CASCADE;

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `logs_activity`
--
ALTER TABLE `logs_activity`
  ADD CONSTRAINT `logs_activity_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `employees` (`employee_id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `neighborhoods`
--
ALTER TABLE `neighborhoods`
  ADD CONSTRAINT `neighborhoods_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `police_alerts`
--
ALTER TABLE `police_alerts`
  ADD CONSTRAINT `police_alerts_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`),
  ADD CONSTRAINT `police_alerts_ibfk_2` FOREIGN KEY (`suspects_id`) REFERENCES `suspects` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `reporters`
--
ALTER TABLE `reporters`
  ADD CONSTRAINT `reporters_ibfk_1` FOREIGN KEY (`districts_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `reporters_ibfk_2` FOREIGN KEY (`neighborhoods_id`) REFERENCES `neighborhoods` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`main_id`) REFERENCES `report_main_types` (`id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`sub_id`) REFERENCES `report_sub_types` (`id`),
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`districts_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `reports_ibfk_4` FOREIGN KEY (`neighborhoods_id`) REFERENCES `neighborhoods` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `report_department`
--
ALTER TABLE `report_department`
  ADD CONSTRAINT `report_department_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`),
  ADD CONSTRAINT `report_department_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `report_reporter`
--
ALTER TABLE `report_reporter`
  ADD CONSTRAINT `report_reporter_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `reporters` (`id`),
  ADD CONSTRAINT `report_reporter_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `report_sub_types`
--
ALTER TABLE `report_sub_types`
  ADD CONSTRAINT `report_sub_types_ibfk_1` FOREIGN KEY (`main_type_id`) REFERENCES `report_main_types` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `report_suspect`
--
ALTER TABLE `report_suspect`
  ADD CONSTRAINT `report_suspect_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`),
  ADD CONSTRAINT `report_suspect_ibfk_2` FOREIGN KEY (`suspect_id`) REFERENCES `suspects` (`id`);

--
-- ظ‚ظٹظˆط¯ ط§ظ„ط¬ط¯ط§ظˆظ„ `suspects`
--
ALTER TABLE `suspects`
  ADD CONSTRAINT `suspects_ibfk_1` FOREIGN KEY (`districts_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `suspects_ibfk_2` FOREIGN KEY (`neighborhoods_id`) REFERENCES `neighborhoods` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




SELECT
    s.full_name AS 'اسم المطلوب',
    s.national_id AS 'رقم الهوية الوطنية',
    s.phone AS 'رقم الهاتف',
    s.age AS 'العمر',
    s.gender AS 'الجنس',
    s.status AS 'الحالة',
    s.address AS 'العنوان',
    d.name AS 'المنطقة',
    n.name AS 'الحارة',
    r.report_id AS 'رقم البلاغ',
    DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS 'تاريخ البلاغ',
    r.description AS 'وصف البلاغ',
    rmt.type_name AS 'نوع البلاغ الرئيسي',
    rst.sub_type_name AS 'النوع الفرعي',
    CASE 
        WHEN r.status_report = 'opened' THEN 'مفتوح'
        WHEN r.status_report = 'closed' THEN 'مغلق'
        WHEN r.status_report = 'prosse' THEN 'قيد المعالجة'
    END AS 'حالة البلاغ'
FROM suspects s
LEFT JOIN report_suspect rs ON s.id = rs.suspect_id
LEFT JOIN reports r ON rs.report_id = r.report_id
LEFT JOIN report_main_types rmt ON r.main_id = rmt.id
LEFT JOIN report_sub_types rst ON r.sub_id = rst.id
LEFT JOIN districts d ON s.districts_id = d.id
LEFT JOIN neighborhoods n ON s.neighborhoods_id = n.id
WHERE s.national_id = 828288283;