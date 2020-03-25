ALTER TABLE `niledb`.`address`
    ADD COLUMN `street2`             VARCHAR(45)                                                      NULL AFTER `street1`,
    CHANGE COLUMN `street` `street1` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL;