SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE =
        'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema nileDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema nileDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `niledb` DEFAULT CHARACTER SET utf8;
USE `niledb`;

CREATE TABLE `address`
(
    `addressID` INT NOT NULL AUTO_INCREMENT,
    `street`    varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `city`      varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `state`     varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `zip`       varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    PRIMARY KEY (`addressID`),
    KEY `Key` (`street`, `city`, `state`, `zip`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `Admin`
(
    `email`     varchar(45) COLLATE utf8mb4_general_ci  NOT NULL,
    `firstName` varchar(45) COLLATE utf8mb4_general_ci  NOT NULL,
    `lastName`  varchar(45) COLLATE utf8mb4_general_ci  NOT NULL,
    `pass`      varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
    PRIMARY KEY (`email`),
    UNIQUE KEY `email_UNIQUE` (`email`),
    KEY `Key` (`firstName`, `lastName`, `pass`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `binding`
(
    `bindingID` INT NOT NULL,
    `binding`   varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    PRIMARY KEY (`bindingID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `genre`
(
    `genreID` INT NOT NULL,
    `genre`   varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    PRIMARY KEY (`genreID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `book`
(
    `ISBN`            varchar(20) NOT NULL,
    `bindingID`       INT                                     DEFAULT NULL,
    `genreID`         INT                                     DEFAULT NULL,
    `title`           varchar(45) COLLATE utf8mb4_general_ci  DEFAULT NULL,
    `price`           double                                  DEFAULT NULL,
    `numPages`        INT                                     DEFAULT NULL,
    `image`           longblob,
    `edition`         varchar(45) COLLATE utf8mb4_general_ci  DEFAULT NULL,
    `publisher`       varchar(45) COLLATE utf8mb4_general_ci  DEFAULT NULL,
    `publicationDate` date                                    DEFAULT NULL,
    `stock`           INT                                     DEFAULT NULL,
    `authorFirstName` varchar(45) COLLATE utf8mb4_general_ci  DEFAULT NULL,
    `authorLastName`  varchar(45) COLLATE utf8mb4_general_ci  DEFAULT NULL,
    `summary`         varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
    PRIMARY KEY (`ISBN`),
    KEY `Key` (`title`, `price`),
    KEY `bindingID_idx` (`bindingID`),
    KEY `genreID_idx` (`genreID`),
    CONSTRAINT `bindingID` FOREIGN KEY (`bindingID`) REFERENCES `binding` (`bindingID`),
    CONSTRAINT `genreID` FOREIGN KEY (`genreID`) REFERENCES `genre` (`genreID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;



CREATE TABLE `orderDetails`
(
    `orderID`  INT         NOT NULL,
    `ISBN`     varchar(20) NOT NULL,
    `quantity` INT DEFAULT 0,
    KEY `FK` (`orderID`, `ISBN`),
    KEY `Key` (`quantity`),
    KEY `bookID_idx` (`ISBN`),
    CONSTRAINT `bookID` FOREIGN KEY (`ISBN`) REFERENCES `book` (`ISBN`),
    CONSTRAINT `fk_orderDetails_orders1` FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `promotion`
(
    `promotionID` INT NOT NULL AUTO_INCREMENT,
    `code`        varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `discount`    double                                 DEFAULT NULL,
    `startDate`   date                                   DEFAULT NULL,
    `endDate`     date                                   DEFAULT NULL,
    PRIMARY KEY (`promotionID`),
    KEY `Key` (`code`, `discount`, `startDate`, `endDate`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `orders`
(
    `orderID`            INT NOT NULL AUTO_INCREMENT,
    `promotionID`        INT    DEFAULT NULL,
    `total`              double DEFAULT NULL,
    `date`               date   DEFAULT NULL,
    `confirmationNumber` INT    DEFAULT NULL,
    `orderTime`          time   DEFAULT NULL,
    PRIMARY KEY (`orderID`),
    KEY `FK` (`promotionID`),
    KEY `Key` (`total`, `date`),
    CONSTRAINT `promotionID` FOREIGN KEY (`promotionID`) REFERENCES `promotion` (`promotionID`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 10
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `payment`
(
    `paymentID`      INT NOT NULL AUTO_INCREMENT,
    `cardNumber`     INT                                     DEFAULT NULL,
    `address`        varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `expirationDate` date                                    DEFAULT NULL,
    PRIMARY KEY (`paymentID`),
    KEY `Key` (`cardNumber`, `address`, `expirationDate`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;



CREATE TABLE `shoppingCart`
(
    `cartID`  INT NOT NULL AUTO_INCREMENT,
    `orderID` INT DEFAULT NULL,
    PRIMARY KEY (`cartID`),
    KEY `FK` (`orderID`),
    CONSTRAINT `orderID` FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 10
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `status`
(
    `statusID` INT                                    NOT NULL,
    `status`   varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
    PRIMARY KEY (`statusID`),
    KEY `Key` (`status`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `user`
(
    `email`     varchar(45) COLLATE utf8mb4_general_ci  NOT NULL,
    `addressID` INT DEFAULT NULL,
    `paymentID` INT DEFAULT NULL,
    `statusID`  INT                                     NOT NULL,
    `cartID`    INT                                     NOT NULL,
    `pass`      varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
    `firstname` varchar(45) COLLATE utf8mb4_general_ci  NOT NULL,
    `lastname`  varchar(45) COLLATE utf8mb4_general_ci  NOT NULL,
    PRIMARY KEY (`email`),
    UNIQUE KEY `email_UNIQUE` (`email`),
    KEY `FK` (`addressID`, `paymentID`, `statusID`, `cartID`),
    KEY `Key` (`pass`, `firstname`, `lastname`),
    KEY `cartID_idx` (`cartID`),
    KEY `paymentID_idx` (`paymentID`),
    KEY `statusID_idx` (`statusID`),
    CONSTRAINT `addressID` FOREIGN KEY (`addressID`) REFERENCES `address` (`addressID`),
    CONSTRAINT `cartID` FOREIGN KEY (`cartID`) REFERENCES `shoppingcart` (`cartID`),
    CONSTRAINT `paymentID` FOREIGN KEY (`paymentID`) REFERENCES `payment` (`paymentID`),
    CONSTRAINT `statusID` FOREIGN KEY (`statusID`) REFERENCES `status` (`statusID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

-- Insert Status
INSERT INTO `status`
(`statusID`,
 `status`)
VALUES (1, 'UNREGISTERED');

INSERT INTO `status`
(`statusID`,
 `status`)
VALUES (2, 'REGISTERED');

INSERT INTO `status`
(`statusID`,
 `status`)
VALUES (3, 'SUSPENDED');


-- Insert binding
INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (1, 'Textbook');

INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (2, 'Novel');

INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (3, 'E-book (Electronic)');

INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (4, 'Audio CD');

INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (5, 'Audiobook');

INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (6, 'Paperback');

INSERT INTO `binding`(`bindingID`, `binding`)
VALUES (7, 'Hardback');

-- Insert genre
INSERT INTO `genre`(`genreID`, `genre`)
VALUES (1, 'Horror');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (2, 'Adventure');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (3, 'Fantasy');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (4, 'Romance');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (5, 'Sci-Fi');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (6, 'Dystopian');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (7, 'Humor');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (8, 'Non-fiction');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (9, 'Biography');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (10, 'Cartoon');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (11, 'Graphic Novels');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (12, 'Children');

INSERT INTO `genre`(`genreID`, `genre`)
VALUES (13, 'Anthology');