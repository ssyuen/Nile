ALTER TABLE book
    MODIFY `image` varchar(75);
ALTER TABLE book RENAME COLUMN `image` TO `nile_cover_ID`;