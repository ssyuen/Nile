from server import db

# from sqlalchemy import Column, Date, Float, ForeignKey, Index, String, Table, Time, text
from sqlalchemy.dialects.mysql import INTEGER, LONGBLOB
# from sqlalchemy.orm import relationship
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()
# metadata = Base.metadata


class Admin(db.Model):
    __tablename__ = 'Admin'
    __table_args__ = (
        db.Index('Key', 'firstname', 'lastname', 'pw'),
    )

    email = db.Column(db.String(45, 'utf8mb4_general_ci'), primary_key=True, unique=True)
    firstname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)
    lastname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)
    pw = db.Column(db.String(100, 'utf8mb4_general_ci'), nullable=False)


class Address(db.Model):
    __tablename__ = 'address'
    __table_args__ = (
        db.Index('Key', 'street', 'city', 'state', 'zipcode'),
    )

    addressID = db.Column(db.Integer(), primary_key=True)
    street = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    city = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    state = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    zipcode = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)


class Binding(db.Model):
    __tablename__ = 'binding'

    bindingID = db.Column(db.Integer(), primary_key=True)
    binding = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)


class Genre(db.Model):
    __tablename__ = 'genre'

    genreID = db.Column(db.Integer(), primary_key=True)
    genre = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)


class Payment(db.Model):
    __tablename__ = 'payment'
    __table_args__ = (
        db.Index('Key', 'cardNumber', 'address', 'expirationDate'),
    )

    paymentID = db.Column(db.Integer(), primary_key=True)
    cardNumber = db.Column(db.Integer(),nullable=True)
    address = db.Column(db.String(255, 'utf8mb4_general_ci'),nullable=True)
    expirationDate = db.Column(db.Date,nullable=True)


class Promotion(db.Model):
    __tablename__ = 'promotion'
    __table_args__ = (
        db.Index('Key', 'code', 'discount', 'startDate', 'endDate'),
    )

    promotionID = db.Column(db.Integer(), primary_key=True)
    code = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    discount = db.Column(db.Float(asdecimal=True),nullable=True)
    startDate = db.Column(db.Date,nullable=True)
    endDate = db.Column(db.Date,nullable=True)


class Status(db.Model):
    __tablename__ = 'status'

    statusID = db.Column(db.Integer(), primary_key=True)
    status = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False, index=True)

UNREGISTERED = Status(status='UNREGISTERED')
db.session.add(UNREGISTERED)
REGISTERED = Status(status='REGISTERED')
db.session.add(REGISTERED)
SUSPENDED = Status(status='SUSPENDED')
db.session.add(SUSPENDED)


class Book(db.Model):
    __tablename__ = 'book'
    __table_args__ = (
        db.Index('Key', 'title', 'price'),
    )

    isbn = db.Column(db.Integer(), primary_key=True)
    bindingID = db.Column(db.ForeignKey('binding.bindingID'), index=True,nullable=True)
    genreID = db.Column(db.ForeignKey('genre.genreID'), index=True,nullable=True)
    title = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    price = db.Column(db.Float(asdecimal=True),nullable=True)
    numPages = db.Column(db.Integer(),nullable=True)
    image = db.Column(LONGBLOB,nullable=True)
    edition = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    publisher = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    publicationDate = db.Column(db.Date,nullable=True)
    stock = db.Column(db.Integer(),nullable=True)
    authorFirstName = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    authorLastName = db.Column(db.String(45, 'utf8mb4_general_ci'),nullable=True)
    summary = db.Column(db.String(500, 'utf8mb4_general_ci'),nullable=True)

    binding = db.relationship('Binding')
    genre = db.relationship('Genre')


class Order(db.Model):
    __tablename__ = 'orders'
    __table_args__ = (
        db.Index('Key', 'total', 'date'),
    )

    orderID = db.Column(db.Integer(), primary_key=True)
    promotionID = db.Column(db.ForeignKey('promotion.promotionID'), index=True,nullable=True)
    total = db.Column(db.Float(asdecimal=True),nullable=True)
    date = db.Column(db.Date,nullable=True)
    confirmationNumber = db.Column(db.Integer(),nullable=True)
    orderTime = db.Column(db.Time,nullable=True)

    promotion = db.relationship('Promotion')


# t_orderDetails = Table(
#     'orderDetails', metadata,
#     Column('orderID', ForeignKey('orders.orderID'), nullable=False),
#     Column('ISBN', ForeignKey('book.ISBN'), nullable=False, index=True),
#     Column('quantity', INTEGER(10), index=True, server_default=text("'0'")),
#     Index('FK', 'orderID', 'ISBN')
# )
class OrderDetails(db.Model):
    __tablename__ = 'orderDetails'
    __table_args__ = (
        db.Index('FK', 'orderID', 'isbn'),

        # db.UniqueConstraint("isbn","quantity"),
    )
    orderID = db.Column(db.ForeignKey('orders.orderID'),nullable=False,primary_key=True)
    isbn = db.Column(db.ForeignKey('book.isbn'), nullable=False, index=True,primary_key=True)
    quantity = db.Column(db.Integer(),index=True,server_default=db.text("0"),nullable=True)


class ShoppingCart(db.Model):
    __tablename__ = 'shoppingCart'

    cartID = db.Column(db.Integer(), primary_key=True)
    orderID = db.Column(db.ForeignKey('orders.orderID'), index=True,nullable=True)

    order = db.relationship('Order')


class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = (
        db.Index('Key', 'pw', 'firstname', 'lastname'),
        db.Index('FK', 'addressID', 'paymentID', 'statusID', 'cartID'),
    )

    email = db.Column(db.String(45, 'utf8mb4_general_ci'), primary_key=True, unique=True)
    addressID = db.Column(db.ForeignKey('address.addressID'))
    paymentID = db.Column(db.ForeignKey('payment.paymentID'), index=True)
    statusID = db.Column(db.ForeignKey('status.statusID'), nullable=False, index=True)
    cartID = db.Column(db.ForeignKey('shoppingCart.cartID'), nullable=False, index=True)
    pw = db.Column(db.String(100, 'utf8mb4_general_ci'), nullable=False)
    firstname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)
    lastname = db.Column(db.String(45, 'utf8mb4_general_ci'), nullable=False)

    address = db.relationship('Address')
    shoppingCart = db.relationship('ShoppingCart')
    payment = db.relationship('Payment')
    status = db.relationship('Status')

db.create_all()
db.session.commit()