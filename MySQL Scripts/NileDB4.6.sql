ALTER TABLE `niledb`.`user_token`
    DROP PRIMARY KEY,
    ADD PRIMARY KEY (`userID_utoken_FK`, `token`);
