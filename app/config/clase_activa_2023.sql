-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 01-09-2023 a las 04:53:36
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `clase_activa_2023`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attitudes`
--

DROP TABLE IF EXISTS `attitudes`;
CREATE TABLE IF NOT EXISTS `attitudes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `oa` varchar(255) NOT NULL,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `attitudes`
--

INSERT INTO `attitudes` (`id`, `oa`, `name`) VALUES
(14, 'B', 'Demostrar disposición a expresar artísticamente las propias ideas y sentimientos.'),
(15, 'Y', 'prueba'),
(16, 'R', 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `axis`
--

DROP TABLE IF EXISTS `axis`;
CREATE TABLE IF NOT EXISTS `axis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_subject` (`subject`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `axis`
--

INSERT INTO `axis` (`id`, `name`, `subject`) VALUES
(51, 'prueba', 592),
(52, 'prueba', 590),
(59, 'hola ctm', 592),
(66, 'PRUEBA', 593),
(67, 'PRUEBA', 594),
(68, 'eje prueba', 616),
(69, 'eje prueba', 617),
(70, 'eje prueba', 615),
(71, 'eje prueba', 606);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `condition_course` tinyint(1) NOT NULL,
  `level` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_level` (`level`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `courses`
--

INSERT INTO `courses` (`id`, `name`, `condition_course`, `level`) VALUES
(19, 'PRIMERO BÁSICO', 1, 16),
(20, 'SEGUNDO BÁSICO', 1, 16),
(21, 'TERCERO BÁSICO', 1, 16),
(22, 'CUARTO BÁSICO', 1, 16),
(23, 'QUINTO BÁSICO', 1, 16),
(24, 'SEXTO BÁSICO', 1, 16),
(25, 'SÉPTIMO BÁSICO', 1, 16),
(26, 'OCTAVO BÁSICO', 1, 16),
(27, 'PRIMERO MEDIO', 1, 23),
(28, 'SEGUNDO MEDIO', 1, 23),
(29, 'TERCERO MEDIO', 1, 23),
(30, 'CUARTO MEDIO', 1, 23);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicators`
--

DROP TABLE IF EXISTS `indicators`;
CREATE TABLE IF NOT EXISTS `indicators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `indicators`
--

INSERT INTO `indicators` (`id`, `name`) VALUES
(3, 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levels`
--

DROP TABLE IF EXISTS `levels`;
CREATE TABLE IF NOT EXISTS `levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `condition_level` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `levels`
--

INSERT INTO `levels` (`id`, `name`, `condition_level`) VALUES
(15, 'EDUCACIÓN PARVULARIA', 1),
(16, 'EDUCACIÓN BÁSICA', 1),
(23, 'EDUCACIÓN MEDIA', 1),
(24, 'TÉCNICO PROFESIONAL', 0),
(25, 'UNIVERSITARIO', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `objectives`
--

DROP TABLE IF EXISTS `objectives`;
CREATE TABLE IF NOT EXISTS `objectives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `oa` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `objectives`
--

INSERT INTO `objectives` (`id`, `oa`, `name`) VALUES
(12, 1, 'Expresar y crear trabajos de arte a partir de la observación del:'),
(13, 2, 'Experimentar y aplicar elementos del lenguaje visual en sus trabajos de arte:'),
(14, 3, 'Expresar emociones e ideas en sus trabajos de arte a partir de la experimentación con:'),
(15, 4, 'prueba 1'),
(16, 5, 'prueba final'),
(17, 6, 'hola'),
(18, 7, 'prueba'),
(19, 7, 'prueba7'),
(20, 8, 'holA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planning_axis_objectives`
--

DROP TABLE IF EXISTS `planning_axis_objectives`;
CREATE TABLE IF NOT EXISTS `planning_axis_objectives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `axi` int NOT NULL,
  `objective` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_axi` (`axi`),
  KEY `id_objective` (`objective`)
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `planning_axis_objectives`
--

INSERT INTO `planning_axis_objectives` (`id`, `axi`, `objective`) VALUES
(243, 51, 12),
(244, 51, 13),
(245, 51, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planning_indicators_objectives`
--

DROP TABLE IF EXISTS `planning_indicators_objectives`;
CREATE TABLE IF NOT EXISTS `planning_indicators_objectives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `objective` int NOT NULL,
  `indicator` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_objective` (`objective`) USING BTREE,
  KEY `id_indicator` (`indicator`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `planning_indicators_objectives`
--

INSERT INTO `planning_indicators_objectives` (`id`, `objective`, `indicator`) VALUES
(57, 12, 3),
(58, 13, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planning_subobjectives_objectives`
--

DROP TABLE IF EXISTS `planning_subobjectives_objectives`;
CREATE TABLE IF NOT EXISTS `planning_subobjectives_objectives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subobjective` int NOT NULL,
  `objective` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_objective` (`objective`),
  KEY `id_subobjective` (`subobjective`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `planning_subobjectives_objectives`
--

INSERT INTO `planning_subobjectives_objectives` (`id`, `subobjective`, `objective`) VALUES
(53, 2, 12),
(54, 2, 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planning_units_attitudes`
--

DROP TABLE IF EXISTS `planning_units_attitudes`;
CREATE TABLE IF NOT EXISTS `planning_units_attitudes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit` int NOT NULL,
  `attitude` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_attitude` (`attitude`),
  KEY `id_unit` (`unit`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `planning_units_attitudes`
--

INSERT INTO `planning_units_attitudes` (`id`, `unit`, `attitude`) VALUES
(56, 28, 14),
(57, 8, 15),
(58, 30, 16),
(59, 31, 15),
(60, 31, 16),
(61, 12, 14),
(62, 12, 15),
(63, 8, 16),
(64, 8, 14),
(65, 38, 14),
(66, 38, 15),
(67, 38, 16),
(70, 12, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planning_units_objectives`
--

DROP TABLE IF EXISTS `planning_units_objectives`;
CREATE TABLE IF NOT EXISTS `planning_units_objectives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit` int NOT NULL,
  `objective` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_unit` (`unit`),
  KEY `id_objective` (`objective`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `planning_units_objectives`
--

INSERT INTO `planning_units_objectives` (`id`, `unit`, `objective`) VALUES
(28, 28, 12),
(32, 29, 12),
(33, 30, 12),
(34, 31, 12),
(35, 29, 13),
(36, 29, 14),
(37, 32, 14),
(38, 32, 12),
(39, 32, 13),
(40, 9, 12),
(41, 9, 13),
(42, 9, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planning_units_skills`
--

DROP TABLE IF EXISTS `planning_units_skills`;
CREATE TABLE IF NOT EXISTS `planning_units_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit` int NOT NULL,
  `skill` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_unit` (`unit`),
  KEY `id_skill` (`skill`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `planning_units_skills`
--

INSERT INTO `planning_units_skills` (`id`, `unit`, `skill`) VALUES
(15, 28, 7),
(16, 32, 8),
(17, 28, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `skills`
--

DROP TABLE IF EXISTS `skills`;
CREATE TABLE IF NOT EXISTS `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `oa` varchar(255) NOT NULL,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `skills`
--

INSERT INTO `skills` (`id`, `oa`, `name`) VALUES
(7, 'A', 'Observación de situaciones y lugares cotidianos, de manera directa y por medio de fotografías y videos.'),
(8, 'B', 'prueba'),
(9, 'O', 'hola'),
(10, 'E', 'prueba'),
(11, 'D', 'prueba'),
(12, 'U', 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subjects`
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `condition_subject` tinyint(1) NOT NULL,
  `course` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_course` (`course`)
) ENGINE=InnoDB AUTO_INCREMENT=618 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `condition_subject`, `course`) VALUES
(581, 'MATEMÁTICA', 1, 24),
(582, 'MATEMÁTICA', 1, 23),
(583, 'MATEMÁTICA', 1, 25),
(584, 'MATEMÁTICA', 1, 26),
(585, 'MATEMÁTICA', 1, 27),
(586, 'MATEMÁTICA', 1, 28),
(587, 'MATEMÁTICA', 1, 22),
(588, 'MATEMÁTICA', 1, 29),
(589, 'MATEMÁTICA', 1, 30),
(590, 'MATEMÁTICA', 1, 20),
(591, 'MATEMÁTICA', 1, 21),
(592, 'MATEMÁTICA', 1, 19),
(593, 'EDUCACIÓN FÍSICA Y SALUD', 1, 19),
(594, 'EDUCACIÓN FÍSICA Y SALUD', 1, 20),
(595, 'EDUCACIÓN FÍSICA Y SALUD', 1, 21),
(596, 'EDUCACIÓN FÍSICA Y SALUD', 1, 22),
(597, 'EDUCACIÓN FÍSICA Y SALUD', 1, 23),
(598, 'EDUCACIÓN FÍSICA Y SALUD', 1, 24),
(599, 'EDUCACIÓN FÍSICA Y SALUD', 1, 25),
(600, 'EDUCACIÓN FÍSICA Y SALUD', 1, 26),
(601, 'EDUCACIÓN FÍSICA Y SALUD', 1, 27),
(602, 'EDUCACIÓN FÍSICA Y SALUD', 1, 28),
(603, 'EDUCACIÓN FÍSICA Y SALUD', 1, 29),
(604, 'EDUCACIÓN FÍSICA Y SALUD', 1, 30),
(606, 'ARTES VISUALES', 1, 19),
(615, 'ARTES VISUALES', 1, 20),
(616, 'ARTES VISUALES', 1, 21),
(617, 'ARTES VISUALES', 1, 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subobjectives`
--

DROP TABLE IF EXISTS `subobjectives`;
CREATE TABLE IF NOT EXISTS `subobjectives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `subobjectives`
--

INSERT INTO `subobjectives` (`id`, `name`) VALUES
(2, 'PRUEBA FINAL CTM'),
(5, 'HOLa'),
(6, 'PRUEBA 2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tests`
--

DROP TABLE IF EXISTS `tests`;
CREATE TABLE IF NOT EXISTS `tests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `percentage` int NOT NULL,
  `standard` tinyint(1) NOT NULL,
  `instruction` longtext NOT NULL,
  `objective` longtext NOT NULL,
  `subject` int NOT NULL,
  `user` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user`),
  KEY `subject_id` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `themes`
--

DROP TABLE IF EXISTS `themes`;
CREATE TABLE IF NOT EXISTS `themes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `condition_theme` tinyint(1) NOT NULL,
  `subject` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_subject` (`subject`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `themes`
--

INSERT INTO `themes` (`id`, `name`, `condition_theme`, `subject`) VALUES
(7, 'ASDAASADA', 1, 600);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE IF NOT EXISTS `units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_subject` (`subject`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `units`
--

INSERT INTO `units` (`id`, `name`, `subject`) VALUES
(8, 'Los Números 123', 589),
(9, 'La División', 592),
(10, 'Vida Saludable', 593),
(11, 'Saltar', 604),
(12, 'Mundo Atómico', 592),
(28, 'Unidad 1: Materiales y herramientas', 606),
(29, 'Unidad 2: Las emociones y la vida cotidiana', 606),
(30, 'Unidad 3: Diversos procedimientos, materiales y formas de expresión', 606),
(31, 'Unidad 4: Temáticas diversas; texturas visuales y táctiles', 606),
(32, 'UNIDAD 1: PRUEBA', 581),
(38, 'PRUEBA FINAL TODOS', 586);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  `rut` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `mothers_last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` int DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role`, `rut`, `name`, `last_name`, `mothers_last_name`, `email`, `telefono`, `password`) VALUES
(11, 'profesor', '183566946', 'lucas cardemil', NULL, NULL, 'lucas@hotmail.com', 0, '25f9e794323b453885f5181f1b624d0b'),
(12, 'administrador', '150557984', 'Alvaro', 'Perez', 'Castillo', 'alvaro@alvaro.com', 77999757, '25f9e794323b453885f5181f1b624d0b');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_educations`
--

DROP TABLE IF EXISTS `user_educations`;
CREATE TABLE IF NOT EXISTS `user_educations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` int NOT NULL,
  `user` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_subject` (`subject`),
  KEY `id_user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_schools`
--

DROP TABLE IF EXISTS `user_schools`;
CREATE TABLE IF NOT EXISTS `user_schools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `user` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `user_schools`
--

INSERT INTO `user_schools` (`id`, `school`, `image`, `user`) VALUES
(8, 'prueba', 'C:\\xampp\\htdocs\\proyecto-clase-activa\\FRONTEND\\src\\assets\\uploads\\ACwDA3ZVcDn-fo9xVMZccQnX.png', 12),
(9, 'prueba', '/home/claseac1/public_html/2023/assets/uploads/IPJqQ9jsHuFmSzWam_BmyZQ5.png', 12);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `axis`
--
ALTER TABLE `axis`
  ADD CONSTRAINT `id_subject_axis_foreign` FOREIGN KEY (`subject`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `id_level_foreign` FOREIGN KEY (`level`) REFERENCES `levels` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `planning_axis_objectives`
--
ALTER TABLE `planning_axis_objectives`
  ADD CONSTRAINT `id_axi_planning_axis_objectives_foreign` FOREIGN KEY (`axi`) REFERENCES `axis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `id_objective_planning_axis_objectives_foreign` FOREIGN KEY (`objective`) REFERENCES `objectives` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `planning_indicators_objectives`
--
ALTER TABLE `planning_indicators_objectives`
  ADD CONSTRAINT `id_indicator_planning_indicators_foreign` FOREIGN KEY (`indicator`) REFERENCES `indicators` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `id_objective_planning_indicators_foreign` FOREIGN KEY (`objective`) REFERENCES `objectives` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `planning_subobjectives_objectives`
--
ALTER TABLE `planning_subobjectives_objectives`
  ADD CONSTRAINT `id_objective_planning_subobjectives_foreign` FOREIGN KEY (`objective`) REFERENCES `objectives` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `id_subobjective_planning_subobjectives_foreign` FOREIGN KEY (`subobjective`) REFERENCES `subobjectives` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Filtros para la tabla `planning_units_attitudes`
--
ALTER TABLE `planning_units_attitudes`
  ADD CONSTRAINT `id_attitude_planning_attitudes_foreign` FOREIGN KEY (`attitude`) REFERENCES `attitudes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `id_unit_planning_attitudes_foreign` FOREIGN KEY (`unit`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `planning_units_objectives`
--
ALTER TABLE `planning_units_objectives`
  ADD CONSTRAINT `id_objective_planning_units_objectives_foreign` FOREIGN KEY (`objective`) REFERENCES `objectives` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `id_unit_planning_units_objectives_foreign` FOREIGN KEY (`unit`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `id_course_subject_foreign` FOREIGN KEY (`course`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `id_subject_test_foreign` FOREIGN KEY (`subject`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `id_user_test_foreign` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `themes`
--
ALTER TABLE `themes`
  ADD CONSTRAINT `id_subject_themes_foreign` FOREIGN KEY (`subject`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `id_subject_planning_units_foreign` FOREIGN KEY (`subject`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_educations`
--
ALTER TABLE `user_educations`
  ADD CONSTRAINT `id_subject_subjects_foreign` FOREIGN KEY (`subject`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `id_user_users_foreign` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `user_schools`
--
ALTER TABLE `user_schools`
  ADD CONSTRAINT `id_user_school_foreign` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
