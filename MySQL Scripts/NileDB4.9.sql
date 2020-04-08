ALTER TABLE `niledb`.`payment_method`
    ADD COLUMN `firstname` VARCHAR(45) NOT NULL AFTER `id`,
    ADD COLUMN `lastname`  VARCHAR(45) NOT NULL AFTER `firstname`;