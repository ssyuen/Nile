ALTER TABLE `niledb`.`book_orderdetail`
    DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`, `userID_bod_FK`, `ISBN_bod_FK`);

