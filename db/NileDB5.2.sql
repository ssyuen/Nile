ALTER TABLE `niledb`.`address_type`
    CHANGE COLUMN `type` `type` VARCHAR(20) NOT NULL,
    ADD UNIQUE INDEX `type_UNIQUE` (`type` ASC) VISIBLE;

ALTER TABLE `niledb`.`binding`
    CHANGE COLUMN `binding` `binding` VARCHAR(45) NOT NULL,
    ADD UNIQUE INDEX `binding_UNIQUE` (`binding` ASC) VISIBLE;

ALTER TABLE `niledb`.`genre`
    CHANGE COLUMN `genre` `genre` VARCHAR(45) NOT NULL,
    ADD UNIQUE INDEX `genre_UNIQUE` (`genre` ASC) VISIBLE;

ALTER TABLE `niledb`.`status`
    ADD UNIQUE INDEX `status_UNIQUE` (`status` ASC) VISIBLE;