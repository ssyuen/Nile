ALTER TABLE `niledb`.`book_orderdetail`
    ADD COLUMN `userID_bod_FK` INT NOT NULL AFTER `id`,
    DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`, `userID_bod_FK`, `ISBN_bod_FK`),
    ADD INDEX `usserID_bod_FK_idx` (`userID_bod_FK` ASC) VISIBLE;
;
ALTER TABLE `niledb`.`book_orderdetail`
    ADD CONSTRAINT `usserID_bod_FK`
        FOREIGN KEY (`userID_bod_FK`)
            REFERENCES `niledb`.`user` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;

ALTER TABLE `niledb`.`book_orderdetail`
    DROP FOREIGN KEY `usserID_bod_FK`;
ALTER TABLE `niledb`.`book_orderdetail`
    ADD CONSTRAINT `userID_bod_FK`
        FOREIGN KEY (`userID_bod_FK`)
            REFERENCES `niledb`.`user` (`id`);
