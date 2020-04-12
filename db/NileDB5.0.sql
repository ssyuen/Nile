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
    AUTO_INCREMENT = 1
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
    AUTO_INCREMENT = 1
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
    AUTO_INCREMENT = 1
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


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
    AUTO_INCREMENT = 1
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
    AUTO_INCREMENT = 1
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
    AUTO_INCREMENT = 1
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
-- Table `niledb`.`book_orderdetail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`book_orderdetail`
(
    `id`          INT         NOT NULL AUTO_INCREMENT,
    `ISBN_bod_FK` VARCHAR(20) NOT NULL,
    `quantity`    INT         NOT NULL DEFAULT '1',
    PRIMARY KEY (`id`),
    INDEX `ISBN_bod_FK` (`ISBN_bod_FK` ASC) VISIBLE,
    CONSTRAINT `ISBN_bod_FK`
        FOREIGN KEY (`ISBN_bod_FK`)
            REFERENCES `niledb`.`book` (`ISBN`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 1
    DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `niledb`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`status`
(
    `id`     INT                                                              NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`status` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 1
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
    PRIMARY KEY (`id`),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    INDEX `Key` (`pass` ASC, `firstname` ASC, `lastname` ASC) VISIBLE,
    INDEX `statusID_user_FK_idx` (`statusID_user_FK` ASC) VISIBLE,
    CONSTRAINT `statusID_user_FK`
        FOREIGN KEY (`statusID_user_FK`)
            REFERENCES `niledb`.`status` (`id`)
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 1
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


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
    `userID_payment_FK`      INT          NOT NULL,
    `billingAddress_addr_FK` INT          NOT NULL,
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
    AUTO_INCREMENT = 1
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `niledb`.`promotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `niledb`.`promotion`
(
    `id`        INT                                                              NOT NULL AUTO_INCREMENT,
    `code`      VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
    `discount`  DOUBLE                                                           NULL DEFAULT NULL,
    `startDate` DATE                                                             NULL DEFAULT NULL,
    `endDate`   DATE                                                             NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `Key` (`code` ASC, `discount` ASC, `startDate` ASC, `endDate` ASC) VISIBLE
)
    ENGINE = InnoDB
    AUTO_INCREMENT = 1
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
    AUTO_INCREMENT = 1
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



INSERT INTO admin (`id`, `email`, `firstName`, `lastName`, `pass`)
VALUES (1, 'manu@nile.com', 'Manu', 'Puduvalli', '$2b$12$TrQ7pMqXkUFKFihGfBV6Y.bi5KqKOp0kaBrKbBXZ1FUg.huCFNJ2e');
INSERT INTO admin (`id`, `email`, `firstName`, `lastName`, `pass`)
VALUES (2, 'sam@nile.com', 'Sam', 'Yuen', '$2b$12$TrQ7pMqXkUFKFihGfBV6Y.bi5KqKOp0kaBrKbBXZ1FUg.huCFNJ2e');



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
VALUES (11, 'Graphic Novels');
INSERT INTO genre (`id`, `genre`)
VALUES (12, 'Children');
INSERT INTO genre (`id`, `genre`)
VALUES (13, 'Anthology');



INSERT INTO status (`id`, `status`)
VALUES (1, 'REGISTERED');
INSERT INTO status (`id`, `status`)
VALUES (3, 'SUSPENDED');
INSERT INTO status (`id`, `status`)
VALUES (2, 'VERIFIED');