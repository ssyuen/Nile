ALTER TABLE `niledb`.`book_orderdetail`
    DROP PRIMARY KEY,
    ADD PRIMARY KEY (`userID_bod_FK`, `ISBN_bod_FK`),
    ADD INDEX `id` (`id` ASC) VISIBLE;
ALTER TABLE `niledb`.`book_orderdetail` RENAME INDEX `usserID_bod_FK_idx` TO `userID_bod_FK_idx`;
ALTER TABLE `niledb`.`book_orderdetail`
    ALTER INDEX `userID_bod_FK_idx` INVISIBLE;
