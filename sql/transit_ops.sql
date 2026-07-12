-- Adminer 4.8.1 MySQL 10.4.18-MariaDB dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `drivers`;
CREATE TABLE `drivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `license_number` varchar(16) NOT NULL,
  `license_category` varchar(6) NOT NULL,
  `license_expiry` date NOT NULL,
  `phone` varchar(10) NOT NULL,
  `safety_score` tinyint(3) unsigned NOT NULL,
  `status` enum('available','on_trip','off_duty','suspended') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_number` (`license_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `drivers` (`id`, `name`, `license_number`, `license_category`, `license_expiry`, `phone`, `safety_score`, `status`, `created_at`, `updated_at`) VALUES
(1,	'Raghul',	'TN0120110001234',	'LMV',	'2026-07-31',	'9876543210',	100,	'on_trip',	'2026-07-12 16:52:45',	'2026-07-12 15:32:41'),
(2,	'Raghul',	'TN0120110001235',	'HMV',	'2026-07-31',	'9876543210',	100,	'off_duty',	'2026-07-12 15:33:43',	'2026-07-12 15:33:43'),
(3,	'Vimala',	'TN0120110301235',	'HMV',	'2026-08-19',	'9876543210',	50,	'available',	'2026-07-12 16:53:31',	'2026-07-12 15:38:08');

DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trip_id` int(11) NOT NULL,
  `toll` mediumint(8) unsigned NOT NULL,
  `other` mediumint(9) NOT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `fuel_logs`;
CREATE TABLE `fuel_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trip_id` int(11) NOT NULL,
  `liters` tinyint(3) unsigned NOT NULL,
  `cost` mediumint(8) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `fuel_logs_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `maintenance_logs`;
CREATE TABLE `maintenance_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(11) NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `status` enum('available','in_shop') NOT NULL DEFAULT 'available',
  `cost` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `maintenance_logs_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`id`, `name`) VALUES
(1,	'Fleet Manager'),
(2,	'Driver'),
(3,	'Safety Officer'),
(4,	'Financial Analyst');

DROP TABLE IF EXISTS `trips`;
CREATE TABLE `trips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `revenue` int(11) unsigned NOT NULL,
  `source` varchar(25) NOT NULL,
  `destination` varchar(25) NOT NULL,
  `cargo_weight` int(10) unsigned NOT NULL,
  `planned_distance` int(10) unsigned NOT NULL,
  `actual_distance` int(10) unsigned NOT NULL,
  `start_odometer` int(10) unsigned NOT NULL,
  `end_odometer` int(10) unsigned NOT NULL,
  `fuel_used` int(10) unsigned NOT NULL,
  `status` enum('draft','dispatched','completed','cancelled') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `trips` (`id`, `vehicle_id`, `driver_id`, `revenue`, `source`, `destination`, `cargo_weight`, `planned_distance`, `actual_distance`, `start_odometer`, `end_odometer`, `fuel_used`, `status`, `created_at`, `updated_at`) VALUES
(1,	3,	1,	10,	'Mumbai',	'Pune',	1000,	500,	0,	0,	0,	0,	'dispatched',	'2026-07-12 16:41:17',	'0000-00-00 00:00:00'),
(2,	3,	1,	15000,	'Chennai',	'Kasi',	500,	1520,	0,	0,	0,	0,	'dispatched',	'2026-07-12 16:52:44',	'2026-07-12 16:52:44');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `role_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` enum('active','inactive') NOT NULL,
  `login_attempts` tinyint(1) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `name`, `role_id`, `email`, `password`, `status`, `login_attempts`, `created_at`, `updated_at`) VALUES
(1,	'Raghul',	1,	'raghulsmart007@gmail.com',	'$2b$10$fZC/eHShlpfIlxMOHfD9Be0.1gysymZHaTHKfteUeyZ3uXzYHSV/O',	'active',	0,	'2026-07-12 11:38:20',	'2026-07-12 11:38:20');

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_no` varchar(10) NOT NULL,
  `vehicle_model_id` int(11) NOT NULL,
  `vehicle_type_id` int(11) NOT NULL,
  `odometer` int(10) unsigned NOT NULL,
  `max_load_capacity` smallint(5) unsigned NOT NULL,
  `acquisition_cost` int(10) unsigned NOT NULL,
  `status` enum('available','on_trip','in_shop','retired') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_no` (`registration_no`),
  KEY `vehicle_model_id` (`vehicle_model_id`),
  KEY `vehicle_type_id` (`vehicle_type_id`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`vehicle_model_id`) REFERENCES `vehicle_models` (`id`),
  CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vehicles` (`id`, `registration_no`, `vehicle_model_id`, `vehicle_type_id`, `odometer`, `max_load_capacity`, `acquisition_cost`, `status`, `created_at`, `updated_at`) VALUES
(1,	'TN68AB1234',	1,	1,	1,	1,	1,	'available',	'2026-07-12 14:03:00',	'0000-00-00 00:00:00'),
(2,	'TN68B1234',	1,	1,	123,	65535,	123123123,	'retired',	'2026-07-12 14:09:47',	'0000-00-00 00:00:00'),
(3,	'TN12BC123',	4,	3,	88484,	5454,	852,	'on_trip',	'2026-07-12 16:52:45',	'0000-00-00 00:00:00'),
(4,	'DL87B454',	3,	3,	87825,	54282,	10000,	'retired',	'2026-07-12 14:40:43',	'0000-00-00 00:00:00');

DROP TABLE IF EXISTS `vehicle_models`;
CREATE TABLE `vehicle_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vehicle_models` (`id`, `model`) VALUES
(1,	'TATA - Big Truck'),
(2,	'Bajaj - Mini VAN'),
(3,	'Mahindra - Truck'),
(4,	'TATA - VAN'),
(5,	'Bajaj - VAN'),
(6,	'Mahindra - Heavy Van');

DROP TABLE IF EXISTS `vehicle_types`;
CREATE TABLE `vehicle_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vehicle_types` (`id`, `type`) VALUES
(1,	'VAN'),
(2,	'TRUCK'),
(3,	'MINI');

-- 2026-07-12 11:51:36
