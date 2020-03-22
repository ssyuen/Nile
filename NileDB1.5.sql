-- MySQL Script generated by MySQL Workbench
-- Fri Mar 13 12:21:48 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

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
CREATE SCHEMA IF NOT EXISTS `nileDB` DEFAULT CHARACTER SET utf8;
USE `nileDB`;

-- -----------------------------------------------------
-- Table  `binding`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `binding`
(
    `bindingID` INT         NOT NULL AUTO_INCREMENT,
    `binding`   VARCHAR(45) NULL,
    PRIMARY KEY (`bindingID`)
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table  `genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `genre`
(
    `genreID` INT         NOT NULL AUTO_INCREMENT,
    `genre`   VARCHAR(45) NULL,
    PRIMARY KEY (`genreID`)
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table  `book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `book`
(
    `ISBN`            INT          NOT NULL AUTO_INCREMENT,
    `bindingID`       INT          NULL,
    `genreID`         INT          NULL,
    `title`           VARCHAR(45)  NULL,
    `price`           DOUBLE       NULL,
    `image`           LONGBLOB     NULL,
    `edition`         VARCHAR(45)  NULL,
    `publisher`       VARCHAR(45)  NULL,
    `publicationDate` VARCHAR(45)  NULL,
    `stock`           INT          NULL,
    `authorFirstName` VARCHAR(45)  NULL,
    `authorLastName`  VARCHAR(45)  NULL,
    `summary`         VARCHAR(500) NULL,
    PRIMARY KEY (`ISBN`),
    INDEX `Key` (`title` ASC, `price` ASC) VISIBLE,
    INDEX `bindingID_idx` (`bindingID` ASC) VISIBLE,
    INDEX `genreID_idx` (`genreID` ASC) VISIBLE,
    CONSTRAINT `bindingID`
        FOREIGN KEY (`bindingID`)
            REFERENCES `binding` (`bindingID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `genreID`
        FOREIGN KEY (`genreID`)
            REFERENCES `genre` (`genreID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table  `status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `status`
(
    `statusID` INT         NOT NULL,
    `status`   VARCHAR(45) NOT NULL,
    PRIMARY KEY (`statusID`),
    INDEX `Key` (`status` ASC) VISIBLE
);


-- -----------------------------------------------------
-- Table  `payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment`
(
    `paymentID`      INT          NOT NULL AUTO_INCREMENT,
    `cardNumber`     INT          NULL DEFAULT NULL,
    `address`        VARCHAR(255) NULL DEFAULT NULL,
    `expirationDate` DATE         NULL DEFAULT NULL,
    PRIMARY KEY (`paymentID`),
    INDEX `Key` (`cardNumber` ASC, `address` ASC, `expirationDate` ASC) VISIBLE
);


-- -----------------------------------------------------
-- Table  `promotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `promotion`
(
    `promotionID` INT         NOT NULL AUTO_INCREMENT,
    `code`        VARCHAR(45) NULL,
    `discount`    DOUBLE      NULL,
    `startDate`   DATE        NULL,
    `endDate`     DATE        NULL,
    PRIMARY KEY (`promotionID`),
    INDEX `Key` (`code` ASC, `discount` ASC, `startDate` ASC, `endDate` ASC) VISIBLE
);


-- -----------------------------------------------------
-- Table  `orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders`
(
    `orderID`            INT    NOT NULL AUTO_INCREMENT,
    `promotionID`        INT    NULL,
    `total`              DOUBLE NULL DEFAULT NULL,
    `date`               DATE   NULL,
    `confirmationNumber` INT    NULL,
    `orderTime`          TIME   NULL,
    PRIMARY KEY (`orderID`),
    INDEX `FK` (`promotionID` ASC) VISIBLE,
    INDEX `Key` (`total` ASC, `date` ASC) VISIBLE,
    CONSTRAINT `promotionID`
        FOREIGN KEY (`promotionID`)
            REFERENCES `promotion` (`promotionID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table  `address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `address`
(
    `addressID` INT         NOT NULL AUTO_INCREMENT,
    `street`    VARCHAR(45) NULL DEFAULT NULL,
    `city`      VARCHAR(45) NULL DEFAULT NULL,
    `state`     VARCHAR(45) NULL DEFAULT NULL,
    `zip`       VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (`addressID`),
    INDEX `Key` (`street` ASC, `city` ASC, `state` ASC, `zip` ASC) VISIBLE
);


-- -----------------------------------------------------
-- Table  `shoppingCart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shoppingCart`
(
    `cartID`  INT NOT NULL AUTO_INCREMENT,
    `orderID` INT NULL,
    PRIMARY KEY (`cartID`),
    INDEX `FK` (`orderID` ASC) VISIBLE,
    CONSTRAINT `orderID`
        FOREIGN KEY (`orderID`)
            REFERENCES `orders` (`orderID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table  `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user`
(
    `email`     VARCHAR(45)  NOT NULL,
    `addressID` INT          NULL,
    `paymentID` INT          NULL,
    `statusID`  INT          NOT NULL,
    `cartID`    INT          NOT NULL,
    `pass`      VARCHAR(100) NOT NULL,
    `firstname` VARCHAR(45)  NOT NULL,
    `lastname`  VARCHAR(45)  NOT NULL,
    PRIMARY KEY (`email`),
    INDEX `FK` (`addressID` ASC, `paymentID` ASC, `statusID` ASC, `cartID` ASC) VISIBLE,
    INDEX `Key` (`pass` ASC, `firstname` ASC, `lastname` ASC) VISIBLE,
    INDEX `cartID_idx` (`cartID` ASC) VISIBLE,
    INDEX `paymentID_idx` (`paymentID` ASC) VISIBLE,
    INDEX `statusID_idx` (`statusID` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    CONSTRAINT `cartID`
        FOREIGN KEY (`cartID`)
            REFERENCES `shoppingCart` (`cartID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `addressID`
        FOREIGN KEY (`addressID`)
            REFERENCES `address` (`addressID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `paymentID`
        FOREIGN KEY (`paymentID`)
            REFERENCES `payment` (`paymentID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `statusID`
        FOREIGN KEY (`statusID`)
            REFERENCES `status` (`statusID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table  `orderDetails`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `orderDetails`
(
    `orderID`  INT NOT NULL,
    `ISBN`     INT NOT NULL,
    `quantity` INT NULL DEFAULT 0,
    INDEX `FK` (`orderID` ASC, `ISBN` ASC) VISIBLE,
    INDEX `Key` (`quantity` ASC) VISIBLE,
    INDEX `bookID_idx` (`ISBN` ASC) VISIBLE,
    CONSTRAINT `ISBN`
        FOREIGN KEY (`ISBN`)
            REFERENCES `book` (`ISBN`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_orderDetails_orders1`
        FOREIGN KEY (`orderID`)
            REFERENCES `orders` (`orderID`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table  `Admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Admin`
(
    `email`     VARCHAR(45)  NOT NULL,
    `firstName` VARCHAR(45)  NOT NULL,
    `lastName`  VARCHAR(45)  NOT NULL,
    `pass`      VARCHAR(100) NOT NULL,
    PRIMARY KEY (`email`),
    INDEX `Key` (`firstName` ASC, `lastName` ASC, `pass` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
);


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


