from server import db

from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine,MetaData,Table,Column,ForeignKey
from sqlalchemy.orm import Session


metadata = MetaData()
Base = automap_base()
engine = create_engine('mysql://root:root@localhost')
Base.prepare(engine,reflect=True,schema="nileormport")

# NOT FOLLOWING CAMEL-CASE DUE TO THESE BEING INSTANTIATED CLASSES
Address = Base.classes.address

AddressType = Base.classes.address_type

Admin = Base.classes.admin

Binding = Base.classes.binding

Book = Base.classes.book

BookOrderdetail = Base.classes.book_orderdetail

Genre = Base.classes.genre

Order = Base.classes.order

OrderBod = Base.classes.order_bod

PaymentMethod = Base.classes.payment_method

ProductType = Base.classes.product_type

Promotion = Base.classes.promotion

Shoppingcart = Base.classes.shoppingcart

Status = Base.classes.status

User = Base.classes.user

UserAddress = Base.classes.user_address

UserPaymentmethod = Base.classes.user_paymentmethod

UserToken = Base.classes.user_token

db_session = Session(engine)