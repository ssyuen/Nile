ALTER TABLE niledb.payment_method
    CHANGE COLUMN cardType cardType VARCHAR(45) NULL;

ALTER TABLE niledb.payment_method
    CHANGE COLUMN cardNumber cardNumber VARCHAR(100) NOT NULL;