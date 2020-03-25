-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE =
        'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema niledb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema niledb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `niledb` DEFAULT CHARACTER SET utf8;
USE `niledb`;

-- -----------------------------------------------------
-- Table `niledb`.`address_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`address_type`
(
    `id`   INT         NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(20) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 4
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`address`
(
    `id`                       INT                                                              NOT NULL AUTO_INCREMENT,
    `street`                   VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `city`                     VARCHAR(45) CHARACTER SET 'utf8mb4'                              NULL DEFAULT NULL,
    `zip`                      VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `state`                    VARCHAR(45) CHARACTER SET 'utf8mb4'                              NULL DEFAULT NULL,
    `country`                  VARCHAR(50)                                                      NULL DEFAULT NULL,
    `addressTypeID_address_FK` INT                                                              NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`street` ASC, `city` ASC, `state` ASC, `zip` ASC) VISIBLE,
    INDEX `addressTypeId_idx` (`addressTypeID_address_FK` ASC) VISIBLE,
    CONSTRAINT `addressTypeID_address_FK`
        FOREIGN KEY (`addressTypeID_address_FK`)
            REFERENCES `niledb`.`address_type` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `niledb`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`admin`
(
    `id`        INT                                                               NOT NULL AUTO_INCREMENT,
    `username`  VARCHAR(45)                                                       NOT NULL,
    `email`     VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    `firstName` VARCHAR(45) CHARACTER SET 'utf8mb4'                               NOT NULL,
    `lastName`  VARCHAR(45) CHARACTER SET 'utf8mb4'                               NOT NULL,
    `pass`      VARCHAR(100) CHARACTER SET 'utf8mb4'                              NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
    INDEX `Key` (`firstName` ASC, `lastName` ASC, `pass` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 2
    DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `niledb`.`binding`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`binding`
(
    `id`      INT         NOT NULL AUTO_INCREMENT,
    `binding` VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`genre`
(
    `id`    INT         NOT NULL AUTO_INCREMENT,
    `genre` VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`book`
(
    `ISBN`              VARCHAR(20)                                                       NOT NULL,
    `bindingID_book_FK` INT                                                               NULL DEFAULT NULL,
    `genreID_book_FK`   INT                                                               NULL DEFAULT NULL,
    `title`             VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NULL DEFAULT NULL,
    `price`             DOUBLE                                                            NULL DEFAULT NULL,
    `numPages`          INT                                                               NULL DEFAULT NULL,
    `image`             LONGBLOB                                                          NULL DEFAULT NULL,
    `edition`           VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NULL DEFAULT NULL,
    `publisher`         VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NULL DEFAULT NULL,
    `publicationDate`   DATE                                                              NULL DEFAULT NULL,
    `stock`             INT                                                               NULL DEFAULT NULL,
    `authorFirstName`   VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NULL DEFAULT NULL,
    `authorLastName`    VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NULL DEFAULT NULL,
    `summary`           VARCHAR(500) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    PRIMARY KEY (`ISBN`),
    INDEX `bindingID_book_FK_idx` (`bindingID_book_FK` ASC) VISIBLE,
    INDEX `genreID_book_FK_idx` (`genreID_book_FK` ASC) VISIBLE,
    CONSTRAINT `bindingID_book_FK`
        FOREIGN KEY (`bindingID_book_FK`)
            REFERENCES `niledb`.`binding` (`id`),
    CONSTRAINT `genreID_book_FK`
        FOREIGN KEY (`genreID_book_FK`)
            REFERENCES `niledb`.`genre` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`book_orderdetail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`book_orderdetail`
