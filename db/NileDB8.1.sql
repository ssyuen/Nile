alter table `order`
    modify total DECIMAL(12, 2) null;
alter table `order`
    modify salesTax DECIMAL(12, 2) null;
alter table `order`
    modify shippingPrice DECIMAL(12, 2) null;