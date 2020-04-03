CREATE TABLE `niledb`.`user_token`
(
    `userID_utoken_FK` INT         NOT NULL,
    `token`            VARCHAR(50) NOT NULL,
    PRIMARY KEY (`userID_utoken_FK`),
    CONSTRAINT `userID_utoken_FK`
        FOREIGN KEY (`userID_utoken_FK`)
            REFERENCES `niledb`.`user` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;
