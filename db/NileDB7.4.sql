alter table promotion
    modify code varchar(45) not null;

alter table promotion
    modify name varchar(50) not null after code;

create unique index promotion_code_uindex
    on promotion (code);