(
    `id`          INT         NOT NULL AUTO_INCREMENT,
    `ISBN_bod_FK` VARCHAR(20) NOT NULL,
    `quantity`    INT         NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `ISBN_bod_FK` (`ISBN_bod_FK` ASC) VISIBLE,
    CONSTRAINT `ISBN_bod_FK`
        FOREIGN KEY (`ISBN_bod_FK`)
            REFERENCES `niledb`.`book` (`ISBN`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`status`
(
    `id`     INT                                 NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(45) CHARACTER SET 'utf8mb4' NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`status` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 4
    DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `niledb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`user`
(
    `id`               INT                                                               NOT NULL AUTO_INCREMENT,
    `username`         VARCHAR(45)                                                       NOT NULL,
    `email`            VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    `statusID_user_FK` INT                                                               NOT NULL,
    `pass`             VARCHAR(100) CHARACTER SET 'utf8mb4'                              NOT NULL,
    `firstname`        VARCHAR(45) CHARACTER SET 'utf8mb4'                               NOT NULL,
    `lastname`         VARCHAR(45) CHARACTER SET 'utf8mb4'                               NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    INDEX `Key` (`pass` ASC, `firstname` ASC, `lastname` ASC) VISIBLE,
    INDEX `statusID_user_FK_idx` (`statusID_user_FK` ASC) VISIBLE,
    CONSTRAINT `statusID_user_FK`
        FOREIGN KEY (`statusID_user_FK`)
            REFERENCES `niledb`.`status` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `niledb`.`payment_method`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`payment_method`
(
    `id`                     INT         NOT NULL AUTO_INCREMENT,
    `cardNumber`             INT         NOT NULL,
    `cardType`               VARCHAR(45) NOT NULL,
    `expirationDate`         DATE        NOT NULL,
    `userID_payment_FK`      INT         NOT NULL,
    `billingAddress_addr_FK` INT         NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`cardNumber` ASC, `expirationDate` ASC) VISIBLE,
    INDEX `UserId_idx` (`userID_payment_FK` ASC) VISIBLE,
    INDEX `userID_payment_FK_idx` (`userID_payment_FK` ASC) VISIBLE,
    INDEX `billingAddress_addr_FK_idx` (`billingAddress_addr_FK` ASC) VISIBLE,
    CONSTRAINT `billingAddress_addr_FK`
        FOREIGN KEY (`billingAddress_addr_FK`)
            REFERENCES `niledb`.`address` (`id`),
    CONSTRAINT `userID_payment_FK`
        FOREIGN KEY (`userID_payment_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `niledb`.`promotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`promotion`
(
    `id`        INT                                 NOT NULL AUTO_INCREMENT,
    `code`      VARCHAR(45) CHARACTER SET 'utf8mb4' NULL DEFAULT NULL,
    `discount`  DOUBLE                              NULL DEFAULT NULL,
    `startDate` DATE                                NULL DEFAULT NULL,
    `endDate`   DATE                                NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`code` ASC, `discount` ASC, `startDate` ASC, `endDate` ASC) VISIBLE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `niledb`.`order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`order`
(
    `id`                      INT         NOT NULL AUTO_INCREMENT,
    `userID_order_FK`         INT         NOT NULL,
    `paymentID_order_FK`      INT         NOT NULL,
    `total`                   FLOAT       NULL DEFAULT NULL,
    `salesTax`                FLOAT       NULL DEFAULT NULL,
    `shippingPrice`           FLOAT       NULL DEFAULT NULL,
    `dateOrdered`             DATE        NULL DEFAULT NULL,
    `promotionID`             INT         NULL DEFAULT NULL,
    `confirmationNumber`      VARCHAR(45) NULL DEFAULT NULL,
    `shippingAddrID_order_FK` INT         NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `userID_order_FK_idx` (`userID_order_FK` ASC) VISIBLE,
    INDEX `paymentID_order_FK_idx` (`paymentID_order_FK` ASC) VISIBLE,
    INDEX `promotionID_idx` (`promotionID` ASC) VISIBLE,
    INDEX `shippingAddrID_order_FK_idx` (`shippingAddrID_order_FK` ASC) VISIBLE,
    CONSTRAINT `paymentID_order_FK`
        FOREIGN KEY (`paymentID_order_FK`)
            REFERENCES `niledb`.`payment_method` (`id`),
    CONSTRAINT `promotionID`
        FOREIGN KEY (`promotionID`)
            REFERENCES `niledb`.`promotion` (`id`),
    CONSTRAINT `shippingAddrID_order_FK`
        FOREIGN KEY (`shippingAddrID_order_FK`)
            REFERENCES `niledb`.`address` (`id`),
    CONSTRAINT `userID_order_FK`
        FOREIGN KEY (`userID_order_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`order_bod`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`order_bod`
(
    `orderID_obod_FK` INT NOT NULL,
    `bodID_obod_FK`   INT NOT NULL,
    PRIMARY KEY (`orderID_obod_FK`, `bodID_obod_FK`),
    INDEX `bodID_obod_FK_idx` (`bodID_obod_FK` ASC) VISIBLE,
    CONSTRAINT `bodID_obod_FK`
        FOREIGN KEY (`bodID_obod_FK`)
            REFERENCES `niledb`.`book_orderdetail` (`id`),
    CONSTRAINT `orderID_obod_FK`
        FOREIGN KEY (`orderID_obod_FK`)
            REFERENCES `niledb`.`order` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`shoppingcart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`shoppingcart`
(
    `userID_sc_FK` INT NOT NULL,
    `bod_sc_FK`    INT NOT NULL,
    PRIMARY KEY (`userID_sc_FK`, `bod_sc_FK`),
    INDEX `bod_sc_FK_idx` (`bod_sc_FK` ASC) VISIBLE,
    CONSTRAINT `bod_sc_FK`
        FOREIGN KEY (`bod_sc_FK`)
            REFERENCES `niledb`.`book_orderdetail` (`id`),
    CONSTRAINT `userID_sc_FK`
        FOREIGN KEY (`userID_sc_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`user_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`user_address`
(
    `userID_ua_FK`    INT NOT NULL,
    `addressID_ua_FK` INT NOT NULL,
    PRIMARY KEY (`userID_ua_FK`, `addressID_ua_FK`),
    INDEX `addressID_ua_FK_idx` (`addressID_ua_FK` ASC) VISIBLE,
    CONSTRAINT `addressID_ua_FK`
        FOREIGN KEY (`addressID_ua_FK`)
            REFERENCES `niledb`.`address` (`id`),
    CONSTRAINT `userID_ua_FK`
        FOREIGN KEY (`userID_ua_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

-- Insert Address Type
INSERT INTO address_type(`type`)
VALUES ('SHIPPING');
INSERT INTO address_type(`type`)
VALUES ('BILLING');

-- Insert Status
INSERT INTO `status` (`status`)
VALUES ('UNREGISTERED');
INSERT INTO `status` (`status`)
VALUES ('REGISTERED');
INSERT INTO `status` (`status`)
VALUES ('SUSPENDED');

-- Insert binding
INSERT INTO `binding`(`binding`)
VALUES ('Textbook');
INSERT INTO `binding`(`binding`)
VALUES ('Novel');
INSERT INTO `binding`(`binding`)
VALUES ('E-book (Electronic)');
INSERT INTO `binding`(`binding`)
VALUES ('Audio CD');
INSERT INTO `binding`(`binding`)
VALUES ('Audiobook');
INSERT INTO `binding`(`binding`)
VALUES ('Paperback');
INSERT INTO `binding`(`binding`)
VALUES ('Hardback');

-- Insert genre
INSERT INTO `genre`(`genre`)
VALUES ('Horror');
INSERT INTO `genre`(`genre`)
VALUES ('Adventure');
INSERT INTO `genre`(`genre`)
VALUES ('Fantasy');
INSERT INTO `genre`(`genre`)
VALUES ('Romance');
INSERT INTO `genre`(`genre`)
VALUES ('Sci-Fi');
INSERT INTO `genre`(`genre`)
VALUES ('Dystopian');
INSERT INTO `genre`(`genre`)
VALUES ('Humor');
INSERT INTO `genre`(`genre`)
VALUES ('Non-fiction');
INSERT INTO `genre`(`genre`)
VALUES ('Biography');
INSERT INTO `genre`(`genre`)
VALUES ('Cartoon');
INSERT INTO `genre`(`genre`)
VALUES ('Graphic Novels');
INSERT INTO `genre`(`genre`)
VALUES ('Children');
INSERT INTO `genre`(`genre`)
VALUES ('Anthology');

