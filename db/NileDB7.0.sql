-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE =
        'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema theniledb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema theniledb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `theniledb`;
-- -----------------------------------------------------
-- Schema niledb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema niledb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `niledb` DEFAULT CHARACTER SET utf8;
USE `theniledb`;
USE `niledb`;

-- -----------------------------------------------------
-- Table `niledb`.`address_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`address_type`
(
    `id`   INT         NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `type_UNIQUE` (`type` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 3
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`address`
(
    `id`                       INT                                                              NOT NULL AUTO_INCREMENT,
    `street1`                  VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `street2`                  VARCHAR(45)                                                      NULL DEFAULT NULL,
    `city`                     VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `zip`                      VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `state`                    VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `country`                  VARCHAR(50)                                                      NULL DEFAULT NULL,
    `addressTypeID_address_FK` INT                                                              NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`street1` ASC, `city` ASC, `state` ASC, `zip` ASC) VISIBLE,
    INDEX `addressTypeId_idx` (`addressTypeID_address_FK` ASC) VISIBLE,
    CONSTRAINT `addressTypeID_address_FK`
        FOREIGN KEY (`addressTypeID_address_FK`)
            REFERENCES `niledb`.`address_type` (`id`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 61
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `niledb`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`admin`
(
    `id`        INT                                                               NOT NULL AUTO_INCREMENT,
    `email`     VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    `firstName` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NOT NULL,
    `lastName`  VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NOT NULL,
    `pass`      VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    INDEX `Key` (`firstName` ASC, `lastName` ASC, `pass` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 4
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `niledb`.`binding`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`binding`
(
    `id`      INT         NOT NULL AUTO_INCREMENT,
    `binding` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `binding_UNIQUE` (`binding` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 8
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`genre`
(
    `id`    INT         NOT NULL AUTO_INCREMENT,
    `genre` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `genre_UNIQUE` (`genre` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 20
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`product_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`product_type`
(
    `id`   INT         NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `product_type_type_uindex` (`type` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 9
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`book`
(
    `ISBN`              VARCHAR(20)                                                        NOT NULL,
    `bindingID_book_FK` INT                                                                NOT NULL,
    `genreID_book_FK`   INT                                                                NOT NULL,
    `typeID_book_FK`    INT                                                                NOT NULL,
    `title`             VARCHAR(200) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NOT NULL,
    `price`             DECIMAL(12, 2)                                                     NOT NULL,
    `numPages`          INT                                                                NULL DEFAULT NULL,
    `nile_cover_ID`     VARCHAR(75)                                                        NULL DEFAULT NULL,
    `edition`           VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'   NULL DEFAULT NULL,
    `publisher`         VARCHAR(255)                                                       NULL DEFAULT NULL,
    `publicationDate`   DATE                                                               NULL DEFAULT NULL,
    `stock`             INT                                                                NOT NULL,
    `authorFirstName`   VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'   NOT NULL,
    `authorLastName`    VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'   NULL DEFAULT NULL,
    `summary`           VARCHAR(2000) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    PRIMARY KEY (`ISBN`),
    INDEX `genreID_book_FK_idx` (`genreID_book_FK` ASC) VISIBLE,
    INDEX `typeID_book_FK_idx` (`typeID_book_FK` ASC) VISIBLE,
    INDEX `bindingID_book_FK_idx` (`bindingID_book_FK` ASC) VISIBLE,
    CONSTRAINT `bindingID_book_FK`
        FOREIGN KEY (`bindingID_book_FK`)
            REFERENCES `niledb`.`binding` (`id`),
    CONSTRAINT `genreID_book_FK`
        FOREIGN KEY (`genreID_book_FK`)
            REFERENCES `niledb`.`genre` (`id`),
    CONSTRAINT `typeID_book_FK`
        FOREIGN KEY (`typeID_book_FK`)
            REFERENCES `niledb`.`product_type` (`id`)
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


-- -----------------------------------------------------
-- Table `niledb`.`payment_method`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`payment_method`
(
    `id`                     INT          NOT NULL AUTO_INCREMENT,
    `firstname`              VARCHAR(45)  NOT NULL,
    `lastname`               VARCHAR(45)  NOT NULL,
    `cardNumber`             VARCHAR(120) NOT NULL,
    `cardType`               VARCHAR(45)  NOT NULL,
    `expirationDate`         DATE         NOT NULL,
    `billingAddress_addr_FK` INT          NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`cardNumber` ASC, `expirationDate` ASC) VISIBLE,
    INDEX `billingAddress_addr_FK_idx` (`billingAddress_addr_FK` ASC) VISIBLE,
    CONSTRAINT `billingAddress_addr_FK`
        FOREIGN KEY (`billingAddress_addr_FK`)
            REFERENCES `niledb`.`address` (`id`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 19
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `niledb`.`user_paymentmethod`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`user_paymentmethod`
(
    `userID_pm_FK`    INT NOT NULL,
    `paymentID_pm_FK` INT NOT NULL,
    PRIMARY KEY (`userID_pm_FK`, `paymentID_pm_FK`),
    INDEX `paymentID_pm_FK_idx` (`paymentID_pm_FK` ASC) VISIBLE,
    CONSTRAINT `paymentID_pm_FK`
        FOREIGN KEY (`paymentID_pm_FK`)
            REFERENCES `niledb`.`payment_method` (`id`),
    CONSTRAINT `userID_pm_FK`
        FOREIGN KEY (`userID_pm_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`status`
(
    `id`     INT                                                              NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `status_UNIQUE` (`status` ASC) VISIBLE,
    INDEX `Key` (`status` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 4
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `niledb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`user`
(
    `id`               INT                                                               NOT NULL AUTO_INCREMENT,
    `email`            VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    `statusID_user_FK` INT                                                               NOT NULL,
    `pass`             VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    `firstname`        VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NOT NULL,
    `lastname`         VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci'  NOT NULL,
    `isSubscribed`     BIT(1)                                                            NOT NULL DEFAULT b'1',
    `def_address`      INT                                                               NULL     DEFAULT NULL,
    `def_payment`      INT                                                               NULL     DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    INDEX `Key` (`pass` ASC, `firstname` ASC, `lastname` ASC) VISIBLE,
    INDEX `statusID_user_FK_idx` (`statusID_user_FK` ASC) VISIBLE,
    INDEX `def_payment_idx` (`def_payment` ASC) VISIBLE,
    INDEX `def_address_idx` (`def_address` ASC) VISIBLE,
    CONSTRAINT `def_address`
        FOREIGN KEY (`def_address`)
            REFERENCES `niledb`.`user_address` (`addressID_ua_FK`),
    CONSTRAINT `def_payment`
        FOREIGN KEY (`def_payment`)
            REFERENCES `niledb`.`user_paymentmethod` (`paymentID_pm_FK`),
    CONSTRAINT `statusID_user_FK`
        FOREIGN KEY (`statusID_user_FK`)
            REFERENCES `niledb`.`status` (`id`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 81
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `niledb`.`book_orderdetail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`book_orderdetail`
(
    `id`            INT         NOT NULL AUTO_INCREMENT,
    `userID_bod_FK` INT         NOT NULL,
    `ISBN_bod_FK`   VARCHAR(20) NOT NULL,
    `quantity`      INT         NOT NULL DEFAULT '1',
    PRIMARY KEY (`userID_bod_FK`, `ISBN_bod_FK`),
    INDEX `ISBN_bod_FK` (`ISBN_bod_FK` ASC) VISIBLE,
    INDEX `userID_bod_FK_idx` (`userID_bod_FK` ASC) INVISIBLE,
    INDEX `id` (`id` ASC) VISIBLE,
    CONSTRAINT `ISBN_bod_FK`
        FOREIGN KEY (`ISBN_bod_FK`)
            REFERENCES `niledb`.`book` (`ISBN`),
    CONSTRAINT `userID_bod_FK`
        FOREIGN KEY (`userID_bod_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 20
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`promotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`promotion`
(
    `id`        INT                                                              NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(50)                                                      NOT NULL,
    `code`      VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `discount`  DOUBLE                                                           NULL DEFAULT NULL,
    `startDate` DATE                                                             NULL DEFAULT NULL,
    `endDate`   DATE                                                             NULL DEFAULT NULL,
    `notes`     VARCHAR(500)                                                     NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`code` ASC, `discount` ASC, `startDate` ASC, `endDate` ASC) VISIBLE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


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
-- Table `niledb`.`user_token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`user_token`
(
    `userID_utoken_FK` INT         NOT NULL,
    `token`            VARCHAR(50) NOT NULL,
    PRIMARY KEY (`userID_utoken_FK`, `token`),
    CONSTRAINT `userID_utoken_FK`
        FOREIGN KEY (`userID_utoken_FK`)
            REFERENCES `niledb`.`user` (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

INSERT INTO address_type (`id`, `type`)
VALUES (1, 'SHIPPING');
INSERT INTO address_type (`id`, `type`)
VALUES (2, 'BILLING');



INSERT INTO status (`id`, `status`)
VALUES (1, 'REGISTERED');
INSERT INTO status (`id`, `status`)
VALUES (3, 'SUSPENDED');
INSERT INTO status (`id`, `status`)
VALUES (2, 'VERIFIED');



INSERT INTO admin (`id`, `email`, `firstName`, `lastName`, `pass`)
VALUES (1, 'manu@nile.com', 'Manu', 'Puduvalli', '$2b$12$TrQ7pMqXkUFKFihGfBV6Y.bi5KqKOp0kaBrKbBXZ1FUg.huCFNJ2e');
INSERT INTO admin (`id`, `email`, `firstName`, `lastName`, `pass`)
VALUES (2, 'sam@nile.com', 'Sam', 'Yuen', '$2b$12$TrQ7pMqXkUFKFihGfBV6Y.bi5KqKOp0kaBrKbBXZ1FUg.huCFNJ2e');



INSERT INTO genre (`id`, `genre`)
VALUES (1, 'Horror');
INSERT INTO genre (`id`, `genre`)
VALUES (2, 'Adventure');
INSERT INTO genre (`id`, `genre`)
VALUES (3, 'Fantasy');
INSERT INTO genre (`id`, `genre`)
VALUES (4, 'Romance');
INSERT INTO genre (`id`, `genre`)
VALUES (5, 'Sci-Fi');
INSERT INTO genre (`id`, `genre`)
VALUES (6, 'Dystopian');
INSERT INTO genre (`id`, `genre`)
VALUES (7, 'Humor');
INSERT INTO genre (`id`, `genre`)
VALUES (8, 'Non-fiction');
INSERT INTO genre (`id`, `genre`)
VALUES (9, 'Biography');
INSERT INTO genre (`id`, `genre`)
VALUES (10, 'Cartoon');
INSERT INTO genre (`id`, `genre`)
VALUES (11, 'Graphic Novel');
INSERT INTO genre (`id`, `genre`)
VALUES (12, 'Children');
INSERT INTO genre (`id`, `genre`)
VALUES (13, 'Anthology');
INSERT INTO genre (`genre`)
VALUES ('Mystery');
INSERT INTO genre (`genre`)
VALUES ('Teen & Young Adult');
INSERT INTO genre (`genre`)
VALUES ('Classics');
INSERT INTO genre (`genre`)
VALUES ('Fiction');
INSERT INTO genre (`genre`)
VALUES ('Classic American');
INSERT INTO genre (`genre`)
VALUES ('International');



INSERT INTO product_type (`id`, `type`)
VALUES (3, 'Audiobook');
INSERT INTO product_type (`id`, `type`)
VALUES (6, 'CD');
INSERT INTO product_type (`id`, `type`)
VALUES (7, 'Cookbook');
INSERT INTO product_type (`id`, `type`)
VALUES (2, 'E-Book');
INSERT INTO product_type (`id`, `type`)
VALUES (5, 'Graphic Novel');
INSERT INTO product_type (`id`, `type`)
VALUES (8, 'Guide/Informative');
INSERT INTO product_type (`id`, `type`)
VALUES (4, 'Novel');
INSERT INTO product_type (`id`, `type`)
VALUES (1, 'Textbook');



INSERT INTO binding (`id`, `binding`)
VALUES (1, 'Paperback');
INSERT INTO binding (`id`, `binding`)
VALUES (2, 'Hardback');



INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780062420701', 2, 3, 4, 'To Kill a Mockingbird', 18.74, 336, 'NILE_CI_0010', '50th Anniversary Edition',
        'Harper', '2015-03-03', 592, 'Harper', 'Lee',
        'Harper Lee\'s Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780066238500', 1, 2, 4, 'The Chronicles of Narnia', 17.99, 768, 'NILE_CI_0003', NULL, 'HarperCollins',
        '2001-10-01', 567, 'C.S.', 'Lewis',
        'Epic battles between good and evil, fantastic creatures, betrayals, heroic deeds, and friendships won and lost all come together in this unforgettable world, which has been enchanting readers of all ages for over sixty years.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780374201234', 2, 8, 8,
        'Python Crash Course, 2nd Edition: A Hands-On, Project-Based Introduction to Programming', 22.55, 544,
        'NILE_CI_0012', '3rd Edition', 'No Starch Press', '2019-05-03', 200, 'Eric', 'Matthes',
        'This is the second edition of the best selling Python book in the world. Python Crash Course, 2nd Edition is a straightforward introduction to the core of Python programming. Author Eric Matthes dispenses with the sort of tedious, unnecessary information that can get in the way of learning how to program, choosing instead to provide a foundation in general programming concepts, Python fundamentals, and problem solving. Three real world projects in the second part of the book allow readers to apply their knowledge in useful ways. Readers will learn how to create a simple video game, use data visualization techniques to make graphs and charts, and build and deploy an interactive web application. Python Crash Course, 2nd Edition teaches beginners the essentials of Python quickly so that they can build practical programs and develop powerful programming techniques.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780452262935', 1, 6, 4, '1984', 7.30, 304, 'NILE_CI_0013', '60th Anniversary edition',
        'Berkley; 60th Anniversary edition (1983)', '1983-01-01', 125, 'George', 'Orwell',
        'Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. With each lie he writes, Winston grows to hate the Party that seeks power for its own sake and persecutes those who dare to commit thoughtcrimes. But as he starts to think for himself, Winston can’t escape the fact that Big Brother is always watching...A startling and haunting novel, 1984 creates an imaginary world that is completely convincing from start to finish. No one can deny the novel’s hold on the imaginations of whole generations, or the power of its admonitions—a power that seems to grow, not lessen, with the passage of time.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780760737934', 1, 11, 5, 'Amazing Fantasy #15', 9.99, 245, 'NILE_CI_0006', '2nd Impression Edition',
        'Barnes & Noble', '2003-01-01', 402, 'Stan', 'Lee',
        'Collects the first appearance of Spider-Man in Amazing Fantasy 15 as well as the next 9 issues in his book. Artwork by Steve Ditko is different than many other marvel works as many of them were drawn by Jack Kirby.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780785141570', 1, 11, 5, 'Wolverine Vs. Hulk', 19.99, 144, 'NILE_CI_0008', NULL, 'Marvel Comics',
        '2017-01-01', 344, 'Stan', 'Lee', 'The First apperance of Wolverine. From the famous Incredible Hulk # 181.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780786856299', 2, 2, 4, 'The Lightning Thief: Percy Jackson', 11.89, 384, 'NILE_CI_0009', NULL,
        'Miramax Books/ Hyperion', '2005-06-28', 502, 'Rick', 'Riordan',
        'Percy Jackson is a good kid, but he can\'t seem to focus on his schoolwork or control his temper. And lately, being away at boarding school is only getting worse-Percy could have sworn his pre-algebra teacher turned into a monster and tried to kill him.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781119235538', 1, 8, 8, 'Beginning Programming with Java For Dummies', 18.19, 560, 'NILE_CI_0004',
        '5th Edition', 'For Dummies', '2017-06-24', 347, 'Barry', 'Burd',
        'Are you new to programming and have decided that Java is your language of choice? Are you a wanna-be programmer looking to learn the hottest lingo around? Look no further! Beginning Programming with Java For Dummies, 5th Edition is the easy-to-follow guide');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781338299144', 1, 2, 4, 'Harry Potter and the Sorcerer\'s Stone', 6.89, 336, 'NILE_CI_0001', NULL,
        'Arthur A. Levine Books', '2018-05-26', 500, 'J.K.', 'Rowling',
        'Harry Potter has never been the star of a Quidditch team, scoring points while riding a broom far above the ground. He knows no spells, has never helped to hatch a dragon, and has never worn a cloak of invisibility.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781419729454', 2, 12, 4, 'Diary of a Wimpy Kid', 13.06, 224, 'NILE_CI_0002', 'Cheesiest Edition',
        'Harry N. Abrams', '2017-08-08', 400, 'Jeff', 'Kinney',
        'This Special CHEESIEST Edition is a must-have for longtime fans of the series and new readers alike. But before you open this book, you might want to cross your fingers—you wouldn’t want to get the Cheese Touch!');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781455525256', 2, 8, 7, 'Gordon Ramsay\'s Home Cooking', 22.49, 320, 'NILE_CI_0005', '2013 Edition',
        'Grand Central Publishing', '2013-04-09', 482, 'Gordon', 'Ramsay',
        'Based on a new cooking show, this book will give experienced as well as novice cooks the desire, confidence and inspiration to get cooking.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781984837158', 2, 12, 4, 'The BFG', 14.99, 224, 'NILE_CI_0007', NULL, 'Puffin Books ', '2019-09-03', 522,
        'Ronald', 'Dahl',
        'The BFG is no ordinary bone-crunching giant. He is far too nice and jumbly. It\'s lucky for Sophie that he is.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781451626650', 1, 7, 4, 'Catch-22: 50th Anniversary Edition (no Series)', 13.99, 96, 'NILE_CI_0024',
        'Anniversary edition', 'Simon & Schuster', '2011-04-05', 12, 'Joseph', 'Heller',
        'This fiftieth-anniversary edition commemorates Joseph Heller’s masterpiece with a new introduction; critical essays and reviews by Norman Mailer, Alfred Kazin, Anthony Burgess, and others; rare papers and photos; and much more.\r\n\r\nNominated as one of America’s best-loved novels by PBS’s The Great American Read.\r\n\r\nSoon to be a Hulu limited series starring Christopher Abbott, George Clooney, Kyle Chandler, and Hugh Laurie.\r\n\r\nFifty years after its original publication, Catch-22 remains a cornerstone of American literature and one of the funniest—and most celebrated—books of all time. In recent years it has been named to “best novels” lists by Time, Newsweek, the Modern Library, and the London Observer.\r\n\r\nSet in Italy during World War II, this is the story of the incomparable, malingering bombardier, Yossarian, a hero who is furious because thousands of people he has never met are trying to kill him. But his real problem is not the enemy—it is his own army, which keeps increasing the number of missions the men must fly to complete their service. Yet if Yossarian makes any attempt to excuse himself from the perilous missions he’s assigned, he’ll be in violation of Catch-22, a hilariously sinister bureaucratic rule: a man is considered insane if he willingly continues to fly dangerous combat missions, but if he makes a formal request to be removed from duty, he is proven sane and therefore ineligible to be relieved.\r\n\r\nThis fiftieth-anniversary edition commemorates Joseph Heller’s masterpiece with a new introduction by Christopher Buckley; a wealth of critical essays and reviews by Norman Mailer, Alfred Kazin, Anthony Burgess, and others; rare papers and photos from Joseph Heller’s personal archive; and much more. Here, at last, is the definitive edition of a classic of world literature.');


INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780762414741', 2, 8, 8, 'The 7 Habits Of Highly Effective Teens', 5.00, 293, 'NILE_CI_0019',
        'Updated Edition', 'Simon & Schuster', '2011-01-18', 15, 'Sean', 'Covey',
        'Over 3 million copies sold.\r\n\r\nOver 800 positive reviews.\r\n\r\nAdapted from the New York Times bestseller The 7 Habits of Highly Effective People, The 7 Habits of Highly Effective Teens is the ultimate teenage success guide—now updated for the digital age.\r\n\r\nImagine you had a roadmap—a step-by-step guide to help you get from where you are now, to where you want to be in the future. Your goals, your dreams, your plans…they’re all within reach. You just need the tools to help you get there.\r\n\r\nThat’s what Sean Covey’s landmark book, The 7 Habits of Highly Effective Teens, has been to millions of teens: a handbook to self-esteem and success. Now updated for the digital age, this classic book applies the timeless principles of 7 Habits to the tough issues and life-changing decisions teens face. Covey provides a simple approach to help teens improve self-image, build friendships, resist peer pressure, achieve their goals, and appreciate their parents, as well as tackle the new challenges of our time, like cyberbullying and social media. In addition, this book is stuffed with cartoons, clever ideas, great quotes, and incredible stories about real teens from all over the world.\r\n\r\nEndorsed by high-achievers such as former 49ers quarterback Steve Young and 28-time Olympic medalist Michael Phelps, The 7 Habits of Highly Effective Teens has become the last word on surviving and thriving as a teen.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780743273565', 1, 4, 4, 'The Great Gatsby', 8.50, 180, 'NILE_CI_0018', '', 'Scribner', '2004-08-30', 1000,
        'F. Scott', 'Fitzgerald',
        'The Great Gatsby, F. Scott Fitzgerald’s third book, stands as the supreme achievement of his career. First published in 1925, this quintessential novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted “gin was the national drink and sex the national obsession,” it is an exquisitely crafted tale of America in the 1920s.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780679732761', 1, 2, 4, 'Invisible Man', 12.14, 581, 'NILE_CI_0026', '2nd edition', 'Vintage Books',
        '1995-01-01', 63, 'Ralph', 'Ellison',
        'A milestone in American literature--a book that has continued to engage readers since its appearance in 1952.\r\n\r\nNominated as one of America’s best-loved novels by PBS’s The Great American Read\r\n\r\n\r\nA first novel by an unknown writer, it remained on the bestseller list for sixteen weeks, won the National Book Award for fiction, and established Ralph Ellison as one of the key writers of the century. The nameless narrator of the novel describes growing up in a black community in the South, attending a Negro college from which he is expelled, moving to New York and becoming the chief spokesman of the Harlem branch of \"the Brotherhood\", and retreating amid violence and confusion to the basement lair of the Invisible Man he imagines himself to be. The book is a passionate and witty tour de force of style, strongly influenced by T.S. Eliot\'s The Waste Land, Joyce, and Dostoevsky.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780671894412', 1, 8, 4, 'All The President\'s Men', 1.00, 349, 'NILE_CI_0023', '2 Edition',
        'Simon & Schuster', '1994-06-16', 20, 'Bob', 'Woodward',
        'The full account of the Watergate scandal from the two Washington Post reporters who broke the story. This is “the work that brought down a presidency…perhaps the most influential piece of journalism in history” (Time, All-Time 100 Best Nonfiction Books).\r\n\r\nThis is the book that changed America. Published just two months before President Nixon’s resignation, All the President’s Men revealed the full scope of the Watergate scandal and introduced for the first time the mysterious “Deep Throat.” Beginning with the story of a simple burglary at Democratic headquarters and then continuing through headline after headline, Bernstein and Woodward deliver the stunning revelations and pieces in the Watergate puzzle that brought about Nixon\'s shocking downfall. Their explosive reports won a Pulitzer Prize for The Washington Post, toppled the president, and have since inspired generations of reporters.\r\n\r\nAll the President’s Men is a riveting detective story, capturing the exhilarating rush of the biggest presidential scandal in U.S. history as it unfolded in real time. It is, as former New York Times managing editor Gene Roberts has called it, “maybe the single greatest reporting effort of all time.”');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780545586177', 1, 6, 4, 'Catching Fire - The Hunger Games (book 2)', 8.14, 400, 'NILE_CI_0029',
        'Reprint edition', 'Scholastic Press', '2013-06-04', 125, 'Suzanne', 'Collins',
        'Suzanne Collins continues the amazing story of Katniss Everdeen in the phenomenal Hunger Games trilogy.\r\n\r\nAgainst all odds, Katniss Everdeen has won the annual Hunger Games with fellow district tribute Peeta Mellark. But it was a victory won by defiance of the Capitol and their harsh rules. Katniss and Peeta should be happy. After all, they have just won for themselves and their families a life of safety and plenty. But there are rumors of rebellion among the subjects, and Katniss and Peeta, to their horror, are the faces of that rebellion. The Capitol is angry. The Capitol wants revenge.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780439023528', 1, 6, 4, 'The Hunger Games (book 1)', 8.00, 384, 'NILE_CI_0028', 'Reprint edition',
        'Scholastic Press', '2010-07-03', 120, 'Suzanne', 'Collins',
        'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. Long ago the districts waged war on the Capitol and were defeated. As part of the surrender terms, each district agreed to send one boy and one girl to appear in an annual televised event called, \"The Hunger Games,\" a fight to the death on live TV. Sixteen-year-old Katniss Everdeen, who lives alone with her mother and younger sister, regards it as a death sentence when she is forced to represent her district in the Games. The terrain, rules, and level of audience participation may change but one thing is constant: kill or be killed.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780385490818', 1, 6, 4, 'The Handmaid\'s Tale', 7.99, 311, 'NILE_CI_0022', '1st Anchor Books edition',
        'Anchor', '1998-03-16', 212, 'Margaret', 'Atwood',
        '#1 New York Times bestseller \r\n\r\nLook for The Testaments, the sequel to The Handmaid’s Tale, available now.\r\n \r\nAn instant classic and eerily prescient cultural phenomenon, from “the patron saint of feminist dystopian fiction” (New York Times). Now an award-winning Hulu series starring Elizabeth Moss.\r\n \r\nIn Margaret Atwood’s dystopian future, environmental disasters and declining birthrates have led to a Second American Civil War. The result is the rise of the Republic of Gilead, a totalitarian regime that enforces rigid social roles and enslaves the few remaining fertile women. Offred is one of these, a Handmaid bound to produce children for one of Gilead’s commanders. Deprived of her husband, her child, her freedom, and even her own name, Offred clings to her memories and her will to survive. At once a scathing satire, an ominous warning, and a tour de force of narrative suspense, The Handmaid’s Tale is a modern classic.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780375714573', 1, 9, 5, 'Persepolis: The Story Of A Childhood (pantheon Graphic Library)', 9.99, 160,
        'NILE_CI_0017', '1st Edition', 'Pantheon', '2004-06-01', 142, 'Marjane', 'Satrapi',
        'In powerful black-and-white comic strip images, Satrapi tells the story of her life in Tehran from ages six to fourteen, years that saw the overthrow of the Shah’s regime, the triumph of the Islamic Revolution, and the devastating effects of war with Iraq. The intelligent and outspoken only child of committed Marxists and the great-granddaughter of one of Iran’s last emperors, Marjane bears witness to a childhood uniquely entwined with the history of her country.\r\n\r\nPersepolis paints an unforgettable portrait of daily life in Iran and of the bewildering contradictions between home life and public life. Marjane’s child’s-eye view of dethroned emperors, state-sanctioned whippings, and heroes of the revolution allows us to learn as she does the history of this fascinating country and of her own extraordinary family. Intensely personal, profoundly political, and wholly original, Persepolis is at once a story of growing up and a reminder of the human cost of war and political repression. It shows how we carry on, with laughter and tears, in the face of absurdity. And, finally, it introduces us to an irresistible little girl with whom we cannot help but fall in love.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780316769174', 1, 18, 4, 'The Catcher In The Rye', 7.34, 288, 'NILE_CI_0027', 'Reissue edition',
        'Back Bay Books', '2001-01-30', 21, 'J.d.', 'Salinger',
        'Anyone who has read J.D. Salinger\'s New Yorker stories--particularly A Perfect Day for Bananafish, Uncle Wiggily in Connecticut, The Laughing Man, and For Esme With Love and Squalor--will not be surprised by the fact that his first novel is full of children. The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.\r\n\r\nThrough circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days. The boy himself is at once too simple and too complex for us to make any final comment about him or his story. Perhaps the safest thing we can say about Holden is that he was born in the world not just strongly attracted to beauty but, almost, hopelessly impaled on it.\r\n\r\nThere are many voices in this novel: children\'s voices, adult voices, underground voices-but Holden\'s voice is the most eloquent of all. Transcending his own vernacular, yet remaining marvelously faithful to it, he issues a perfectly articulated cry of mixed pain and pleasure. However, like most lovers and clowns and poets of the higher orders, he keeps most of the pain to, and for, himself. The pleasure he gives away, or sets aside, with all his heart. It is there for the reader who can handle it to keep.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780312427566', 1, 8, 4, 'The Right Stuff', 10.59, 352, 'NILE_CI_0021', 'Revised Edition', 'Picador',
        '2008-03-04', 412, 'Tom', 'Wolfe',
        'From \"America\'s nerviest journalist\" (Newsweek)--a breath-taking epic, a magnificent adventure story, and an investigation into the true heroism and courage of the first Americans to conquer space. \"Tom Wolfe at his very best\" (The New York Times Book Review)\r\n\r\nMillions of words have poured forth about man\'s trip to the moon, but until now few people have had a sense of the most engrossing side of the adventure; namely, what went on in the minds of the astronauts themselves - in space, on the moon, and even during certain odysseys on earth. It is this, the inner life of the astronauts, that Tom Wolfe describes with his almost uncanny empathetic powers, that made The Right Stuff a classic.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780307743657', 1, 1, 4, 'The Shining', 5.78, 688, 'NILE_CI_0020', 'Reissue Edition', 'Anchor', '2012-06-26',
        500, 'Stephen', 'King',
        'Before Doctor Sleep, there was The Shining, a classic of modern American horror from the undisputed master, Stephen King.\r\n\r\nJack Torrance’s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he’ll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote . . . and more sinister. And the only one to notice the strange and terrible forces gathering around the Overlook is Danny Torrance, a uniquely gifted five-year-old.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780061124952', 2, 12, 4, 'Charlotte\'s Web', 5.40, 192, 'NILE_CI_0025', 'Early edition', 'HarperCollins',
        '2012-04-10', 144, 'E.b.', 'White',
        'Don’t miss one of America’s top 100 most-loved novels, selected by PBS’s The Great American Read.\r\n\r\nThis beloved book by E. B. White, author of Stuart Little and The Trumpet of the Swan, is a classic of children\'s literature that is \"just about perfect.\" This paper-over-board edition includes a foreword by two-time Newbery winning author Kate DiCamillo.\r\n\r\nSome Pig. Humble. Radiant. These are the words in Charlotte\'s Web, high up in Zuckerman\'s barn. Charlotte\'s spiderweb tells of her feelings for a little pig named Wilbur, who simply wants a friend. They also express the love of a girl named Fern, who saved Wilbur\'s life when he was born the runt of his litter.\r\n\r\nE. B. White\'s Newbery Honor Book is a tender novel of friendship, love, life, and death that will continue to be enjoyed by generations to come. It contains illustrations by Garth Williams, the acclaimed illustrator of E. B. White\'s Stuart Little and Laura Ingalls Wilder\'s Little House series, among many other books.');
