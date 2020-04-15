alter table promotion
    add name varchar(50) not null after id;

alter table promotion
    add notes varchar(500) not null;
